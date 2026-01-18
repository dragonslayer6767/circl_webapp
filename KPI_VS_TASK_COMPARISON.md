# KPI Model vs Task Model - Side by Side Comparison

## File Locations

```
Frontend Types:
├── src/types/dashboard.ts    ← TaskItem, Project, TaskStatus, TaskPriority
└── src/types/kpi.ts         ← KPI, KPIHistory, KPITrend, KPIUnit

Service Layer:
├── src/services/taskService.ts  ← (if exists)
└── src/services/kpiService.ts   ← getKPIs, createKPI, updateKPI, deleteKPI

Components:
├── src/pages/circles/components/TaskDetailModal.tsx     ← Task editing
└── src/pages/circles/components/KPIManager.tsx          ← KPI management
```

---

## Complete Side-by-Side Comparison

### 1. INTERFACE DEFINITIONS

#### Task Model (from TaskDetailModal.tsx)
```typescript
export interface TaskItem {
  id: string;                      // UUID
  title: string;                   // Task name
  description: string;             // Full description
  status: TaskStatus;              // Enum: NotStarted, InProgress, Paused, Blocked, Completed
  priority: TaskPriority;          // Enum: Low, Medium, High, Critical
  projectId?: string;              // Parent project
  team?: string;                   // Team name (Engineering, Marketing, etc)
  assignees: string[];             // Multiple people
  startDate: Date;                 // When task starts
  endDate: Date;                   // When task is due
  createdAt: Date;                 // Created timestamp
  completedAt?: Date;              // When task was finished
}

export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Paused = 'Paused',
  Blocked = 'Blocked',
  Completed = 'Completed'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}
```

#### KPI Model (from src/types/kpi.ts)
```typescript
export interface KPI {
  id: string;                      // UUID
  name: string;                    // KPI name
  description?: string;            // Description
  value: number;                   // Current value
  startValue?: number;             // Baseline/initial value
  target: number;                  // Goal value
  unit: KPIUnit;                   // Type: $, %, hrs, days, none
  trend: KPITrend;                 // Direction: up, down, neutral
  percentageComplete?: number;     // (value/target)*100
  percentageChange: number;        // % change from previous
  circleId?: number;               // Parent circle
  createdBy?: string;              // Creator user ID
  createdAt?: string;              // Created timestamp
  updatedAt?: string;              // Last update timestamp
  history?: KPIHistory[];          // Historical data points
}

export type KPITrend = 'up' | 'down' | 'neutral';
export type KPIUnit = '' | '$' | '%' | 'hrs' | 'days';
```

---

### 2. DATA FLOW & STATE MANAGEMENT

#### Task Component (TaskDetailModal.tsx)
```typescript
// Props received
interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  projects: Project[];
  onTaskUpdated: (taskId: string, updates: Partial<TaskItem>) => void;
  onTaskDeleted: (taskId: string) => void;
  isModerator: boolean;
}

// Component state
const [isEditing, setIsEditing] = useState(false);
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
const [status, setStatus] = useState<TaskStatus>(TaskStatus.NotStarted);
// ... more state for each field

// Data flow: Modal receives task → Load into state → Edit → Call onTaskUpdated
```

#### KPI Component (KPIManager.tsx)
```typescript
// Props received
interface KPIManagerProps {
  circleId: number;
  isModerator: boolean;
}

// Component state
const [kpis, setKpis] = useState<KPI[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [kpiViewModes, setKpiViewModes] = useState<Record<string, 'standard' | 'chart'>>({});
const [showCreateModal, setShowCreateModal] = useState(false);

// Data flow: useEffect fetches data → API call → Load into state → Render list
```

---

### 3. API INTEGRATION PATTERN

#### Task Pattern (Parent handles API calls)
```typescript
// In parent component (e.g., CircleView)
const handleTaskUpdated = async (taskId: string, updates: Partial<TaskItem>) => {
  try {
    await taskService.updateTask(taskId, updates);
    // Refetch or update local state
  } catch (err) {
    setError('Failed to update task');
  }
};

// Modal just calls the parent callback
const handleSave = () => {
  onTaskUpdated(task.id, {
    title: title.trim(),
    description: description.trim(),
    priority,
    status,
    // ... other fields
  });
};
```

