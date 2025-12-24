# 🚀 CIRCL WEB APP - FAST-SHIP MIGRATION PLAN (4-6 WEEKS)

**Last Updated:** December 24, 2025  
**Target:** Ship a working web MVP in 4-6 weeks, not 12+ weeks.  
**Strategy:** Build core features FAST. Skip perfectionism. Launch and iterate.

---

## 📊 BACKEND API REFERENCE

**Base URL:** `https://circlapp.online/api/`

**Key Endpoints (Confirmed from iOS App):**
- Authentication: `/auth/login`, `/auth/logout`, `/auth/register`
- Forum: `/forum/posts`, `/forum/posts/{id}/comments`, `/forum/posts/{id}/like`
- Networking: `/network/connections`, `/network/invites`, `/network/invites/{id}/accept`
- Profiles: `/profile`, `/profile/{id}`, `/profile/image`
- Mentors: `/mentors`, `/mentors/{id}/request`
- Entrepreneurs: `/entrepreneurs`, `/entrepreneurs/{id}`
- Circles: `/circles`, `/circles/{id}/join`, `/circles/{id}/members`
- Chats: `/chats`, `/chats/{id}/messages`

---

## ⚡ PHASE 1: MVP CORE (Week 1-2) - SHIP THIS FIRST

**Goal:** Users can login, view forum feed, and navigate. That's it.

### 1.1 Authentication System (6-8 hours)
**iOS Pages:** `Page1.swift` (Login)
**Web Route:** `/login`

**Tasks:**
- [ ] **1.1.1** Create `src/pages/Login.tsx` (2h)
  - Email/password form with React Hook Form
  - Client-side validation (required fields only)
  - Loading spinner on submit
  
- [ ] **1.1.2** Create `src/services/authService.ts` (2h)
  - `POST /auth/login` endpoint
  - Token storage in localStorage
  - Axios interceptor to add token to requests
  
- [ ] **1.1.3** Create `src/context/AuthContext.tsx` (2h)
  - `isLoggedIn` state
  - `user` state (name, email, profile image)
  - `login()` and `logout()` functions
  
- [ ] **1.1.4** Add protected routes in `App.tsx` (2h)
  - Redirect to `/login` if not authenticated
  - Redirect to `/forum` after successful login

**API Endpoints:**
- `POST /auth/login` → `{ token: string, user: {...} }`
- `POST /auth/logout`

**Dependencies:** None
**Estimated Total:** 8 hours

---

### 1.2 Basic Navigation Shell (6-8 hours)
**iOS Components:** `CustomMenuBar.swift`, `MenuItem.swift`, `AdaptiveLayoutManager.swift`
**Web Routes:** All routes (shell only)

**Tasks:**
- [ ] **1.2.1** Create `src/components/Layout/Header.tsx` (2h)
  - Logo on left
  - Profile dropdown on right
  - Fixed at top, responsive
  
- [ ] **1.2.2** Create `src/components/Layout/BottomNav.tsx` (2h)
  - 4 tabs: Forum, Network, Circles, More
  - Icons + labels
  - Active state highlighting
  - Hidden on desktop (`md:hidden`)
  
- [ ] **1.2.3** Create `src/components/Layout/Sidebar.tsx` (2h)
  - Same 4 nav items as bottom nav
  - User profile at top
  - Logout button at bottom
  - Hidden on mobile (`hidden md:block`)
  
- [ ] **1.2.4** Create `src/components/Layout/MainLayout.tsx` (2h)
  - Wraps Header + Sidebar/BottomNav + Content area
  - Responsive switching (mobile → bottom nav, desktop → sidebar)
  - Used by all protected routes

**Dependencies:** AuthContext (for user info in sidebar)
**Estimated Total:** 8 hours

---

### 1.3 Forum Feed (View Only) (10-12 hours)
**iOS Pages:** `PageForum.swift`
**Web Route:** `/forum`

**Tasks:**
- [ ] **1.3.1** Create `src/services/forumService.ts` (2h)
  - `GET /forum/posts` with React Query
  - Data types: ForumPost, Comment
  
