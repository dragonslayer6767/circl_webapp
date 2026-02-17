# CLAUDE.md — circl_webapp

## What This Project Is

`circl_webapp` is a **brand new web product** for Circl. It is a React/TypeScript app that needs to be fully connected to the existing backend API. There are **no working API connections yet** — connecting them is the entire goal.

The **iOS app (`Circl_app`)** is the source of truth for how every feature should behave. Use it to understand user flows, request payloads, response shapes, and edge cases. Do not guess — look at the iOS app.

**Only modify files inside `circl_webapp/`. Never touch `circl-backend/`.**

---

## Tech Stack

- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **HTTP:** Axios — one shared instance, never create a new one
- **State:** React Context (`src/context/`)

---

## Backend

- **Production URL:** `https://circlapp.online/api/`
- **Local URL:** `http://localhost:8000/api/`
- **Env var:** `VITE_API_BASE_URL` (falls back to production)
- **Auth:** Token authentication — `Authorization: Token <token>`
- **Token key in localStorage:** `auth_token`
- **User ID key in localStorage:** `user_id`

---

## The Axios Instance — Use This Always

The shared `api` instance lives in `src/services/authService.ts`. It:
- Automatically attaches `Authorization: Token <token>` to every request
- Redirects to `/login` on any 401 response
- Has the base URL set from the env var

```ts
import api from './authService';
// then use: api.get(...), api.post(...), etc.
```

**Never import axios directly. Never create a new axios instance.**

---

## Project Structure

```
src/
  services/       # All API calls — one file per domain
  pages/          # Page-level components
    onboarding/   # Signup flow pages
    settings/     # Settings sub-pages
    circles/      # Circle sub-pages
  components/     # Reusable UI
  context/        # React Context providers
  hooks/          # Custom hooks
  types/          # Shared TypeScript interfaces
  utils/          # Helpers
```

---

## Service Files — Where to Put API Calls

| File | Owns |
|------|------|
| `authService.ts` | Login, register, forgot password + the shared `api` instance |
| `userServices.ts` | Profile, personal details, network, search, blocking |
| `circleServices.ts` | Circles, channels, messages, threads, announcements |
| `forumService.ts` | Global forum posts and comments |
| `kpiService.ts` | KPIs |
| `crmService.ts` | CRM contacts |

All new API functions go in the appropriate service file with TypeScript interfaces for request and response types.

---

## Features In Scope This Session

### 1. Authentication

**Pages:** `src/pages/Login.tsx`, `src/pages/onboarding/SignupFormPage.tsx`
**Service:** `src/services/authService.ts`
**Context:** `src/context/AuthContext.tsx`

| Method | Endpoint | Body / Notes |
|--------|----------|--------------|
| POST | `/login/` | `{ email, password }` → `{ token, user_id, email, first_name, last_name }` |
| POST | `/users/register/` | `{ first_name, last_name, email, password }` |
| POST | `/users/forgot-password/` | `{ email }` |

After login: store `token` → `auth_token`, `user_id` → `user_id` in localStorage. `AuthContext` already reads these.

---

### 2. Onboarding

**Pages:** `src/pages/onboarding/` — runs after registration
**iOS reference:** `Circl_app/Onboarding/Page*.swift`

Onboarding is a multi-step flow. Each step calls its own endpoint. All require `Authorization: Token <token>`.

| Step | Page | Endpoint | Key Body Fields |
|------|------|----------|----------------|
| Personal details | `PersonalInfoPage.tsx` | POST `/users/update-personal-details/` | `user_id`, `birthday`, `personality_type` |
| Skills/location | `PersonalInfoPage.tsx` | POST `/users/update-skills-interests/` | `user_id`, `locations: []` |
| Business info | _(needs page)_ | POST `/users/update-business-info/` | `user_id`, `business_name`, `scale_type`, `business_stage`, `business_revenue`, `industry`, `business_location`, `is_legally_incorporated` |
| Business details | _(needs page)_ | POST `/users/update-business-details/` | `user_id` + detail fields |
| Profile picture | `ProfilePicturePage.tsx` | POST `/users/upload_profile_image/` | `multipart/form-data` with `image` field |

**Flow:** Registration → Personal Info → Skills → Business Info → Business Details → Profile Picture → Home

---

### 3. Circles

