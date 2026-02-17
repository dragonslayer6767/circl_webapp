# CRM Backend Implementation Plan

## Overview
This document outlines the complete plan to implement the CRM backend to match the frontend implementation already in place.

---

## Phase 1: Analysis & Planning ✅

### Frontend Files Reviewed:
1. **src/types/crm.ts** - Type definitions
   - ContactStatus type (lead, prospect, customer, partner)
   - FunnelStage type (8 stages from needs_outreach to closed_lost)
   - Contact interface with all fields
   - CreateContactData interface
   - UpdateContactData interface
   - AddNoteData interface
   - ContactFilters interface

2. **src/services/crmService.ts** - API Service Layer
   - getContacts(circleId, filters?) - List with pagination
   - getContact(contactId) - Get single contact
   - createContact(data) - Create new contact
   - updateContact(contactId, data) - Update contact
   - addNote(contactId, noteData) - Add note
   - getContactNotes(contactId) - Get contact notes history
   - deleteContact(contactId) - Delete contact

3. **src/pages/circles/components/CRMManager.tsx** - React Component
   - Displays contacts in table/card view
   - Filter by status and funnel stage
   - Search functionality
   - Create new contact modal
   - Edit contact inline
   - Add notes functionality
   - Delete confirmation
   - Uses crmService for API calls

### API Endpoints Required:
- `GET /api/crm/contacts/` - List contacts (with filters & pagination)
- `POST /api/crm/contacts/` - Create contact
- `GET /api/crm/contacts/{id}/` - Get single contact
- `PUT /api/crm/contacts/{id}/` - Update contact
- `DELETE /api/crm/contacts/{id}/` - Delete contact
- `POST /api/crm/contacts/{id}/notes/` - Add note
- `GET /api/crm/contacts/{id}/notes/` - Get notes history

---

## Phase 2: Implementation Strategy

### Part 1: Database Models
Create Django models that map to the TypeScript interfaces:
- Contact model with all fields
- ContactNote model for history tracking
- Proper relationships and indexes

### Part 2: Serializers
Create serializers for:
- ContactSerializer (full serialization)
- ContactCreateSerializer (for creation)
- ContactUpdateSerializer (for updates)
- ContactNoteSerializer (for notes)

### Part 3: ViewSet & API Endpoints
Create a ViewSet with:
- Standard CRUD operations (list, create, retrieve, update, delete)
- Custom action for adding notes
- Custom action for retrieving notes
- Filtering by status and funnel_stage
- Search by name, email, company
- Pagination support
- Circle-based access control

### Part 4: Admin Interface
Configure Django admin for managing:
- Contacts with inline notes
- Bulk operations
- Filtering by circle and status

### Part 5: Testing
Create tests for:
- Model creation and properties
- Serializer validation
- ViewSet CRUD operations
- Custom actions
- Filtering and search
- Permission checks

### Part 6: URL Routing
Add URLs to main Django configuration

### Part 7: App Configuration
Add CRM app to INSTALLED_APPS

---

## Phase 3: Execution Order

1. **Create CRM app structure** (create directory and files)
2. **Implement models.py** (Contact and ContactNote)
3. **Implement serializers.py** (all serializers)
4. **Implement views.py** (ViewSet with all actions)
5. **Implement urls.py** (route configuration)
6. **Implement admin.py** (Django admin panels)
7. **Implement apps.py** (app config)
8. **Implement tests.py** (test suite)
9. **Update Django settings** (add to INSTALLED_APPS)
10. **Update main urls.py** (add routing)
11. **Create migrations** (after all models are ready)
12. **Run migrations** (create database tables)
13. **Verify & test** (ensure everything works)

---

## Phase 4: Code Quality Checklist

### Models:
- [ ] All fields match TypeScript interfaces
- [ ] Proper field types and validators
- [ ] Database indexes on frequently queried fields
- [ ] Relationships correctly configured
- [ ] __str__ methods for admin display
- [ ] Timestamps (created_at, updated_at)

### Serializers:
- [ ] Proper field mapping (snake_case ↔ camelCase)
- [ ] Read-only fields configured
- [ ] Validation rules applied
- [ ] Nested serializers for relationships

### ViewSet:
- [ ] get_queryset() filters by user's circles
- [ ] Authentication required on all endpoints
- [ ] Permission checks implemented
- [ ] Proper error handling
- [ ] Custom actions follow conventions
- [ ] Pagination configured

### Admin:
- [ ] List display shows key fields
- [ ] Filters for status and funnel_stage
- [ ] Search by name, email, company
- [ ] Inline editing of notes
- [ ] Proper readonly fields

### Security:
- [ ] Users can only access their circle's contacts
- [ ] Only moderators can create/delete
- [ ] Input validation on all fields
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities

---

## Implementation Details

### File Structure:
```
/Users/faraibekhan/circl-backend/
├── crm/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py (Contact, ContactNote)
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── admin.py
│   ├── tests.py
│   └── migrations/
│       └── __init__.py
```

### Key Integration Points:
- Users model (Django auth)
- Circles model (existing app)
- CircleMembership model (for access control)

---

## Success Criteria

✅ All 7 API endpoints working
✅ All CRUD operations functional
✅ Filtering and search working
✅ Notes history tracking
✅ Admin interface functional
✅ 0 TypeScript errors on frontend
✅ 0 Django errors on backend
✅ All tests passing
✅ Security checks passed
✅ Documentation complete

---

## Notes

- Follow KPI implementation as a reference (similar pattern)
- Use snake_case for backend, camelCase for frontend
- Ensure proper field name mapping in serializers
- Implement pagination for large contact lists
- Consider performance with database indexes
- Add comprehensive error messages
- Document all API endpoints

---

## Status

**Phase 1 (Analysis):** ✅ COMPLETE
**Phase 2 (Strategy):** ✅ COMPLETE
**Phase 3 (Execution):** ⏳ PENDING
**Phase 4 (QA):** ⏳ PENDING