#### KPI Pattern (Service calls within component)
```typescript
// In KPIManager component
const fetchKPIs = async () => {
  try {
    const data = await kpiService.getKPIs(circleId);
    setKpis(data);
  } catch (err) {
    setError('Failed to load KPIs. Please try again.');
  }
};

const handleCreateKPI = async (kpiData: KPIFormData) => {
  try {
    const newKPI = await kpiService.createKPI(circleId, {
      name: kpiData.name,
      value: kpiData.value,
      target: kpiData.target,
      unit: kpiData.unit as any
    });
    setKpis(prev => [...prev, newKPI]);
  } catch (err) {
    setError('Failed to create KPI');
  }
};
```

---

### 4. UI RENDERING COMPARISON

#### Task View (Modal - Detail Focused)
```
┌─────────────────────────────────────────┐
│  Task Title              [Edit] [Close] │
├─────────────────────────────────────────┤
│  Status Badge    Priority Badge         │
│  Project: [Project Name]                │
│  Team: Engineering                      │
│  Description: Lorem ipsum...            │
│  Assignees: [Avatar] John, [Avatar] Jane│
│  Start: Dec 27, 2025  Due: Dec 30, 2025│
│                                         │
│  [Delete Task]                          │
└─────────────────────────────────────────┘
```

#### KPI View (Manager - List Focused)
```
┌─────────────────────────────────────────┐
│ KPIs for This Circle        [+ Create]  │
├─────────────────────────────────────────┤
│                                         │
│  Monthly Revenue                        │
│  ████████░░ 90% complete                │
│  Current: $45,000 → Target: $50,000     │
│  Trend: ↑ Up 12.5%                      │
│                                         │
│  New Members                            │
│  ███████░░░ 70% complete                │
│  Current: 35 → Target: 50               │
│  Trend: ↑ Up 5%                         │
│                                         │
│  [Toggle to Chart View]                 │
└─────────────────────────────────────────┘
```

---

### 5. CREATE/EDIT OPERATIONS

#### Task Creation
```typescript
// In parent component or via modal callback
const newTask: TaskItem = {
  id: generateUUID(),
  title: userInput.title,
  description: userInput.description,
  status: TaskStatus.NotStarted,
  priority: TaskPriority.Medium,
  projectId: userInput.projectId,
  team: userInput.team,
  assignees: [],
  startDate: new Date(),
  endDate: new Date(),
  createdAt: new Date()
};

// Update happens via onTaskUpdated callback
```

#### KPI Creation
```typescript
// In KPIManager component
const handleCreateKPI = async (kpiData: KPIFormData) => {
  const newKPI = await kpiService.createKPI(circleId, {
    name: kpiData.name,
    value: kpiData.value,
    target: kpiData.target,
    unit: kpiData.unit as any
  });
  // Backend returns KPI with id, timestamps, etc.
  setKpis(prev => [...prev, newKPI]);
};
```

---

### 6. KEY DIFFERENCES EXPLAINED

| Aspect | Task | KPI | Why? |
|--------|------|-----|------|
| **Primary Value** | Status/Priority | Numerical Progress | Tasks track status, KPIs track metrics |
| **Time Tracking** | startDate, endDate | createdAt, updatedAt | Tasks have deadlines, KPIs track changes |
| **Parent** | projectId (optional) | circleId (always) | Tasks can be standalone, KPIs belong to circles |
| **Assignment** | Multiple assignees | Single creator | Tasks divide work, KPIs are circle-wide metrics |
| **Progress** | Implicit via status | Explicit via percentage | KPIs need numerical progress, tasks use state |
| **View Type** | Detail modal only | List + Chart toggle | KPIs show metrics, need visualization options |
| **Update Pattern** | Parent callback | Direct API call | KPIs update frequently, tasks are less dynamic |

---

### 7. VALIDATION & ERROR HANDLING

#### Task Modal Validation
```typescript
const handleSave = () => {
  if (!title.trim()) {
    alert('Please enter a task title');
    return;
  }
  
  onTaskUpdated(task.id, {
    title: title.trim(),
    description: description.trim(),
    // ... other fields
  });
};
```

#### KPI Manager Validation
```typescript
// In service layer:
if (!kpiData.name.trim()) {
  throw new Error('KPI name is required');
}

if (kpiData.value < 0 || kpiData.target < 0) {
  throw new Error('Values must be positive');
}

// In component:
try {
  const newKPI = await kpiService.createKPI(circleId, data);
  setKpis(prev => [...prev, newKPI]);
  setError(null);
} catch (err) {
  setError('Failed to create KPI');
  console.error(err);
}
```

---

### 8. FEATURE COMPLETENESS MATRIX

