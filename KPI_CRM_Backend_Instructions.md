# KPI & CRM Backend Implementation Instructions

## Overview
This document provides detailed instructions for backend developers to implement the KPI Tracking and CRM (Contact Management) systems for the Circl platform. Both systems should be built using Django REST Framework to integrate with the React frontend.

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [CRM Module](#crm-module)
3. [KPI Module](#kpi-module)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Permissions](#authentication--permissions)
6. [Frontend Integration](#frontend-integration)

---

## Technology Stack

**Required:**
- Python 3.10+
- Django 4.2+
- Django REST Framework 3.14+
- PostgreSQL (recommended) or MySQL

**Optional:**
- Celery (for async tasks like trend calculations)
- Redis (for caching)
- django-filter (for advanced filtering)
- drf-spectacular (for API documentation)

---

## CRM Module

### Database Models

#### 1. Contact Model
```python
class Contact(models.Model):
    # Basic Information
    id = UUIDField (primary_key=True, default=uuid.uuid4)
    name = CharField(max_length=255, db_index=True)
    email = EmailField(unique=True, db_index=True)
    phone = CharField(max_length=20, null=True, blank=True)
    company = CharField(max_length=255, null=True, blank=True)
    
    # CRM Fields
    status = CharField(
        max_length=20,
        choices=[
            ('lead', 'Lead'),
            ('prospect', 'Prospect'),
            ('customer', 'Customer'),
            ('partner', 'Partner')
        ],
        default='lead',
        db_index=True
    )
    
    funnel_stage = CharField(
        max_length=30,
        choices=[
            ('needs_outreach', 'Needs Outreach'),
            ('contacted', 'Contacted'),
            ('meeting_set', 'Meeting Set'),
            ('proposal_sent', 'Proposal Sent'),
            ('negotiation', 'Negotiation'),
            ('blocked', 'Blocked'),
            ('closed_won', 'Closed Won'),
            ('closed_lost', 'Closed Lost')
        ],
        default='needs_outreach',
        db_index=True
    )
    
    notes = TextField(blank=True)  # Current/latest note
    last_contact = DateTimeField(auto_now_add=True)
    
    # Relationships
    circle = ForeignKey('circles.Circle', on_delete=CASCADE, related_name='contacts')
    created_by = ForeignKey('users.User', on_delete=SET_NULL, null=True)
    
    # Timestamps
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-last_contact']
        indexes = [
            Index(fields=['circle', 'status']),
            Index(fields=['circle', 'funnel_stage'])
        ]
```

#### 2. ContactNote Model (for notes history)
```python
class ContactNote(models.Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    contact = ForeignKey(Contact, on_delete=CASCADE, related_name='notes_history')
    note = TextField()
    created_by = ForeignKey('users.User', on_delete=SET_NULL, null=True)
    created_at = DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
```

### API Endpoints for CRM

#### GET /api/crm/contacts/
**Purpose:** List all contacts for a circle with filtering
**Query Parameters:**
- `circle_id` (required): Circle ID
- `status`: Filter by status (lead, prospect, customer, partner)
- `funnel_stage`: Filter by funnel stage
- `search`: Search by name, email, or company

**Response:**
```json
{
  "count": 25,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "Acme Inc",
      "status": "customer",
      "funnel_stage": "closed_won",
      "notes": "Latest note text",
      "notes_history": [
        {
          "id": "uuid",
          "note": "Follow up scheduled",
          "created_at": "2025-12-27T10:00:00Z"
        }
      ],
      "last_contact": "2025-12-27T10:00:00Z",
      "created_at": "2025-12-01T10:00:00Z",
      "updated_at": "2025-12-27T10:00:00Z"
    }
  ]
}
```

#### POST /api/crm/contacts/
**Purpose:** Create new contact
**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "+1234567890",
  "company": "Tech Corp",
  "status": "lead",
  "funnel_stage": "needs_outreach",
  "notes": "Initial contact note",
  "circle_id": "circle-uuid"
}
```

#### GET /api/crm/contacts/{id}/
**Purpose:** Retrieve single contact details

#### PUT /api/crm/contacts/{id}/
**Purpose:** Update contact (including funnel stage moves)
**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@email.com",
  "status": "customer",
  "funnel_stage": "closed_won",
  "notes": "Deal closed!"
}
```

**Important:** When updating, automatically update `last_contact` timestamp

#### DELETE /api/crm/contacts/{id}/
**Purpose:** Delete contact

#### POST /api/crm/contacts/{id}/notes/
**Purpose:** Add new note to contact
**Request Body:**
```json
{
  "note": "Had a great call today. Ready to close deal."
}
```

**Business Logic:**
1. Create new ContactNote entry
2. Update Contact.notes field with this latest note
3. Update Contact.last_contact to current timestamp

#### GET /api/crm/contacts/{id}/notes/
**Purpose:** Get all notes history for a contact (ordered by date descending)

---

## KPI Module

### Database Models

#### 1. KPI Model
```python
class KPI(models.Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    name = CharField(max_length=255, db_index=True)
    
    # Values
    current_value = DecimalField(max_digits=15, decimal_places=2)
    target = DecimalField(max_digits=15, decimal_places=2)
    unit = CharField(
        max_length=10,
        choices=[
            ('none', 'None'),
            ('currency', '$'),
            ('percentage', '%'),
            ('hours', 'hrs'),
            ('days', 'days')
        ],
        default='none'
    )
    
    # Calculated fields
    percentage_complete = DecimalField(
        max_digits=5, 
        decimal_places=2,
        help_text="Calculated as (current_value / target) * 100"
    )
    trend = CharField(
        max_length=10,
        choices=[
            ('up', 'Up'),
            ('down', 'Down'),
            ('neutral', 'Neutral')
        ],
        default='neutral'
    )
    percentage_change = DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Percentage change from previous period"
    )
    
    # Relationships
    circle = ForeignKey('circles.Circle', on_delete=CASCADE, related_name='kpis')
    created_by = ForeignKey('users.User', on_delete=SET_NULL, null=True)
    
    # Timestamps
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "KPI"
        verbose_name_plural = "KPIs"
```

#### 2. KPIHistory Model
```python
class KPIHistory(models.Model):
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    kpi = ForeignKey(KPI, on_delete=CASCADE, related_name='history')
    value = DecimalField(max_digits=15, decimal_places=2)
    target = DecimalField(max_digits=15, decimal_places=2)
    percentage_complete = DecimalField(max_digits=5, decimal_places=2)
    recorded_at = DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        ordering = ['-recorded_at']
        verbose_name = "KPI History"
        verbose_name_plural = "KPI Histories"
```

### API Endpoints for KPI

#### GET /api/kpi/kpis/
**Purpose:** List all KPIs for a circle
**Query Parameters:**
- `circle_id` (required): Circle ID
- `ordering`: Sort by field (e.g., `-percentage_complete`, `name`)

**Response:**
```json
{
  "count": 4,
  "results": [
    {
      "id": "uuid",
      "name": "Monthly Revenue",
      "current_value": "45000.00",
      "target": "50000.00",
      "unit": "currency",
      "percentage_complete": "90.00",
      "trend": "up",
      "percentage_change": "12.50",
      "created_at": "2025-12-01T10:00:00Z",
      "updated_at": "2025-12-27T10:00:00Z",
      "history": [
        {
          "value": "45000.00",
          "recorded_at": "2025-12-27T10:00:00Z"
        },
        {
          "value": "40000.00",
          "recorded_at": "2025-12-20T10:00:00Z"
        }
      ]
    }
  ]
}
```

#### POST /api/kpi/kpis/
**Purpose:** Create new KPI
**Request Body:**
```json
{
  "name": "New Members",
  "current_value": 25,
  "target": 50,
  "unit": "none",
  "circle_id": "circle-uuid"
}
```

**Business Logic:**
1. Calculate `percentage_complete = (current_value / target) * 100`
2. Set `trend` to "neutral" initially
3. Create first KPIHistory entry

#### PUT /api/kpi/kpis/{id}/
**Purpose:** Update KPI (including value updates)
**Request Body:**
```json
{
  "name": "Monthly Revenue (Updated)",
  "current_value": 48000,
  "target": 50000
}
```

**Business Logic:**
1. Recalculate `percentage_complete`
2. Calculate `trend` by comparing to most recent KPIHistory entry:
   - If new value > previous value: trend = "up"
   - If new value < previous value: trend = "down"
   - If equal: trend = "neutral"
3. Calculate `percentage_change` from previous value
4. Create new KPIHistory entry with new values

#### POST /api/kpi/kpis/{id}/update-value/
**Purpose:** Quick endpoint to update only the current value
**Request Body:**
```json
{
  "current_value": 47500
}
```

#### GET /api/kpi/kpis/{id}/history/
**Purpose:** Get historical data for charts
**Query Parameters:**
- `days`: Number of days of history (default: 30)
- `limit`: Max number of records (default: 100)

**Response:**
```json
{
  "kpi_id": "uuid",
  "name": "Monthly Revenue",
  "history": [
    {
      "value": "47500.00",
      "target": "50000.00",
      "percentage_complete": "95.00",
      "recorded_at": "2025-12-27T10:00:00Z"
    },
    {
      "value": "45000.00",
      "target": "50000.00",
      "percentage_complete": "90.00",
      "recorded_at": "2025-12-20T10:00:00Z"
    }
  ]
}
```

#### DELETE /api/kpi/kpis/{id}/
**Purpose:** Delete KPI (cascades to history)

---

## Authentication & Permissions

### Requirements:
1. All endpoints require authentication
2. Users can only access KPIs/Contacts for circles they are members of
3. Only circle moderators/admins can:
   - Create KPIs
   - Delete KPIs
   - Create contacts
   - Delete contacts
4. All circle members can:
   - View KPIs/Contacts
   - Update KPI values
   - Update contact information
   - Add notes to contacts

### Implementation:
```python
class IsCircleMember(BasePermission):
    def has_permission(self, request, view):
        circle_id = request.query_params.get('circle_id') or request.data.get('circle_id')
        return CircleMembership.objects.filter(
            circle_id=circle_id,
            user=request.user
        ).exists()

class IsCircleModerator(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['POST', 'DELETE']:
            circle_id = request.query_params.get('circle_id') or request.data.get('circle_id')
            return CircleMembership.objects.filter(
                circle_id=circle_id,
                user=request.user,
                role__in=['moderator', 'admin']
            ).exists()
        return True
```

---

## Frontend Integration

### Expected Request Headers:
```javascript
{
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

### Frontend Data Contracts:

**Contact Interface (TypeScript):**
```typescript
interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: 'lead' | 'prospect' | 'customer' | 'partner';
  funnelStage: 'needs_outreach' | 'contacted' | 'meeting_set' | 
                'proposal_sent' | 'negotiation' | 'blocked' | 
                'closed_won' | 'closed_lost';
  lastContact: Date;
  notes: string;
  notesHistory?: { date: Date; note: string }[];
}
```

**KPI Interface (TypeScript):**
```typescript
interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: '' | '$' | '%' | 'hrs' | 'days';
  percentageComplete: number;
  trend: 'up' | 'down' | 'neutral';
  percentageChange: number;
}
```

### CORS Configuration:
Enable CORS for React frontend (typically `http://localhost:5173` for dev):
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://app.circl.com",  # Production
]
```

---

## Database Indexes

### Essential Indexes for Performance:
```sql
-- CRM
CREATE INDEX idx_contact_circle_status ON contact(circle_id, status);
CREATE INDEX idx_contact_circle_funnel ON contact(circle_id, funnel_stage);
CREATE INDEX idx_contact_email ON contact(email);
CREATE INDEX idx_contact_name ON contact(name);
CREATE INDEX idx_contactnote_contact ON contactnote(contact_id);