- [ ] **1.3.2** Create `src/components/forum/ForumPost.tsx` (4h)
  - Display: user name, profile image, content, timestamp
  - Show like count + comment count (no interactions yet)
  - Responsive card layout
  - Time-ago formatting (e.g., "2 hours ago")
  
- [ ] **1.3.3** Create `src/pages/Forum.tsx` (4h)
  - Fetch posts with `useQuery` from React Query
  - Infinite scroll OR simple pagination
  - Loading skeleton
  - Empty state ("No posts yet")
  
- [ ] **1.3.4** Error handling + loading states (2h)
  - Show toast on API errors
  - Retry button for failed loads
  - Skeleton loader while fetching

**API Endpoints:**
- `GET /forum/posts` → `ForumPost[]`

**Data Models:**
```typescript
interface ForumPost {
  id: number;
  user: string;
  user_id: number;
  profileImage?: string;
  content: string;
  category: string;
  privacy: string;
  image?: string;
  created_at: string;
  comment_count?: number;
  like_count: number;
  liked_by_user: boolean;
}
```

**Dependencies:** AuthContext, Layout
**Estimated Total:** 12 hours

---

### 1.4 Basic Utilities & Setup (4-6 hours)

**Tasks:**
- [ ] **1.4.1** Update `.env` file (0.5h)
  ```
  VITE_API_BASE_URL=https://circlapp.online/api/
  ```
  
- [ ] **1.4.2** Verify `src/utils/colors.ts` (0.5h)
  - Brand colors from iOS app
  
- [ ] **1.4.3** Create `src/utils/formatters.ts` (1h)
  - `formatTimeAgo(date)` - "2 hours ago"
  - `formatDate(date)` - "Jan 15, 2025"
  
- [ ] **1.4.4** Create `src/components/common/Button.tsx` (2h)
  - Primary, secondary, danger variants
  - Loading state
  - Disabled state
  
- [ ] **1.4.5** Create `src/components/common/Avatar.tsx` (2h)
  - Circular image
  - Fallback to initials
  - Size variants (sm, md, lg)

**Dependencies:** None
**Estimated Total:** 6 hours

---

### 🎯 PHASE 1 DELIVERABLE

**Total Estimated Time:** 34-42 hours (1-2 weeks)

**Demo-able Features:**
✅ Users can login with email/password
✅ Users see a forum feed with posts
✅ Navigation works (bottom nav on mobile, sidebar on desktop)
✅ App is responsive (mobile, tablet, desktop)

**What's NOT included:**
❌ Post creation
❌ Likes/comments
❌ Profile editing
❌ Any networking features

---

## 🔥 PHASE 2: SOCIAL FEATURES (Week 3)

**Goal:** Users can interact with content and view profiles.

### 2.1 Post Creation (6-8 hours)
**iOS Components:** `PostComposerView.swift`, `PostComposeSheet.swift`
**Web Route:** `/forum` (modal or inline)

**Tasks:**
- [ ] **2.1.1** Create `src/components/forum/PostComposer.tsx` (3h)
  - Textarea with character limit
  - Category dropdown
  - Privacy dropdown (Public/Private)
  - Image upload (optional)
  - Submit button
  
- [ ] **2.1.2** Integrate `POST /forum/posts` API (2h)
  - Mutation with React Query
  - Optimistic update (add post to list immediately)
  - Success toast
  
- [ ] **2.1.3** Add to Forum page (2h)
  - Show composer at top of feed (desktop)
  - Floating "+" button → modal (mobile)

**API Endpoints:**
- `POST /forum/posts` → `{ content, category, privacy, image? }`

**Dependencies:** Forum feed (Phase 1.3)
**Estimated Total:** 8 hours

---

### 2.2 Likes & Comments (8-10 hours)
**iOS Components:** `CommentSection.swift`, Post interactions

