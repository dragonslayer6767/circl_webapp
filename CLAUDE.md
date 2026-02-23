# CLAUDE.md — circl_webapp

## Project Overview

`circl_webapp` is a new React/TypeScript web product for Circl. The goal is to connect every feature to the live Django backend API.

**The iOS app (`Circl_app`) is the source of truth for expected behavior.** When in doubt about a user flow, payload shape, or response format, check the matching Swift file.

**Only modify files inside `circl_webapp/`. Never touch `circl-backend/`.**

---

## Tech Stack

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **HTTP:** Axios — one shared pre-configured instance
- **State:** React Context (`src/context/`)

---

## Backend

- **Production URL:** `https://circlapp.online/api/`
- **Local URL:** `http://localhost:8000/api/`
- **Env var:** `VITE_API_BASE_URL` (falls back to production)
- **Auth:** Token authentication — `Authorization: Token <token>`
- **Token storage:** `localStorage` key `auth_token`
- **User ID storage:** `localStorage` key `user_id`

---

## The Axios Instance — Non-Negotiable Rule

**Always import the shared `api` instance from `authService.ts`. Never use raw axios. Never create a new instance.**

```ts
import api from "./authService";
// use: api.get(...), api.post(...), etc.
```

The instance automatically attaches `Authorization: Token <token>` to every request and redirects to `/login` on 401.

**One exception:** Never prefix paths with `/api/` — the baseURL already ends in `/api/`. Leading `/` in a path overrides the baseURL host in Axios. Always use relative paths:

```ts
api.get("/users/profile/1/"); // ✅ resolves to https://circlapp.online/api/users/profile/1/
api.get("/api/users/profile/"); // ❌ accidental double /api/ or origin-relative path
```

---

## Project Structure

```
src/
  services/     # All API calls — one file per domain
  pages/        # Page components
    onboarding/ # Signup flow
    settings/   # Settings sub-pages
    circles/    # Circle sub-pages
  components/   # Reusable UI
  context/      # React Context providers
  hooks/        # Custom hooks
  types/        # Shared TypeScript interfaces
  utils/        # Helpers
```

---

## Service File Ownership

| File                | Domain                                                   |
| ------------------- | -------------------------------------------------------- |
| `authService.ts`    | Login, register, forgot password + shared `api` instance |
| `userServices.ts`   | Profile, onboarding steps, network, DMs, settings        |
| `circleServices.ts` | Circles, channels, circle chat, threads, announcements   |
| `forumService.ts`   | Global forum posts and comments                          |
| `kpiService.ts`     | KPIs                                                     |
| `crmService.ts`     | CRM contacts                                             |

> `circlServices.ts` (note the typo — missing an 'e') is a dead file with a broken endpoint. Do not use it. It should be deleted.

---

## Known Bugs — Must Fix Before Production

These were identified by cross-referencing the webapp service files against the backend URL config and iOS app. All are fixable on the frontend only — no backend changes required.

---

### Bug 1 — Registration: backend returns no token

**File:** `authService.ts` → `register()`

**Problem:** The `register()` function expects the backend to return a token and auto-logs the user in. The backend's `/users/register/` returns only `{ message, user_id }` — no token.

**Fix:** After a successful registration response, immediately call the login endpoint with the same credentials to obtain a token. Then store it and proceed.

```ts
// Correct register flow:
// 1. POST /users/register/ → get { user_id }
// 2. POST /login/ with same email+password → get { token, user_id, ... }
// 3. Store token in localStorage and mark user as logged in
// 4. Navigate to onboarding
```

The iOS app follows the same pattern — register stores `user_id`, then a login call gets the token.

---

### Bug 2 — Forgot password: wrong URL

**File:** `authService.ts` → `forgotPassword()`

**Problem:** Calls `POST /users/forgot-password/` — this path does not exist.

**Fix:** Use `POST /forgot-password/`

```ts
// ❌ Wrong
await api.post("/users/forgot-password/", { email });

// ✅ Correct
await api.post("/forgot-password/", { email });
```

iOS confirms: `https://circlapp.online/api/forgot-password/`

---

### Bug 3 — DM send message: wrong field names