| Feature | Task | KPI | Status |
|---------|------|-----|--------|
| **Type Definitions** | ✅ | ✅ | Complete |
| **Create Functionality** | ✅ | ✅ | Complete |
| **Read Functionality** | ✅ | ✅ | Complete |
| **Update Functionality** | ✅ | ✅ | Complete |
| **Delete Functionality** | ✅ | ✅ | Complete |
| **API Service Layer** | ⚠️ (TBD) | ✅ | KPI complete |
| **UI Components** | ✅ | ✅ | Complete |
| **Error Handling** | ✅ | ✅ | Complete |
| **Loading States** | ⚠️ (TBD) | ✅ | KPI complete |
| **Type Safety** | ✅ | ✅ | Complete |
| **Authentication** | ✅ | ✅ | Uses authService |
| **Permission Checks** | ✅ (isModerator) | ✅ (isModerator) | Complete |

---

### 9. BACKEND REQUIREMENTS SUMMARY

#### Task Backend (Expected)
```python
# Django Models
class TaskItem(models.Model):
    id = UUIDField(primary_key=True)
    title = CharField(max_length=255)
    description = TextField()
    status = CharField(choices=[...])  # NotStarted, InProgress, etc
    priority = CharField(choices=[...])  # Low, Medium, High, Critical
    project = ForeignKey(Project, ...)
    team = CharField(max_length=100)
    assignees = ManyToMany(User)
    start_date = DateTimeField()
    end_date = DateTimeField()
    created_at = DateTimeField(auto_now_add=True)
    completed_at = DateTimeField(null=True)
```

#### KPI Backend (Expected)
```python
# Django Models
class KPI(models.Model):
    id = UUIDField(primary_key=True)
    name = CharField(max_length=255)
    description = TextField()
    current_value = DecimalField()      # or: value
    start_value = DecimalField(null=True)
    target_value = DecimalField()       # or: target
    unit = CharField(choices=[...])     # currency, percentage, etc
    trend = CharField(choices=[...])    # up, down, neutral
    circle = ForeignKey(Circle, ...)
    created_by = ForeignKey(User, ...)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

class KPIHistory(models.Model):
    kpi = ForeignKey(KPI, ...)
    value = DecimalField()
    target = DecimalField()
    percentage_complete = DecimalField()
    recorded_at = DateTimeField()
```

---

### 10. CODE EXAMPLES: Practical Usage

#### Using the Task Model
```typescript
// In CircleView component
import { TaskItem, TaskStatus, TaskPriority } from '../types/dashboard';

const handleCreateTask = (task: TaskItem) => {
  // Send to API
  api.post('/tasks/', task);
};

const handleEditTask = (taskId: string, updates: Partial<TaskItem>) => {
  // Update via modal callback
  api.put(`/tasks/${taskId}/`, updates);
};
```

#### Using the KPI Model
```typescript
// In KPIManager component
import { KPI, KPITrend, KPIUnit } from '../types/kpi';
import { kpiService } from '../services/kpiService';

const handleCreateKPI = async (formData: KPIFormData) => {
  const newKPI = await kpiService.createKPI(circleId, {
    name: formData.name,
    value: formData.value,
    target: formData.target,
    unit: formData.unit as KPIUnit
  });
  
  setKpis(prev => [...prev, newKPI]);
};

const handleUpdateKPI = async (kpiId: string, newValue: number) => {
  const updated = await kpiService.updateKPIValue(kpiId, newValue);
  
  // Update trend based on comparison
  const trend: KPITrend = newValue > updated.value ? 'up' : 'down';
};
```

---

## Summary Table

```
┌────────────────┬──────────────────┬────────────────────┐
│ Aspect         │ Task             │ KPI                │
├────────────────┼──────────────────┼────────────────────┤
│ Purpose        │ Track work items │ Track metrics      │
│ Main Field     │ status           │ value/target       │
│ Time Tracking  │ startDate/endDate│ createdAt/updatedAt│
│ Assignment     │ assignees[]      │ circleId/createdBy │
│ Progress Type  │ Status enum      │ Percentage number  │
│ Parent         │ projectId (opt)  │ circleId (req)     │
│ View Type      │ Modal detail     │ List + Chart       │
│ Update Pattern │ Parent callback  │ Direct API calls   │
│ Completed?     │ ✅ Frontend      │ ✅ Frontend        │
│ Pending?       │ 🔄 Backend       │ 🔄 Backend         │
└────────────────┴──────────────────┴────────────────────┘
```

