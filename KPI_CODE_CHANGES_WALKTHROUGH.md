# KPI Implementation - Code Changes Walkthrough

This document shows the exact code changes made to implement the KPI model, following the Task model as reference.

---

## File 1: Type Definitions (`src/types/kpi.ts`)

### What This File Does
Defines all TypeScript interfaces for KPI data, similar to how `dashboard.ts` defines TaskItem and Project.

### Complete File Content

```typescript
// filepath: src/types/kpi.ts
// KPI Type Definitions

/**
 * Main KPI Interface
 * Represents a Key Performance Indicator with values and tracking
 */
export type KPITrend = 'up' | 'down' | 'neutral';
export type KPIUnit = '' | '$' | '%' | 'hrs' | 'days';

export interface KPI {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // KPI title/name
  
  // Value tracking - the core of KPI
  startValue?: number;           // Starting/baseline value
  value: number;                 // Current value (at end of period)
  target: number;                // Target value (goal to achieve)
  unit: KPIUnit;                 // Unit type: currency, percentage, hours, days, etc
  
  // Status & metrics
  trend: KPITrend;               // Direction: up, down, or neutral
  percentageComplete?: number;   // Calculated: (value/target)*100
  percentageChange: number;      // Percentage change from previous period
  
  // Metadata
  createdAt?: string;            // ISO timestamp
  updatedAt?: string;            // ISO timestamp
  createdBy?: string;            // User ID who created
  circleId?: number;             // Parent circle
  description?: string;          // Description of KPI
  history?: KPIHistory[];        // Historical data points
}

/**
 * Historical data points for charting
 * Tracks how KPI values changed over time
 */
export interface KPIHistory {
  id: string;
  value: number;                 // Value at this point in time
  target: number;                // Target at this point
  percentageComplete: number;    // Progress percentage
  recordedAt: string;            // When this was recorded (ISO timestamp)
}

/**
 * Data for creating a new KPI
 * Used when user submits the create form
 */
export interface CreateKPIData {
  name: string;
  startValue?: number;           // Optional baseline
  currentValue: number;          // Current value
  targetValue: number;           // Target value
  unit: KPIUnit;
  description?: string;
}

/**
 * Data for updating an existing KPI
 * Any field can be optionally updated
 */
export interface UpdateKPIData {
  name?: string;
  currentValue?: number;
  targetValue?: number;
  unit?: KPIUnit;
  description?: string;
}

/**
 * Form data structure
 * Used by CreateKPIModal component
 */
export interface KPIFormData {
  name: string;
  value: number;
  target: number;
  unit: string;
}
```

### Key Points Explained

```
Type Definitions          │  Comparison to Task
─────────────────────────┼─────────────────────────
KPITrend (type)          │  TaskStatus (enum)
  - Simple union type    │  - More complex enum
  - 3 values: up/down    │  - 5 values: NotStarted...
  - Lightweight          │  - Heavy

KPIUnit (type)           │  ProjectColor (enum)
  - 5 measurement units  │  - 6 color options
  - For display          │  - For UI styling
  - Flexible             │  - Fixed choices

value/target/percentage  │  No direct equivalent
  - Core KPI metrics     │  - Task is status-based
  - Mathematical         │  - State-based
  - Always calculated    │  - Derived from state
```

---

## File 2: API Service (`src/services/kpiService.ts`)

### What This File Does
Provides functions to communicate with the backend API. Each function handles one type of operation (GET, POST, PUT, DELETE).

### Complete File Content