**File:** `userServices.ts` → `sendMessage()`

**Problem:** Sends `{ recipient_id, content }`. Backend reads `sender_id`, `receiver_id`, `content` and returns 400 if any are missing.

**Fix:** Send `{ sender_id, receiver_id, content }`. The `sender_id` is the current user's ID from localStorage.

```ts
// ❌ Wrong
api.post("/users/send_message/", { recipient_id: recipientId, content });

// ✅ Correct
const senderId = parseInt(localStorage.getItem("user_id") || "0", 10);
api.post("/users/send_message/", { sender_id: senderId, receiver_id: recipientId, content });
```

---

### Bug 4 — Circle chat send message: missing user_id + wrong content type

**File:** `circleServices.ts` → `sendMessage()`

**Problem:** Sends JSON `{ channel_id, content }`. Backend expects form data and reads `request.data["user_id"]` — it will throw a `KeyError` and return 500.

**Fix:** Send as `FormData` with `user_id`, `channel_id`, `content`.

```ts
// ❌ Wrong
api.post("/circles/send_message/", { channel_id: channelId, content });

// ✅ Correct
const userId = localStorage.getItem("user_id");
const formData = new FormData();
formData.append("user_id", userId!);
formData.append("channel_id", channelId.toString());
formData.append("content", content);
api.post("/circles/send_message/", formData);
```

---

### Bug 5 — Forum service: all endpoints are wrong paths

**File:** `forumService.ts`

**Problem:** The entire forum service uses invented RESTful paths. The backend uses Django function-based views with different URL patterns.

**Fix — correct endpoint map:**

| Action         | Wrong (current)                                    | Correct                                               |
| -------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Get posts      | `GET /api/forum/posts`                             | `GET /forum/get_posts/`                               |
| Create post    | `POST /api/forum/posts`                            | `POST /forum/create_post/`                            |
| Delete post    | `DELETE /api/forum/posts/{id}/`                    | `DELETE /forum/delete_post/{id}/`                     |
| Like post      | `POST /api/forum/posts/{id}/like/`                 | `POST /forum/posts/{id}/like/` ✅                     |
| Unlike post    | `DELETE /api/forum/posts/{id}/like/`               | `POST /forum/posts/{id}/unlike/` (POST not DELETE)    |
| Get comments   | `GET /api/forum/posts/{id}/comments/`              | `GET /forum/comments/{id}/`                           |
| Add comment    | `POST /api/forum/posts/{id}/comments/`             | `POST /forum/comments/add/`                           |
| Like comment   | `POST /api/forum/posts/{id}/comments/{id}/like/`   | `POST /forum/comments/{id}/like/`                     |
| Unlike comment | `DELETE /api/forum/posts/{id}/comments/{id}/like/` | `POST /forum/comments/{id}/unlike/` (POST not DELETE) |

> `getPost()`, `updatePost()`, `updateComment()`, `deleteComment()` have no backend equivalent — do not implement them until the backend adds them.

---

### Bug 6 — KPI update value: hyphen vs underscore URL mismatch

**File:** `kpiService.ts` → `updateKPIValue()`

**Problem:** Calls `POST /kpi/kpis/{id}/update-value/` (hyphen). DRF generates the URL from the Python function name `update_value` using **underscores**: `/api/kpi/kpis/{id}/update_value/`.

**Fix:**

```ts
// ❌ Wrong
api.post(`/kpi/kpis/${kpiId}/update-value/`, { value: currentValue });

// ✅ Correct
api.post(`/kpi/kpis/${kpiId}/update_value/`, { value: currentValue });
```

---

### Bug 7 — CRM add note: wrong URL

**File:** `crmService.ts` → `addNote()`

**Problem:** Calls `POST /crm/contacts/{id}/notes/`. DRF generates the URL from function name `add_note`: `/api/crm/contacts/{id}/add_note/`.

**Fix:**

```ts
// ❌ Wrong
api.post(`/crm/contacts/${contactId}/notes/`, noteData);

// ✅ Correct
api.post(`/crm/contacts/${contactId}/add_note/`, noteData);
```