**Tasks:**
- [ ] **2.2.1** Add like button to ForumPost component (2h)
  - Toggle like with `POST /forum/posts/{id}/like`
  - Optimistic UI update
  - Show like count
  
- [ ] **2.2.2** Create `src/components/forum/CommentSection.tsx` (4h)
  - List comments below post
  - Show user, text, timestamp
  - Like button on comments
  
- [ ] **2.2.3** Add comment composer (3h)
  - Input field below comments
  - `POST /forum/posts/{id}/comments`
  - Optimistic update
  
- [ ] **2.2.4** Integrate into Forum page (1h)
  - Expand/collapse comments
  - "View X comments" link

**API Endpoints:**
- `POST /forum/posts/{id}/like`
- `DELETE /forum/posts/{id}/like`
- `GET /forum/posts/{id}/comments`
- `POST /forum/posts/{id}/comments`

**Dependencies:** Forum feed (Phase 1.3)
**Estimated Total:** 10 hours

---

### 2.3 Profile Viewing (6-8 hours)
**iOS Pages:** `ProfilePage.swift`, `FullProfile.swift`
**Web Route:** `/profile/:userId`

**Tasks:**
- [ ] **2.3.1** Create `src/services/profileService.ts` (1h)
  - `GET /profile/{id}` endpoint
  
- [ ] **2.3.2** Create `src/pages/ProfileView.tsx` (4h)
  - Display: name, username, profile image, bio
  - Display: title, company, tags
  - Recent forum posts by user
  - Connection button (if not connected)
  
- [ ] **2.3.3** Link profiles from forum posts (1h)
  - Make user names clickable → navigate to profile
  
- [ ] **2.3.4** Create "My Profile" page (2h)
  - Same as ProfileView but with "Edit" button
  - Route: `/profile/me`

**API Endpoints:**
- `GET /profile` → Current user profile
- `GET /profile/{id}` → Public profile

**Data Models:**
```typescript
interface UserProfile {
  user_id: number;
  name: string;
  username: string;
  email: string;
  title?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  tags: string[];
}
```

**Dependencies:** AuthContext
**Estimated Total:** 8 hours

---

### 2.4 Profile Editing (6-8 hours)
**iOS Pages:** Profile editing modals
**Web Route:** `/profile/edit`

**Tasks:**
- [ ] **2.4.1** Create `src/pages/ProfileEdit.tsx` (4h)
  - Form: name, title, company, bio, tags
  - Profile image upload
  - Save button
  
- [ ] **2.4.2** Integrate `PUT /profile` API (2h)
  - Update with React Query mutation
  - Success toast
  - Redirect to `/profile/me`
  
- [ ] **2.4.3** Image upload handler (2h)
  - `POST /profile/image` with FormData
  - Preview before upload

**API Endpoints:**
- `PUT /profile` → Updated profile data
- `POST /profile/image` → Upload profile image

**Dependencies:** Profile viewing (Phase 2.3)
**Estimated Total:** 8 hours

---

### 🎯 PHASE 2 DELIVERABLE

**Total Estimated Time:** 34-42 hours (1 week)

**Demo-able Features:**
✅ Users can create forum posts
✅ Users can like posts and add comments
✅ Users can view other profiles
✅ Users can edit their own profile

---

## 🤝 PHASE 3: NETWORKING (Week 4)

**Goal:** Users can browse professionals and connect with them.

### 3.1 My Network Page (8-10 hours)
**iOS Pages:** `PageMyNetwork.swift`
**Web Route:** `/network`

**Tasks:**
- [ ] **3.1.1** Create `src/services/networkService.ts` (2h)
  - `GET /network/connections`
  - `GET /network/invites/pending`
  
- [ ] **3.1.2** Create `src/components/networking/ProfileCard.tsx` (3h)
  - Compact card: image, name, title, company
  - Action buttons: View Profile, Message
  
- [ ] **3.1.3** Create `src/pages/Network.tsx` (4h)
  - Tabs: "Connections" | "Pending Invites"
  - List of connections (ProfileCard grid)
  - Accept/decline buttons on pending invites
  - Search/filter by name
  