```typescript
// filepath: src/services/kpiService.ts
// KPI Service - API Integration Layer

import api from './authService';
import { KPI, KPIHistory, KPIUnit } from '../types/kpi';

/**
 * Request body structure for creating KPI
 */
export interface CreateKPIData {
  name: string;
  startValue?: number;
  value: number;
  target: number;
  unit: KPIUnit;
  description?: string;
}

/**
 * Request body structure for updating KPI
 */
export interface UpdateKPIData {
  name?: string;
  value?: number;
  target?: number;
  unit?: KPIUnit;
  description?: string;
}

/**
 * KPI Service Object
 * Contains all API methods for KPI operations
 */
export const kpiService = {
  /**
   * Fetch all KPIs for a specific circle
   * @param circleId - The circle ID to fetch KPIs for
   * @returns Array of KPI objects
   * 
   * API Call: GET /kpi/kpis/?circle_id=1
   * 
   * Example:
   *   const kpis = await kpiService.getKPIs(1);
   *   // Returns: [
   *   //   { id: '123', name: 'Revenue', value: 45000, target: 50000, ... },
   *   //   { id: '456', name: 'Members', value: 35, target: 50, ... }
   *   // ]
   */
  getKPIs: async (circleId: number): Promise<KPI[]> => {
    try {
      const response = await api.get(`/kpi/kpis/`, {
        params: { circle_id: circleId }
      });
      // Backend returns either { results: [...] } or just [...]
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  },

  /**
   * Fetch a single KPI by ID
   * @param kpiId - The KPI ID to fetch
   * @returns Single KPI object
   * 
   * API Call: GET /kpi/kpis/{id}/
   * 
   * Example:
   *   const kpi = await kpiService.getKPI('123e4567-e89b-12d3-a456-426614174000');
   */
  getKPI: async (kpiId: string): Promise<KPI> => {
    try {
      const response = await api.get(`/kpi/kpis/${kpiId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI:', error);
      throw error;
    }
  },

  /**
   * Create a new KPI
   * @param circleId - The circle to create KPI in
   * @param kpiData - The KPI data (name, value, target, unit, etc)
   * @returns Created KPI object with ID and timestamps
   * 
   * API Call: POST /kpi/kpis/
   * 
   * Example:
   *   const newKPI = await kpiService.createKPI(1, {
   *     name: 'Monthly Revenue',
   *     startValue: 40000,
   *     value: 45000,
   *     target: 50000,
   *     unit: '$',
   *     description: 'Track monthly revenue'
   *   });
   *   // Returns: { id: 'newly-generated-uuid', ...kpiData, createdAt, ... }
   */
  createKPI: async (circleId: number, kpiData: CreateKPIData): Promise<KPI> => {
    try {
      const payload = {
        ...kpiData,
        circle_id: circleId
      };
      const response = await api.post(`/kpi/kpis/`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating KPI:', error);
      throw error;
    }
  },

  /**
   * Update an existing KPI
   * @param kpiId - The KPI ID to update
   * @param kpiData - The fields to update (partial)
   * @returns Updated KPI object
   * 
   * API Call: PUT /kpi/kpis/{id}/
   * 
   * Example:
   *   const updated = await kpiService.updateKPI('123', {
   *     value: 48000,
   *     target: 52000,
   *     name: 'Updated name'
   *   });
   */
  updateKPI: async (kpiId: string, kpiData: UpdateKPIData): Promise<KPI> => {
    try {
      const response = await api.put(`/kpi/kpis/${kpiId}/`, kpiData);
      return response.data;
    } catch (error) {
      console.error('Error updating KPI:', error);
      throw error;
    }
  },

  /**
   * Update only the current value of a KPI (quick update)
   * Useful when you only want to change the value, not other fields
   * 
   * @param kpiId - The KPI ID to update
   * @param currentValue - The new current value
   * @returns Updated KPI object
   * 
   * API Call: POST /kpi/kpis/{id}/update-value/
   * 
   * Example:
   *   const updated = await kpiService.updateKPIValue('123', 48500);
   *   // Much faster than updateKPI when only changing value
   */
  updateKPIValue: async (kpiId: string, currentValue: number): Promise<KPI> => {
    try {
      const response = await api.post(`/kpi/kpis/${kpiId}/update-value/`, {
        current_value: currentValue
      });
      return response.data;
    } catch (error) {
      console.error('Error updating KPI value:', error);
      throw error;
    }
  },

  /**
   * Get historical data for a KPI (for charts)
   * @param kpiId - The KPI ID
   * @param days - Number of days of history to fetch (default: 30)
   * @returns Array of KPI history records
   * 
   * API Call: GET /kpi/kpis/{id}/history/?days=30&limit=100
   * 
   * Example:
   *   const history = await kpiService.getKPIHistory('123', 30);
   *   // Returns: [
   *   //   { value: 47500, target: 50000, percentageComplete: 95, recordedAt: '2025-12-27...' },
   *   //   { value: 45000, target: 50000, percentageComplete: 90, recordedAt: '2025-12-20...' }
   *   // ]
   */
  getKPIHistory: async (kpiId: string, days: number = 30): Promise<KPIHistory[]> => {
    try {
      const response = await api.get(`/kpi/kpis/${kpiId}/history/`, {
        params: { days, limit: 100 }
      });
      return response.data.history || response.data;
    } catch (error) {
      console.error('Error fetching KPI history:', error);
      throw error;
    }
  },

  /**
   * Delete a KPI
   * @param kpiId - The KPI ID to delete
   * 
   * API Call: DELETE /kpi/kpis/{id}/
   * 
   * Example:
   *   await kpiService.deleteKPI('123');
   */
  deleteKPI: async (kpiId: string): Promise<void> => {
    try {
      await api.delete(`/kpi/kpis/${kpiId}/`);
    } catch (error) {
      console.error('Error deleting KPI:', error);
      throw error;
    }
  }
};
```

### Method Comparison to TaskDetailModal

```
KPI Service Methods                Task Modal Methods
─────────────────────────────────────────────────────
getKPIs()                          handleLoadTasks() [implied]
  - Fetch all for circle           - Get from parent props