**Pages:** `src/pages/Circles.tsx`, `src/pages/circles/`
**Service:** `src/services/circleServices.ts`
**iOS reference:** `Circl_app/circles/PageCircles.swift`, `PageGroupchats.swift`, `PageCircleMessages.swift`

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/circles/my_circles/<user_id>/` | Circles the user belongs to |
| GET | `/circles/explore_circles/<user_id>/` | Discover new circles |
| POST | `/circles/join_circle/` | `{ circle_id, user_id }` |
| POST | `/circles/create_with_channels/` | Create circle with initial channels |
| GET | `/circles/get_circle_details/?circle_id=<id>&user_id=<id>` | Full circle detail |
| GET | `/circles/members/<circle_id>/` | Member list |
| GET | `/circles/get_channels/<circle_id>/` | Channels in a circle |
| POST | `/circles/leave_circle/` | `{ circle_id, user_id }` |
| POST | `/circles/delete_circle/` | Admin only |
| POST | `/circles/upload_circle_image/` | `multipart/form-data` |
| GET | `/circles/get_threads/<circle_id>/` | Threads/posts in a circle |
| POST | `/circles/create_thread/` | New thread |
| POST | `/circles/toggle_like/` | Like or unlike a thread |
| POST | `/circles/post_comment/` | Comment on a thread |
| GET | `/circles/get_comments/<thread_id>/` | Thread comments |
| GET | `/circles/get_announcements/<circle_id>/` | Announcements |
| POST | `/circles/post_announcement/` | Create announcement (admin) |
| DELETE | `/circles/announcements/delete/<announcement_id>/` | Delete announcement |
| GET | `/circles/get_categories/<circle_id>/?user_id=<id>` | Channel categories |
| POST | `/circles/create_invite_link/<circle_id>/` | Generate shareable invite |
| GET | `/circles/invite_preview/<token>/` | Preview an invite |
| POST | `/circles/resolve_invite/<token>/` | Accept invite via link |

---

### 4. Messaging

**Pages:** `src/pages/Messages.tsx`, `src/pages/ChatView.tsx`
**Service:** `src/services/circleServices.ts` (circle chat) and `src/services/userServices.ts` (DMs)
**iOS reference:** `Circl_app/network/ChatView.swift`, `PageMessages.swift`, `PageCircleMessages.swift`

#### Direct Messages (DMs)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/users/get_network/<user_id>/` | Who the user can message |
| GET | `/users/get_messages/<user_id>/` | DM thread with a specific user |
| POST | `/users/send_message/` | `{ recipient_id, content }` |
| POST | `/users/send_message_with_media/` | `multipart/form-data` with media |
| POST | `/users/mark_messages_read/` | Mark thread as read |

#### Circle Channel Chat
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/circles/get_messages/<channel_id>/` | Messages in a channel |
| POST | `/circles/send_message/` | `{ channel_id, content }` |

---

### 5. Settings

**Pages:** `src/pages/Settings.tsx`, `src/pages/settings/`
**Service:** `src/services/userServices.ts`
**iOS reference:** `Circl_app/circl_test_app/PageSettings.swift`

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/users/profile/<user_id>/` | Load current user's profile |
| POST | `/users/update-user-profile/` | Update profile info |
| POST | `/users/update-personal-details/` | Birthday, personality type |
| POST | `/users/update-user-bio/` | `{ user_id, bio }` |
| POST | `/users/upload_profile_image/` | `multipart/form-data` |
| POST | `/users/change_password/` | `{ old_password, new_password }` |
| POST | `/users/apply_mentor/` | Apply to become a mentor |
| GET | `/users/get_blocked_users/` | Blocked users list |
| POST | `/users/unblock_user/` | `{ user_id }` |
| POST | `/users/block_user/` | `{ user_id }` |
| POST | `/users/request_delete_account/` | Request account deletion |
| POST | `/users/submit_feedback/` | Feedback / bug report |

---

## Rules

1. **Use the shared `api` instance** — always import from `authService.ts`, never use raw axios.
2. **TypeScript required** — every API function needs typed request and response interfaces.
3. **Use iOS as reference** — when in doubt about a field name, payload shape, or flow, check the matching Swift file.
4. **One service file per domain** — don't scatter API calls into page components.
5. **Do not modify the backend** — all fixes happen in `circl_webapp/` only.