> `getContactNotes` calling `GET /crm/contacts/{id}/notes/` is correct — the DRF function name is `notes` so the URL is `/notes/`.

---

### Bug 8 — Logout calls a non-existent endpoint

**File:** `authService.ts` → `logout()`

**Problem:** Calls `POST /logout/` which doesn't exist in the backend.

**Fix:** The backend uses token auth — there is no server-side session to invalidate. Remove the API call entirely. Just clear localStorage.

```ts
// ✅ Correct logout — no API call needed
logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_fullname');
  localStorage.setItem('isLoggedIn', 'false');
}
```

---

## Correct API Reference (Verified Against Backend)

All paths are relative to the base URL (`https://circlapp.online/api/`).

### Authentication

| Method | Path                | Body                                         | Notes                                                           |
| ------ | ------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| POST   | `/login/`           | `{ email, password }`                        | Returns `{ token, user_id, first_name, last_name }`             |
| POST   | `/users/register/`  | `{ first_name, last_name, email, password }` | Returns `{ message, user_id }` — **no token** — call login next |
| POST   | `/forgot-password/` | `{ email }`                                  | Not `/users/forgot-password/`                                   |

### Onboarding (all require auth token)

| Method | Path                              | Key Body Fields                                                                                                                            |
| ------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/users/update-personal-details/` | `user_id`, `birthday`, `personality_type`                                                                                                  |
| POST   | `/users/update-skills-interests/` | `user_id`, `locations: string[]`                                                                                                           |
| POST   | `/users/update-business-info/`    | `user_id`, `business_name`, `scale_type`, `business_stage`, `business_revenue`, `industry`, `business_location`, `is_legally_incorporated` |
| POST   | `/users/update-business-details/` | `user_id` + detail fields                                                                                                                  |
| POST   | `/users/upload_profile_image/`    | `multipart/form-data`: `user_id`, `image`                                                                                                  |

### User / Profile

| Method | Path                             | Notes                    |
| ------ | -------------------------------- | ------------------------ |
| GET    | `/users/profile/<user_id>/`      | Full profile             |
| POST   | `/users/update-user-profile/`    | `user_id` + fields       |
| POST   | `/users/update-user-bio/`        | `{ user_id, bio }`       |
| GET    | `/users/get-user-bio/<user_id>/` |                          |
| POST   | `/users/upload_profile_image/`   | multipart, `image` field |

### Settings

| Method | Path                             | Notes                            |
| ------ | -------------------------------- | -------------------------------- |
| POST   | `/users/change_password/`        | `{ old_password, new_password }` |
| POST   | `/users/apply_mentor/`           | `{ name, industry, reason }`     |
| GET    | `/users/get_blocked_users/`      |                                  |
| POST   | `/users/block_user/`             | `{ user_id }`                    |
| POST   | `/users/unblock_user/`           | `{ user_id }`                    |
| POST   | `/users/request_delete_account/` |                                  |
| POST   | `/users/submit_feedback/`        | `{ subject, message }`           |

### DM Messaging

| Method | Path                             | Notes                                 |
| ------ | -------------------------------- | ------------------------------------- |
| GET    | `/users/get_network/<user_id>/`  | People the user can message           |
| GET    | `/users/get_messages/<user_id>/` | DM thread with that user              |
| POST   | `/users/send_message/`           | `{ sender_id, receiver_id, content }` |
| POST   | `/users/mark_messages_read/`     | `{ user_id }`                         |

### Circles

| Method | Path                                                 | Notes                    |
| ------ | ---------------------------------------------------- | ------------------------ |
| GET    | `/circles/my_circles/<user_id>/`                     |                          |
| GET    | `/circles/explore_circles/<user_id>/`                |                          |
| POST   | `/circles/join_circle/`                              | `{ circle_id, user_id }` |
| POST   | `/circles/leave_circle/`                             | `{ circle_id, user_id }` |
| POST   | `/circles/create_with_channels/`                     |                          |
| POST   | `/circles/delete_circle/`                            |                          |
| GET    | `/circles/get_circle_details/?circle_id=X&user_id=Y` |                          |
| GET    | `/circles/members/<circle_id>/`                      |                          |
| GET    | `/circles/get_channels/<circle_id>/`                 |                          |
| POST   | `/circles/upload_circle_image/`                      | multipart                |
| POST   | `/circles/create_invite_link/<circle_id>/`           |                          |
| GET    | `/circles/invite_preview/<token>/`                   |                          |
| POST   | `/circles/resolve_invite/<token>/`                   |                          |

### Circle Chat (channels)

| Method | Path                                  | Notes                                            |
| ------ | ------------------------------------- | ------------------------------------------------ |
| GET    | `/circles/get_messages/<channel_id>/` |                                                  |
| POST   | `/circles/send_message/`              | **FormData**: `user_id`, `channel_id`, `content` |

### Threads (within circles)

| Method | Path                                 | Notes                             |
| ------ | ------------------------------------ | --------------------------------- |
| GET    | `/circles/get_threads/<circle_id>/`  |                                   |
| POST   | `/circles/create_thread/`            | `{ circle_id, user_id, content }` |
| POST   | `/circles/toggle_like/`              | `{ thread_id, user_id }`          |
| POST   | `/circles/post_comment/`             | `{ thread_id, user_id, content }` |
| GET    | `/circles/get_comments/<thread_id>/` |                                   |

### Announcements

| Method | Path                                               | Notes                           |
| ------ | -------------------------------------------------- | ------------------------------- |
| GET    | `/circles/get_announcements/<circle_id>/`          |                                 |
| POST   | `/circles/post_announcement/`                      | `{ circle_id, title, content }` |
| DELETE | `/circles/announcements/delete/<announcement_id>/` |                                 |

### Forum (Global)

| Method | Path                                   | Notes                       |
| ------ | -------------------------------------- | --------------------------- |
| GET    | `/forum/get_posts/`                    |                             |
| POST   | `/forum/create_post/`                  | multipart if image included |
| DELETE | `/forum/delete_post/<post_id>/`        |                             |
| POST   | `/forum/posts/<post_id>/like/`         |                             |
| POST   | `/forum/posts/<post_id>/unlike/`       | POST not DELETE             |
| GET    | `/forum/comments/<post_id>/`           |                             |
| POST   | `/forum/comments/add/`                 | `{ post_id, content }`      |
| POST   | `/forum/comments/<comment_id>/like/`   |                             |
| POST   | `/forum/comments/<comment_id>/unlike/` | POST not DELETE             |

### KPI

| Method | Path                           | Notes                                   |
| ------ | ------------------------------ | --------------------------------------- |
| GET    | `/kpi/kpis/`                   | `?circle_id=X`                          |
| POST   | `/kpi/kpis/`                   | `{ name, value, target, unit, circle }` |
| PUT    | `/kpi/kpis/<id>/`              |                                         |
| DELETE | `/kpi/kpis/<id>/`              |                                         |
| POST   | `/kpi/kpis/<id>/update_value/` | `{ value }` — underscore, not hyphen    |
| GET    | `/kpi/kpis/<id>/history/`      | `?days=30`                              |

### CRM

| Method | Path                           | Notes                                           |
| ------ | ------------------------------ | ----------------------------------------------- |
| GET    | `/crm/contacts/`               | `?circle_id=X`                                  |
| POST   | `/crm/contacts/`               | `{ name, email, status, funnel_stage, circle }` |
| PUT    | `/crm/contacts/<id>/`          |                                                 |
| DELETE | `/crm/contacts/<id>/`          |                                                 |
| POST   | `/crm/contacts/<id>/add_note/` | Not `/notes/`                                   |
| GET    | `/crm/contacts/<id>/notes/`    |                                                 |

---

## Rules

1. **Use the shared `api` instance** — always import from `authService.ts`.
2. **No `/api/` prefix in paths** — the baseURL already includes it.
3. **TypeScript types required** — every API function needs typed interfaces for request body and response.
4. **Fix bugs before adding features** — the 8 bugs above must be resolved first or the app will not work.
5. **Check iOS for behavior** — when unsure how something should work, find the matching Swift file.
6. **Do not modify the backend** — all fixes go in `circl_webapp/` only.

# Calendar Events System

## Overview

This web app includes a calendar event management system that syncs with our iOS app. Users
can view events, check in to events, and moderators can create/delete events.

## Data Models

### CalendarEvent

```typescript
interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  event_type: string; // "workshop" | "speaker" | "social" | "meeting" | "conference"
  date: string; // ISO8601 format (e.g., "2024-01-15T00:00:00Z")
  start_time: string | null; // "HH:mm:ss" format (e.g., "14:30:00")
  end_time: string | null; // "HH:mm:ss" format
  points: number;
  revenue: number;
  circle_id: number;
}

