# Circl Web App API Endpoints Reference

This document lists all API endpoints to be implemented in the `circl_webapp` React/Vite/Tailwind/TypeScript project, based on the iOS app and backend documentation.

**Base URL:** `${VITE_API_BASE_URL}` (e.g., `http://localhost:8000/api/`)

---

## Authentication
- `POST   /auth/login` — User login
- `POST   /auth/logout` — User logout
- `POST   /auth/register` — Create new account
- `POST   /auth/refresh` — Refresh JWT token

## User Profile
- `GET    /profile` — Get current user profile
- `PUT    /profile` — Update profile
- `GET    /profile/{id}` — Get another user's profile
- `POST   /profile/image` — Upload profile image

## Forum
- `GET    /forum/posts` — Get forum feed (with filters)
- `POST   /forum/posts` — Create new post
- `DELETE /forum/posts/{id}` — Delete post
- `POST   /forum/posts/{id}/like` — Like a post
- `DELETE /forum/posts/{id}/like` — Unlike a post
- `GET    /forum/posts/{id}/comments` — Get comments on post
- `POST   /forum/posts/{id}/comments` — Add comment to post

## Network
- `GET    /network/connections` — Get user connections
- `GET    /network/invites/pending` — Get pending invitations
- `POST   /network/invites` — Send connection invite
- `POST   /network/invites/{id}/accept` — Accept invite
- `POST   /network/invites/{id}/reject` — Reject invite
- `DELETE /network/connections/{id}` — Remove connection

## Mentors
- `GET    /mentors` — Search mentors (with filters)
- `GET    /mentors/{id}` — Get mentor details
- `POST   /mentors/{id}/request` — Request mentor connection

## Entrepreneurs
- `GET    /entrepreneurs` — Search entrepreneurs (with filters)
- `GET    /entrepreneurs/{id}` — Get entrepreneur details

## Circles
- `GET    /circles` — Get all circles
- `GET    /circles/{id}` — Get circle details
- `POST   /circles/{id}/join` — Join a circle
- `DELETE /circles/{id}/join` — Leave a circle
- `GET    /circles/{id}/members` — Get circle members
- `POST   /circles/upload_circle_image/` — Upload circle image

## Chats
- `GET    /chats` — Get user chats
- `GET    /chats/{id}/messages` — Get chat messages
- `POST   /chats/{id}/messages` — Send message

## CRM (Contacts)
- `GET    /api/crm/contacts/` — List all contacts (with filters)
- `POST   /api/crm/contacts/` — Create new contact
- `GET    /api/crm/contacts/{id}/` — Retrieve single contact details
- `PUT    /api/crm/contacts/{id}/` — Update contact
- `DELETE /api/crm/contacts/{id}/` — Delete contact
- `POST   /api/crm/contacts/{id}/notes/` — Add note to contact
- `GET    /api/crm/contacts/{id}/notes/` — Get all notes for a contact

## KPI
- `GET    /api/kpi/kpis/` — List all KPIs for a circle
- `POST   /api/kpi/kpis/` — Create new KPI
- `PUT    /api/kpi/kpis/{id}/` — Update KPI
- `POST   /api/kpi/kpis/{id}/update-value/` — Update KPI value
- `GET    /api/kpi/kpis/{id}/history/` — Get KPI history
- `DELETE /api/kpi/kpis/{id}/` — Delete KPI

## Resource Finder (from iOS Swift code)
- `GET    /legal-resources/?keyword=...&location=...` — Find legal resources
- `GET    /hr-resources/?keyword=...&location=...` — Find HR resources
- `GET    /real-estate-resources/?keyword=...&location=...` — Find real estate resources
- `GET    /mental-health-resources/?keyword=...&location=...` — Find mental health resources
- `GET    /consultant-resources/?keyword=...&location=...` — Find consultants
- `GET    /marketing-resources/?keyword=...&location=...` — Find marketing teams
- `GET    /insurance-resources/?keyword=...&location=...` — Find insurance providers
- `GET    /bank-loan-resources/?keyword=...&location=...` — Find lenders
- `GET    /customer-service-resources/?keyword=...&location=...` — Find support teams

## User Business Info & Skills
- `POST   /users/update-business-info/` — Update business info
- `POST   /users/update-skills-interests/` — Update skills/interests

---

## Additional Endpoints (from circl_app copy for react)

### Notifications
- `GET    /notifications/unread/` — Get unread notifications
- `POST   /notifications/mark-all-read/` — Mark all notifications as read
- `POST   /notifications/{id}/mark-read/` — Mark a single notification as read

### Files & Documents
- `POST   /files/upload/` — Upload a file/document
- `GET    /files/{id}/download/` — Download a file/document
- `DELETE /files/{id}/` — Delete a file/document

### Calendar & Events
- `GET    /calendar/events/` — List all events
- `POST   /calendar/events/` — Create new event
- `GET    /calendar/events/{id}/` — Get event details
- `PUT    /calendar/events/{id}/` — Update event
- `DELETE /calendar/events/{id}/` — Delete event

### Tasks & To-Dos
- `GET    /tasks/` — List all tasks
- `POST   /tasks/` — Create new task
- `GET    /tasks/{id}/` — Get task details
- `PUT    /tasks/{id}/` — Update task
- `DELETE /tasks/{id}/` — Delete task

### Announcements
- `GET    /announcements/` — List all announcements
- `POST   /announcements/` — Create announcement
- `GET    /announcements/{id}/` — Get announcement details
- `PUT    /announcements/{id}/` — Update announcement
- `DELETE /announcements/{id}/` — Delete announcement

### Feedback & Support
- `POST   /support/feedback/` — Submit feedback
- `POST   /support/contact/` — Contact support

### Billing & Subscription
- `GET    /billing/subscription/` — Get current subscription
- `POST   /billing/subscribe/` — Subscribe to a plan
- `POST   /billing/cancel/` — Cancel subscription

### Admin/Moderation
- `GET    /admin/users/` — List all users (admin)
- `POST   /admin/users/{id}/ban/` — Ban user
- `POST   /admin/users/{id}/unban/` — Unban user

---

**Note:**
- All endpoints should use trailing slashes (`/`) for Django REST compatibility.
- Some endpoints may require authentication (token in header).
- This list is based on migration plans, backend docs, iOS code, and additional endpoints found in the legacy React app. Confirm with backend as needed.