- [ ] **3.1.4** Integrate accept/decline APIs (1h)
  - `POST /network/invites/{id}/accept`
  - `POST /network/invites/{id}/reject`

**API Endpoints:**
- `GET /network/connections` → `InviteProfileData[]`
- `GET /network/invites/pending` → `InviteProfileData[]`
- `POST /network/invites/{id}/accept`
- `POST /network/invites/{id}/reject`

**Data Models:**
```typescript
interface NetworkConnection {
  id: string;
  user_id: number;
  name: string;
  username: string;
  title?: string;
  company?: string;
  profileImage?: string;
  tags: string[];
}
```

**Dependencies:** Profile components (Phase 2.3)
**Estimated Total:** 10 hours

---

### 3.2 Browse Entrepreneurs (6-8 hours)
**iOS Pages:** `PageEntrepreneurMatching.swift`
**Web Route:** `/entrepreneurs`

**Tasks:**
- [ ] **3.2.1** Create `src/services/entrepreneurService.ts` (1h)
  - `GET /entrepreneurs` with filters
  
- [ ] **3.2.2** Create `src/pages/Entrepreneurs.tsx` (4h)
  - Grid of entrepreneur profiles (reuse ProfileCard)
  - Filter: business stage, industry
  - Search by name
  - Connect button on each card
  
- [ ] **3.2.3** Send connection request (2h)
  - `POST /network/invites` with user_id
  - Success toast
  - Disable button after sending

**API Endpoints:**
- `GET /entrepreneurs` → `EntrepreneurProfile[]`
- `POST /network/invites` → Send connection request

**Dependencies:** Network service (Phase 3.1)
**Estimated Total:** 8 hours

---

### 3.3 Browse Mentors (6-8 hours)
**iOS Pages:** `PageMentorMatching.swift`
**Web Route:** `/mentors`

**Tasks:**
- [ ] **3.3.1** Create `src/services/mentorService.ts` (1h)
  - `GET /mentors` with filters
  
- [ ] **3.3.2** Create `src/pages/Mentors.tsx` (4h)
  - Grid of mentor profiles (reuse ProfileCard)
  - Filter: expertise, company
  - Search by name
  - "Request Mentor" button
  
- [ ] **3.3.3** Request mentor connection (2h)
  - `POST /mentors/{id}/request`
  - Success toast

**API Endpoints:**
- `GET /mentors` → `MentorProfile[]`
- `POST /mentors/{id}/request`

**Dependencies:** Network service (Phase 3.1)
**Estimated Total:** 8 hours

---

### 🎯 PHASE 3 DELIVERABLE

**Total Estimated Time:** 26-34 hours (1 week)

**Demo-able Features:**
✅ Users can view their network connections
✅ Users can accept/decline connection requests
✅ Users can browse entrepreneurs and connect
✅ Users can browse mentors and request connections

---

## 🚀 PHASE 4: ADVANCED FEATURES (Week 5+)

**Goal:** Complete remaining features for full parity.

### 4.1 Circles (Community Groups) (10-12 hours)
**iOS Pages:** `PageCircles.swift`
**Web Route:** `/circles`

**Tasks:**
- [ ] **4.1.1** Create `src/services/circleService.ts` (2h)
  - `GET /circles` - List all circles
  - `POST /circles/{id}/join` - Join circle
  - `GET /circles/{id}/members` - View members
  
- [ ] **4.1.2** Create `src/components/circles/CircleCard.tsx` (3h)
  - Display: circle name, description, member count
  - Join/Leave button
  
- [ ] **4.1.3** Create `src/pages/Circles.tsx` (4h)
  - Grid of available circles
  - "My Circles" tab
  - Circle detail page: members list, posts (optional)
  
- [ ] **4.1.4** Integrate join/leave actions (2h)
  - Optimistic updates
  - Success toasts

**API Endpoints:**
- `GET /circles`
- `POST /circles/{id}/join`
- `DELETE /circles/{id}/join`
- `GET /circles/{id}/members`

