# Circl Webapp API Implementation Checklist

This checklist covers all major API groups and endpoints to implement in the `circl_webapp` project.

---

## User APIs (`/api/users/`)
- [ ] `GET /users/` — List users
- [ ] `GET /users/:id/` — Get user profile
- [ ] `POST /users/` — Create user
- [ ] `PUT /users/:id/` — Update user
- [ ] `DELETE /users/:id/` — Delete user

## Auth APIs (`/api/auth/`)
- [ ] `POST /auth/login/` — Login
- [ ] `POST /auth/logout/` — Logout
- [ ] `POST /auth/register/` — Register
- [ ] `POST /auth/password-reset/` — Password reset

## Circl (Circle) APIs (`/api/circls/`)
- [ ] `GET /circls/` — List circles
- [ ] `GET /circls/:id/` — Get circle details
- [ ] `POST /circls/` — Create circle
- [ ] `PUT /circls/:id/` — Update circle
- [ ] `DELETE /circls/:id/` — Delete circle

## Channel APIs (`/api/channels/`)
- [ ] `GET /circls/:circlId/channels/` — List channels in a circle
- [ ] `POST /circls/:circlId/channels/` — Create channel
- [ ] `GET /channels/:id/` — Get channel details
- [ ] `PUT /channels/:id/` — Update channel
- [ ] `DELETE /channels/:id/` — Delete channel

## Message APIs (`/api/channels/:channelId/messages/`)
- [ ] `GET /channels/:channelId/messages/` — List messages in a channel
- [ ] `POST /channels/:channelId/messages/` — Send message

## Notification APIs (`/api/notifications/`)
- [ ] `GET /notifications/` — List notifications
- [ ] `POST /notifications/` — Create notification

## Invite APIs (`/api/invites/`)
- [ ] `POST /invites/` — Send invite
- [ ] `GET /invites/:token/` — Accept invite

## Profile/Settings APIs (`/api/profile/`)
- [ ] `GET /profile/` — Get current user profile
- [ ] `PUT /profile/` — Update current user profile
- [ ] `POST /profile/avatar/` — Upload avatar

---

**Legend:**
- `[ ]` Not implemented
- `[x]` Implemented

Update this checklist as endpoints are implemented in the codebase.