CheckInResponse

interface CheckInResponse {
  message: string;
  user_id: number;
  event_id: number;
}

interface UserCheckIns {
  checked_in_event_ids: number[];
}

API Endpoints

Base URL: ${baseURL} (from environment config)

Get Events

- Endpoint: GET /circles/get_events/?circle_id={circle_id}
- Returns: CalendarEvent[]
- Notes: Returns all events for the circle; filter by date on client-side

Create Event (Moderator only)

- Endpoint: POST /circles/create_event/
- Body:
{
  "title": "Event Name",
  "description": "Event description",
  "event_type": "workshop", // lowercase
  "points": 10,
  "revenue": 0,
  "date": "2024-01-15T00:00:00Z", // ISO8601
  "start_time": "14:00:00", // HH:mm:ss
  "end_time": "16:00:00", // HH:mm:ss
  "circle_id": 123
}

Delete Event (Moderator only)

- Endpoint: DELETE /circles/delete_event/{eventId}/?user_id={userId}
- Notes: Requires confirmation dialog before deletion

Check In to Event

- Endpoint: POST /circles/checkin_event/
- Body:
{
  "user": 456, // user_id
  "event": 789 // event_id
}

Get User Check-Ins

- Endpoint: GET /circles/get_user_checkins/?user_id={userId}
- Returns: { checked_in_event_ids: number[] }
- Notes: Fetch on component mount to initialize check-in state