**Estimated Total:** 12 hours

---

### 4.2 Group Chats (12-15 hours)
**iOS Pages:** `PageGroupchats.swift`, `GroupChatView.swift`
**Web Route:** `/chats`

**Tasks:**
- [ ] **4.2.1** Create `src/services/chatService.ts` (2h)
  - `GET /chats` - List user chats
  - `GET /chats/{id}/messages` - Fetch messages
  - `POST /chats/{id}/messages` - Send message
  
- [ ] **4.2.2** Create `src/components/chat/ChatList.tsx` (3h)
  - List of chats with last message preview
  - Unread badge
  
- [ ] **4.2.3** Create `src/components/chat/ChatWindow.tsx` (5h)
  - Message list (scrollable)
  - Input field at bottom
  - Send button
  - Auto-scroll to latest message
  
- [ ] **4.2.4** Create `src/pages/Chats.tsx` (3h)
  - Split layout: chat list (left) + chat window (right) on desktop
  - Mobile: list view → chat view navigation
  
- [ ] **4.2.5** Real-time updates (optional with WebSockets) (3h)
  - Poll for new messages every 5 seconds OR
  - WebSocket connection for instant messages

**API Endpoints:**
- `GET /chats`
- `GET /chats/{id}/messages`
- `POST /chats/{id}/messages`

**Estimated Total:** 15 hours

---

### 4.3 Business Profile Management (8-10 hours)
**iOS Pages:** `PageBusinessProfile.swift`
**Web Route:** `/business`

**Tasks:**
- [ ] **4.3.1** Create `src/pages/BusinessProfile.tsx` (4h)
  - Display: business name, stage, industry, bio
  - Funding raised, looking for, mentor status
  
- [ ] **4.3.2** Create `src/pages/BusinessProfileEdit.tsx` (4h)
  - Form to edit business details
  - `PUT /profile/business` endpoint
  
- [ ] **4.3.3** Add to More menu and profile pages (1h)

**API Endpoints:**
- `GET /profile/business`
- `PUT /profile/business`

**Estimated Total:** 10 hours

---

### 4.4 Settings Page (6-8 hours)
**iOS Pages:** `PageSettings.swift`
**Web Route:** `/settings`

**Tasks:**
- [ ] **4.4.1** Create `src/pages/Settings.tsx` (4h)
  - Account: change password, email
  - Privacy: profile visibility, connection permissions
  - Notifications: toggle types
  - Blocked users list
  - Logout button
  
- [ ] **4.4.2** Integrate settings APIs (3h)
  - `PUT /settings/account`
  - `PUT /settings/privacy`
  - `PUT /settings/notifications`
  - `GET /settings/blocked`

**API Endpoints:**
- `GET /settings`
- `PUT /settings/account`
- `PUT /settings/privacy`
- `PUT /settings/notifications`

**Estimated Total:** 8 hours

---

### 4.5 More Menu (4-6 hours)
**iOS Pages:** `PageMore.swift`
**Web Route:** `/more`

**Tasks:**
- [ ] **4.5.1** Create `src/pages/More.tsx` (3h)
  - Navigation hub with large icon buttons
  - Links to: Profile, Business, Entrepreneurs, Mentors, Circles, Chats, Settings
  - User profile header
  
- [ ] **4.5.2** Add badge notifications (2h)
  - Unread message count on Chats
  - Pending invites count on Network

**Dependencies:** All other pages
**Estimated Total:** 6 hours

---

### 🎯 PHASE 4 DELIVERABLE

**Total Estimated Time:** 51-61 hours (2 weeks)

**Demo-able Features:**
✅ Users can join/leave circles
✅ Users can send/receive group chat messages
✅ Users can manage business profiles
✅ Users can adjust settings
✅ Complete navigation via More menu

---

## 📋 TOTAL PROJECT TIMELINE