getKPI(id)                         useEffect → task prop
  - Fetch single                   - Loaded as prop

createKPI()                        handleSave() [new task]
  - POST to backend                - onTaskUpdated callback

updateKPI()                        handleSave() [edit task]
  - PUT to backend                 - onTaskUpdated callback

updateKPIValue()                   No equivalent
  - Quick update only              - Updates full task object

getKPIHistory()                    No equivalent
  - Fetch chart data               - No history tracking

deleteKPI()                        handleDelete()
  - DELETE from backend            - onTaskDeleted callback
```

---

## File 3: Component Integration (`src/pages/circles/components/KPIManager.tsx`)

### What This File Does
Main component that:
1. Fetches KPIs from API on mount
2. Displays them in a list with progress bars/charts
3. Handles create/edit/delete operations
4. Shows loading and error states

### Key Code Sections

#### Imports & Props
```typescript
import { useState, useEffect } from 'react';
import { COLORS } from '../../../utils/colors';
import CreateKPIModal, { KPIFormData } from './CreateKPIModal';
import { kpiService } from '../../../services/kpiService';
import { KPI } from '../../../types/kpi';

// Props - what parent component passes in
interface KPIManagerProps {
  circleId: number;      // Which circle's KPIs to show
  isModerator: boolean;  // Can user create/delete?
}