UI Components & Features

Calendar View

- Graphical date picker for selecting dates
- Toggle between "Events for [Selected Date]" and "Show All Events"
- Loading state while fetching
- Empty state: "No events for this date" with helpful message

Event Card

- Header: Title + info/expand icon
- Badges: Event type (color-coded) + points
- Expandable Details:
  - Description (if available)
  - Time range: "🕒 {start_time} - {end_time}"
  - Delete button (moderators only, with confirmation)
- Check-In Button:
  - Default: "Check In" (blue border)
  - After check-in: "Checked In" (green, disabled)

Create Event Form (Moderators only)

- Fields: Event name, type selector, date picker, description textarea
- Time pickers: start time, end time
- Points input (default: 10)
- Validation: Event name required
- Modal/sheet presentation

Color Scheme

Event type colors:
- Workshop: #004aad
- Speaker: purple
- Social: orange
- Meeting: blue
- Conference: red

Implementation Notes

1. Date Filtering: Fetch all events, then filter client-side by selected date
2. Time Format: Display times in 12-hour format with AM/PM for better UX
3. Check-In State: Track checked-in event IDs in Set/array for O(1) lookup
4. Moderator Actions: Only show create/delete UI if circle.isModerator === true
5. ISO8601 Parsing: Use native Date parsing or library like date-fns
6. Error Handling: Show user-friendly messages on API failures
7. Optimistic Updates: Don't wait for API response before updating UI for check-ins

Event Type Options

const EVENT_TYPES = ["Workshop", "Speaker", "Social", "Meeting", "Conference"];

Testing Considerations

- Test date filtering across timezone boundaries
- Verify moderator-only actions are hidden for non-moderators
- Test check-in state persistence during session
- Verify event creation with all required fields

---

This CLAUDE.md section provides all the context Claude Code needs to work on your web app's
calendar feature. It includes data models, API contracts, UI specifications, and
implementation guidelines that match your iOS app exactly.

──────────────────────────────────────────────────────────────────────────────────────────────
❯ 
──────────────────────────────────────────────────────────────────────────────────────────────
? for shortcuts

```