| Phase | Features | Time | Week |
|-------|----------|------|------|
| **Phase 1** | Login, Forum (view), Nav | 34-42h | Week 1-2 |
| **Phase 2** | Post creation, Likes, Comments, Profiles | 34-42h | Week 3 |
| **Phase 3** | Network, Entrepreneurs, Mentors | 26-34h | Week 4 |
| **Phase 4** | Circles, Chats, Business, Settings | 51-61h | Week 5-6 |
| **TOTAL** | MVP to Full Feature | **145-179 hours** | **4-6 weeks** |

---

## 🎯 PRIORITIZATION RULES

### Must Have (Phase 1-2)
- ✅ Login/Auth
- ✅ Forum feed viewing
- ✅ Post creation
- ✅ Likes & Comments
- ✅ Profile viewing

### Should Have (Phase 3)
- ✅ My Network
- ✅ Browse Entrepreneurs/Mentors
- ✅ Connection requests

### Nice to Have (Phase 4)
- ✅ Circles
- ✅ Group Chats
- ✅ Business Profiles
- ✅ Settings

---

## 🔧 TECHNOLOGY REMINDERS

**Already Installed:**
- React 19 + TypeScript
- React Router 7
- React Query (data fetching/caching)
- Tailwind CSS 4
- Axios
- React Hot Toast (notifications)
- Error Boundary

**Responsive Breakpoints (Tailwind):**
- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

**State Management:**
- React Query for server state (API data)
- Context API for auth state
- `useState` for local component state

---

## 🚢 SHIPPING CHECKLIST

### Before Launch
- [ ] Test on mobile (Chrome DevTools)
- [ ] Test on tablet (iPad simulation)
- [ ] Test on desktop (1920x1080)
- [ ] Test all API endpoints with real backend
- [ ] Add loading states to all pages
- [ ] Add error handling to all API calls
- [ ] Test authentication flow (login → logout → login)
- [ ] Verify responsive navigation (bottom nav ↔ sidebar)

### Performance
- [ ] Lazy load pages with `React.lazy()`
- [ ] Implement infinite scroll on forum feed
- [ ] Optimize images (compress, lazy load)
- [ ] Enable React Query caching (5min default)

### Polish
- [ ] Match brand colors from iOS app
- [ ] Add smooth transitions (Tailwind `transition-all`)
- [ ] Toast notifications for all user actions
- [ ] Empty states for all lists
- [ ] 404 page for invalid routes

---

## 🎨 IOS → WEB PAGE MAPPING

| iOS Page | Web Route | Phase | Priority |
|----------|-----------|-------|----------|
| `Page1.swift` (Login) | `/login` | 1 | CRITICAL |
| `PageForum.swift` | `/forum` | 1 | CRITICAL |
| `PageMyNetwork.swift` | `/network` | 3 | HIGH |
| `ProfilePage.swift` | `/profile/:id` | 2 | HIGH |
| `PageEntrepreneurMatching.swift` | `/entrepreneurs` | 3 | HIGH |
| `PageMentorMatching.swift` | `/mentors` | 3 | HIGH |
| `PageCircles.swift` | `/circles` | 4 | MEDIUM |
| `PageGroupchats.swift` | `/chats` | 4 | MEDIUM |
| `PageBusinessProfile.swift` | `/business` | 4 | MEDIUM |
| `PageSettings.swift` | `/settings` | 4 | MEDIUM |
| `PageMore.swift` | `/more` | 4 | LOW |

---

## 🔥 FAST-SHIP TIPS

1. **Don't overthink styling** - Use Tailwind defaults, adjust later
2. **Skip animations initially** - Add polish in Phase 4
3. **Use React Query devtools** - Debug API calls instantly
4. **Test mobile-first** - Easier to scale up than down
5. **Copy component patterns** - Reuse ProfileCard, Button, etc.
6. **Commit after each task** - Track progress, easy rollback
7. **Use TypeScript strictly** - Catch bugs early
8. **Deploy early** - Vercel/Netlify for stakeholder demos

---

**LET'S BUILD FAST. SHIP FAST. ITERATE FAST.** 🚀