export default function KPIManager({ circleId: _circleId, isModerator }: KPIManagerProps) {
  const circleId = _circleId || 1; // Default to circle 1 for testing
```

**Comparison to TaskDetailModal:**
```
TaskDetailModal Props          KPIManager Props
────────────────────────────────────────────────
isOpen: boolean                (embedded in manager)
onClose: () => void            (not needed)
task: TaskItem | null          (loaded in component)
projects: Project[]            (not needed)
onTaskUpdated: callback         (direct API calls)
onTaskDeleted: callback         (direct API calls)
isModerator: boolean           ✓ Same
```

#### State Management
```typescript
// Data
const [kpis, setKpis] = useState<KPI[]>([]);

// UI States
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Component state
const [kpiViewModes, setKpiViewModes] = useState<Record<string, 'standard' | 'chart'>>({});
const [showCreateModal, setShowCreateModal] = useState(false);
```

**Comparison to TaskDetailModal:**
```
TaskDetailModal State          KPIManager State
────────────────────────────────────────────────
isEditing: boolean             showCreateModal: boolean
title: string                  (in form data)
description: string            (in form data)
priority: TaskPriority         (not applicable)
status: TaskStatus             (not applicable)
                              
                              kpis: KPI[]
                              loading: boolean
                              error: string | null
```

#### Auto-fetch on Mount (Key Difference)
```typescript
// This is what makes KPI dynamic, Task is static
useEffect(() => {
  const fetchKPIs = async () => {
    try {
      setLoading(true);
      
      // Call service to fetch
      const data = await kpiService.getKPIs(circleId);
      
      // Update state
      setKpis(data);
      
      // Initialize view modes for each KPI
      setKpiViewModes(data.reduce((acc, kpi) => ({ 
        ...acc, 
        [kpi.id]: 'standard' 
      }), {}));
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error('Failed to load KPIs:', err);
      setError('Failed to load KPIs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Only fetch if circleId is valid
  if (circleId) {
    fetchKPIs();
  }
}, [circleId]); // Re-fetch when circle changes
```

**Why this is different from Task:**
```
Task (Static)                    KPI (Dynamic)
─────────────────────────────────────────────
- Passed as prop               - Fetched from API
- useEffect watches prop       - useEffect fetches data
- Modal shows existing data    - Manager manages list

Analogy:
Task = Viewing a document      KPI = Browsing a feed
(static, display mode)          (dynamic, refresh mode)
```

#### Create Operation
```typescript
const handleCreateKPI = async (kpiData: KPIFormData) => {
  try {
    // Call service to create
    const newKPI = await kpiService.createKPI(circleId, {
      name: kpiData.name,
      value: kpiData.value,
      target: kpiData.target,
      unit: kpiData.unit as any
    });
    
    // Add to state
    setKpis(prev => [...prev, newKPI]);
    
    // Update view modes for new KPI
    setKpiViewModes(prev => ({ 
      ...prev, 
      [newKPI.id]: 'standard' 
    }));
    
    // Close modal
    setShowCreateModal(false);
  } catch (err) {
    setError('Failed to create KPI');
    console.error(err);
  }
};
```

**Comparison to TaskDetailModal:**
```
Task handleSave()              KPI handleCreateKPI()
────────────────────────────────────────────────────
Calls onTaskUpdated()          Calls kpiService.createKPI()
  (parent callback)              (API call)

Updates parent state           Updates local state
  (prop-based)                  (direct state)

Closes modal                   Closes modal
  (onClose)                      (setShowCreateModal)
```

#### View Toggle (Unique to KPI)
```typescript
const toggleKpiView = (kpiId: string) => {
  setKpiViewModes(prev => ({
    ...prev,
    [kpiId]: prev[kpiId] === 'standard' ? 'chart' : 'standard'
  }));
};

// Usage in JSX:
<button onClick={() => toggleKpiView(kpi.id)}>
  {kpiViewModes[kpi.id] === 'standard' ? 'Show Chart' : 'Show List'}
</button>
```

**This has no Task equivalent because:**
- Tasks are always shown in detail (modal)
- KPIs need multiple view types (list vs chart)
- KPIs are metrics (benefit from visualization)
- Tasks are work items (list view is primary)

#### Rendering Functions

**Trend Icon:**
```typescript
const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  if (trend === 'up') {
    return <svg>...up arrow...</svg>;
  } else if (trend === 'down') {
    return <svg>...down arrow...</svg>;
  }
  return <svg>...horizontal line...</svg>;
};

// No Task equivalent - tasks don't have trends
```

**Progress Percentage:**
```typescript
const getProgressPercentage = (value: number, target: number) => {
  return Math.min((value / target) * 100, 100);
};

// Used in progress bar width
<div style={{ width: `${getProgressPercentage(kpi.value, kpi.target)}%` }} />
```

**Circular Chart:**
```typescript
const renderCircularChart = (kpi: KPI) => {
  const progressPercentage = getProgressPercentage(kpi.value, kpi.target);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
  const strokeColor = progressPercentage >= 100 ? '#10B981' : COLORS.primary;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="6"
      />
      {/* Progress circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
      {/* Percentage text */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dy=".3em"
        fontSize="20"
        fontWeight="bold"
        fill={strokeColor}
      >
        {progressPercentage.toFixed(0)}%
      </text>
    </svg>
  );
};

// Task equivalent: Status badge (simpler)
```

---

## File 4: Create Modal (`src/pages/circles/components/CreateKPIModal.tsx`)

### What This File Does
Modal form for creating new KPIs, similar to how you create tasks.

### Key Component Structure

```typescript
export interface KPIFormData {
  name: string;
  value: number;
  target: number;
  unit: string;
}

interface CreateKPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: KPIFormData) => void;
}

export default function CreateKPIModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: CreateKPIModalProps) {
  const [formData, setFormData] = useState<KPIFormData>({
    name: '',
    value: 0,
    target: 100,
    unit: ''
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a KPI name');
      return;
    }
    
    onSubmit(formData);
    setFormData({ name: '', value: 0, target: 100, unit: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Create KPI</h2>
        
        {/* Form fields */}
        <input
          type="text"
          placeholder="KPI Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        />
        
        <input
          type="number"
          placeholder="Current Value"
          value={formData.value}
          onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        />
        
        <input
          type="number"
          placeholder="Target Value"
          value={formData.target}
          onChange={(e) => setFormData({...formData, target: parseFloat(e.target.value)})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        />
        
        <select
          value={formData.unit}
          onChange={(e) => setFormData({...formData, unit: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        >
          <option value="">None</option>
          <option value="$">Currency ($)</option>
          <option value="%">Percentage (%)</option>
          <option value="hrs">Hours</option>
          <option value="days">Days</option>
        </select>
        
        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Create KPI
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Summary of Changes

### Files Created
1. ✅ `src/types/kpi.ts` - Type definitions (55 lines)
2. ✅ `src/services/kpiService.ts` - API service (123 lines)
3. ✅ `src/pages/circles/components/KPIManager.tsx` - Main component (~280 lines)
4. ✅ `src/pages/circles/components/CreateKPIModal.tsx` - Create modal (~120 lines)

### Key Differences from Task Model

| Aspect | Task | KPI | Why |
|--------|------|-----|-----|
| **Type Definition** | Complex enum | Simple union type | Tasks have many statuses, KPIs just track direction |
| **Data Fetching** | Via parent props | useEffect + service | KPIs are dynamic, Tasks are static |
| **API Calls** | Parent callback | Direct service calls | Different update patterns |
| **View Types** | Detail only (modal) | List + Chart | KPIs need visualization |
| **Update Pattern** | Callback to parent | Direct state update | KPIs are self-contained |
| **Values** | Implicit (status) | Explicit (numbers) | KPIs are numeric metrics |

### Build Status
✅ TypeScript compilation: 0 errors  
✅ Build output: 3.85s, 234 modules  
✅ Bundle size impact: ~2.5 KB  