-- KPI
CREATE INDEX idx_kpi_circle ON kpi(circle_id);
CREATE INDEX idx_kpihistory_kpi_recorded ON kpihistory(kpi_id, recorded_at DESC);
```

---

## Testing Requirements

### Unit Tests:
1. Test KPI percentage calculation logic
2. Test trend detection (up/down/neutral)
3. Test contact note history creation
4. Test funnel stage transitions
5. Test permission checks

### Integration Tests:
1. Test full CRUD operations for both modules
2. Test filtering and search functionality
3. Test cascading deletes
4. Test concurrent updates

### Performance Tests:
1. Test with 1000+ contacts per circle
2. Test with 100+ KPIs per circle
3. Test KPI history retrieval (1 year of daily data)

---

## Deployment Considerations

1. **Database Migrations:** Ensure proper migration order (Circles → Users → KPI/CRM)
2. **Caching:** Consider caching KPI calculations for 5-15 minutes
3. **Background Jobs:** Use Celery for:
   - Periodic KPI history snapshots (e.g., daily)
   - Trend recalculations
   - Bulk contact imports
4. **Monitoring:** Add logging for:
   - Failed KPI calculations
   - Invalid funnel stage transitions
   - Permission denied events

---

## Migration from Frontend Mock Data

The frontend currently uses mock data. To migrate:

1. Update API service files to point to backend endpoints:
```typescript
// src/services/crmService.ts
const API_BASE = 'http://localhost:8000/api/crm';

export const fetchContacts = async (circleId: string) => {
  const response = await fetch(`${API_BASE}/contacts/?circle_id=${circleId}`);
  return response.json();
};
```

2. Remove mock data from:
   - `src/pages/circles/components/CRMManager.tsx`
   - `src/pages/circles/components/KPIManager.tsx`

3. Add loading states and error handling

---

## Questions or Issues?

Contact the frontend team for:
- Data structure clarifications
- Additional fields needed
- UI/UX requirements changes

## Timeline Estimate

- **CRM Module:** 3-5 days (including tests)
- **KPI Module:** 3-5 days (including tests)
- **Total:** ~1-2 weeks for complete implementation
