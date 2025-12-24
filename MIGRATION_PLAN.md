# Circl iOS to React Web Migration Plan

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Comparison](#architecture-comparison)
3. [Project Structure](#project-structure)
4. [Technology Stack](#technology-stack)
5. [Phase 1: Foundation Setup](#phase-1-foundation-setup)
6. [Phase 2: Component Architecture](#phase-2-component-architecture)
7. [Phase 3: State Management](#phase-3-state-management)
8. [Phase 4: Responsive Design System](#phase-4-responsive-design-system)
9. [Phase 5: Feature Implementation](#phase-5-feature-implementation)
10. [Phase 6: API Integration](#phase-6-api-integration)
11. [Implementation Checklist](#implementation-checklist)

---

## Project Overview

### What is Circl?
Circl is a university-focused community networking platform that enables students and professionals to:
- Share knowledge through forums and discussions
- Network with mentors and entrepreneurs
- Build and manage business profiles
- Join specialized communities (circles)
- Participate in group chats
- Access resources and knowledge base

### Current State (iOS/Mac)
- **Framework**: SwiftUI with Mac Catalyst for iPad/Mac adaptation
- **Architecture**: MVVM with observable state management
- **Adaptive UI**: Automatic layout switching between iPhone (bottom nav) and iPad/Mac (sidebar nav)
- **API Integration**: RESTful backend at `https://circlapp.online/api/`
- **Authentication**: Login-based with token management

### Target State (Web)
- **Framework**: React 19 + Vite (development server)
- **Styling**: Tailwind CSS v4 with responsive breakpoints
- **Architecture**: Component-based with Context API for state management
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints (mobile, tablet, desktop)
- **Routing**: React Router v7 for multi-page navigation
- **API Integration**: Axios for HTTP requests

---

## Architecture Comparison

### iOS SwiftUI → React Mapping

| SwiftUI Concept | React Equivalent | Purpose |
|---|---|---|
| `@EnvironmentObject` | React Context | Global state (auth, user data) |
| `@Published` | `useState` hooks | Component state |
| `@State` | `useState` | Local component state |
| `ObservableObject` | Custom Context Provider | State management class |
| `NavigationView` + `NavigationLink` | React Router `<Routes>` + `<Link>` | Navigation between pages |
| Adaptive Layout Manager | Custom hook + Tailwind breakpoints | Device detection & responsive layout |
| SwiftUI Views | React Components (JSX) | UI building blocks |
| View Modifiers | CSS classes (Tailwind) | Styling & layout |

### Key Architectural Differences

#### 1. **State Management**
**SwiftUI (iOS):**
```swift
class AppState: ObservableObject {
    @Published var isLoggedIn: Bool = false
    @Published var currentUser: User? = nil
}
```

**React (Web):**
```javascript
const AppContext = createContext();
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [currentUser, setCurrentUser] = useState(null);
```

#### 2. **Responsive Layout**
**SwiftUI (iOS):**
- Uses `@Environment(\.horizontalSizeClass)` to detect compact vs regular
- Conditional rendering based on `isCompactDevice`

**React (Web):**
- Uses Tailwind responsive classes: `hidden md:block lg:flex`
- CSS media queries for breakpoints (768px tablet, 1024px desktop)

#### 3. **Navigation**
**SwiftUI (iOS):**
- NavigationView with NavigationLink for page transitions
- Bottom TabView for iOS, Sidebar for iPad

**React (Web):**
- React Router with `<Routes>` and `<Route>`
- Dynamic navigation component switching based on screen size

---

## Project Structure

```
circl_webapp/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared across all pages
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── MenuItem.jsx
│   │   │   └── LoadingScreen.jsx
│   │   ├── forum/               # Forum-specific components
│   │   │   ├── ForumPost.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── PostComposer.jsx
│   │   │   └── CategoryFilter.jsx
│   │   ├── networking/          # Networking-specific components
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProfilePreview.jsx
│   │   │   └── NetworkFilter.jsx
│   │   └── shared/              # Generic components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       └── Avatar.jsx
│   │
│   ├── pages/                   # Page/view components
│   │   ├── Login.jsx            # Authentication entry
│   │   ├── Forum.jsx            # HomePage equivalent - Main forum feed
│   │   ├── Networking.jsx       # PageMyNetwork - Network contacts
│   │   ├── BusinessProfile.jsx  # PageBusinessProfile - User business info
│   │   ├── Mentors.jsx          # PageMentorMatching - Find & connect with mentors
│   │   ├── Entrepreneurs.jsx    # PageEntrepreneurMatching - Connect with entrepreneurs
│   │   ├── Circles.jsx          # PageCircles - Join specialized communities
│   │   ├── GroupChats.jsx       # PageGroupchats - Community messaging
│   │   ├── Resources.jsx        # PageEntrepreneurResources - Knowledge base
│   │   ├── Skills.jsx           # PageSkillSellingMatching - Skill exchange
│   │   ├── Settings.jsx         # PageSettings - User settings & preferences
│   │   ├── More.jsx             # PageMore - Main menu for navigation
│   │   └── NotFound.jsx         # 404 page
│   │
│   ├── services/                # API & external services
│   │   ├── api.js               # Axios instance with base config
│   │   ├── authService.js       # Login, logout, token management
│   │   ├── forumService.js      # Forum API calls (posts, comments, likes)
│   │   ├── networkService.js    # Networking API calls (connections, invites)
│   │   ├── profileService.js    # Profile API calls
│   │   ├── mentorService.js     # Mentor matching API calls
│   │   ├── circleService.js     # Circle/community API calls
│   │   ├── chatService.js       # Group chat API calls
│   │   └── resourceService.js   # Resource/knowledge base API calls
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js           # Authentication state hook
│   │   ├── useResponsive.js     # Device/breakpoint detection hook
│   │   ├── useFetch.js          # Data fetching hook
│   │   └── useLocalStorage.js   # LocalStorage management hook
│   │
│   ├── context/                 # Context API providers
│   │   ├── AuthContext.js       # App-wide auth state
│   │   ├── UserContext.js       # User data context
│   │   └── NotificationContext.js # In-app notifications
│   │
│   ├── types/                   # TypeScript/JSDoc type definitions
│   │   ├── models.js            # Data model interfaces matching Swift models
│   │   ├── api.js               # API response types
│   │   └── components.js        # Component prop types
│   │
│   ├── utils/                   # Utility functions
│   │   ├── formatters.js        # Date, number, text formatting
│   │   ├── validators.js        # Form validation
│   │   ├── helpers.js           # Generic helper functions
│   │   ├── colors.js            # Color constants matching brand
│   │   └── constants.js         # App-wide constants
│   │
│   ├── styles/                  # Global styles
│   │   ├── index.css            # Tailwind directives (already set up)
│   │   ├── variables.css        # CSS variables for colors/spacing
│   │   └── animations.css       # Custom animations matching iOS feel
│   │
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # Entry point
│   └── App.css                  # App-specific styles
│
├── MIGRATION_PLAN.md            # This file
├── tailwind.config.js           # Already configured
├── postcss.config.js            # Already configured
├── vite.config.js               # Already configured
├── package.json                 # Dependencies (already set up)
└── index.html                   # HTML entry point
```

---

## Technology Stack

### Core Stack - Already Installed ✅
- **React 19.2.0** - UI framework
- **React Router 7.11.0** - Client-side routing
- **Vite 7.2.4** - Dev server & bundler
- **Tailwind CSS 4.1.18** - Utility-first CSS
- **Axios 1.13.2** - HTTP client
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.23** - Vendor prefixes
- **ESLint 9.39.1** - Code linting

### Phase 1 Foundation - Now Complete ✅
- **TypeScript** - Full type safety for team scaling
- **React Query (@tanstack/react-query)** - Advanced data fetching/caching (replaces basic useState hooks)
- **Error Boundary** - Crash prevention with fallback UI (1-2 hour component)
- **Toast Notifications (react-hot-toast)** - User feedback with NotificationContext integration

### Additional Packages to Install (Optional)
```bash
npm install zustand                    # Alternative state management (if Context becomes complex)
npm install framer-motion              # Smooth animations matching iOS feel (optional)
npm install react-hook-form            # Form handling (for registration/profile edit)
npm install date-fns                   # Date formatting (replacing Swift DateFormatter)
```

---

## Phase 1: Foundation Setup

### Step 1.1: Project Structure Creation ✅
Created the folder structure with TypeScript support:
```
src/
├── components/
│   └── ErrorBoundary.tsx        ✅ COMPLETE - Crash prevention
├── context/
│   └── NotificationContext.tsx  ✅ COMPLETE - Toast notifications
├── App.tsx                      ✅ COMPLETE - React Router + React Query
├── main.tsx                     ✅ COMPLETE - TypeScript entry point
└── ... (other structure from plan)
```

### Step 1.2: Install Essential Dependencies ✅
All core dependencies installed:

```bash
npm install typescript @tanstack/react-query react-hot-toast
```

Verification:
```bash
npm list react react-dom react-router-dom axios tailwindcss typescript @tanstack/react-query react-hot-toast
```

### Step 1.3: TypeScript Configuration Files ✅
Created `tsconfig.json` and `tsconfig.node.json`:
- Strict type checking enabled
- JSX support for React
- Module resolution configured for bundler mode
- Source maps for debugging

### Step 1.4: Setup Environment Variables
Create `.env` file in project root:

```
VITE_API_BASE_URL=https://circlapp.online/api/
VITE_APP_NAME=Circl
```

Update `.gitignore` to include:
```
.env
.env.local
```

### Step 1.5: Color System & Branding
Create `src/utils/colors.js` with your brand colors from iOS app:

```javascript
export const COLORS = {
  primary: '#004aad',      // Main blue from iOS app
  primaryDark: '#001a3d',  // Dark blue
  secondary: '#0066ff',    // Light blue
  danger: '#ff3333',       // Red for delete/block
  success: '#00cc00',      // Green for success
  warning: '#ffaa00',      // Orange for warnings
  background: '#ffffff',
  surfaceLight: '#f5f5f5',
  surfaceDark: '#e8e8e8',
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#dddddd',
};
```

---

## Phase 2: Component Architecture

### Step 2.1: Create Base Components (`src/components/shared/`)

These are fundamental components used across the entire app.

#### Button.jsx
A versatile button component supporting multiple variants:
- **Variants**: primary, secondary, danger, ghost
- **Sizes**: small, medium, large
- **Props**: onClick, disabled, loading, icon

#### Input.jsx
Text input with validation support:
- **Props**: type, placeholder, value, onChange, error, label
- **Features**: Tailwind styling, error messages, icons

#### Card.jsx
Container component for content blocks:
- **Props**: title, children, footer, clickable
- **Features**: Shadow, rounded corners, padding

#### Avatar.jsx
User profile image component:
- **Props**: src, size, name, fallback
- **Features**: Circular image, initials fallback, status indicator

### Step 2.2: Create Layout Components (`src/components/common/`)

#### Header.jsx (Mobile/Tablet Top Navigation)
Displays app title and right-side actions (notifications, profile menu)

**Props:**
- `title` - Page title
- `actions` - Array of action buttons
- `showBack` - Show back button

**Features:**
- Fixed at top on all devices
- Contains logo/app name
- Action buttons on the right
- Tailwind styling with brand colors

#### Sidebar.jsx (Desktop Left Navigation)
Main navigation for tablets/desktops (hidden on mobile via Tailwind)

**Props:**
- `items` - Navigation menu items
- `active` - Current active item
- `onSelect` - Item selection callback
- `collapsed` - Collapse/expand state

**Structure:**
- Logo at top
- Navigation items with icons
- User profile section at bottom
- Collapse toggle button

#### BottomNav.jsx (Mobile Bottom Navigation)
Bottom tab bar for mobile devices (hidden on desktop via Tailwind)

**Props:**
- `items` - Navigation items
- `active` - Current active tab
- `onSelect` - Selection callback

**Features:**
- Fixed at bottom on mobile
- Icons + labels
- Badge indicators for unread counts
- Tailwind `md:hidden` to hide on larger screens

#### MenuItem.jsx
Individual menu item component used in More page and navigation menus

**Props:**
- `icon` - SF Symbol/React Icon name
- `title` - Menu item text
- `badgeCount` - Optional badge number
- `onClick` - Selection handler
- `color` - Optional custom color

### Step 2.3: Feature-Specific Components

#### Forum Components (`src/components/forum/`)
- **ForumPost.jsx** - Individual post with content, metadata, interactions
- **CommentSection.jsx** - Nested comments under posts
- **PostComposer.jsx** - Text input for creating posts
- **CategoryFilter.jsx** - Category/filter selection

#### Networking Components (`src/components/networking/`)
- **ProfileCard.jsx** - Compact profile display for list views
- **ProfilePreview.jsx** - Detailed profile modal/page view
- **NetworkFilter.jsx** - Filter mentors, entrepreneurs, etc.

### Step 2.4: Implement Layout Wrapper Component

Create `src/components/AdaptiveLayout.jsx` - Replaces SwiftUI's adaptive layout system

```javascript
export const AdaptiveLayout = ({ children, sidebar, bottomNav, header }) => {
  // On mobile (< 768px): Header + Content + BottomNav
  // On tablet/desktop (≥ 768px): Header + Sidebar + Content
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {header && <div className="md:sticky md:top-0 md:h-16">{header}</div>}
      
      {sidebar && (
        <aside className="hidden md:block md:w-64 md:border-r">
          {sidebar}
        </aside>
      )}
      
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">
        {children}
      </main>
      
      {bottomNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t">
          {bottomNav}
        </nav>
      )}
    </div>
  );
};
```

---

## Phase 3: State Management

### Step 3.1: Create Context Providers

#### AuthContext.js (`src/context/AuthContext.js`)
Manages authentication state globally (replaces AppState.swift)

```javascript
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  
  const login = async (email, password) => {
    // API call to backend
    // Store token in localStorage
    // Update state
  };
  
  const logout = () => {
    // Clear token
    // Reset user state
  };
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### UserContext.js (`src/context/UserContext.js`)
Manages current user profile data

```javascript
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  return (
    <UserContext.Provider value={{ userData, userProfile }}>
      {children}
    </UserContext.Provider>
  );
};
```

#### NotificationContext.tsx (`src/context/NotificationContext.tsx`) ✅ COMPLETE
Manages in-app toast notifications with react-hot-toast integration

**Features:**
- `NotificationProvider` - Wraps app with Toaster component
- `useNotification()` hook - Access notification system anywhere
- Support for success, error, info, loading types
- Auto-dismiss timers
- Queue management for multiple toasts

**Usage:**
```typescript
import { useNotification } from './context/NotificationContext';

function MyComponent() {
  const { addNotification } = useNotification();
  
  const handleClick = () => {
    addNotification('Success!', 'success', 3000);
  };
}
```

Already integrated in `App.tsx` as a provider wrapper.

### Step 3.2: Create Custom Hooks

#### useAuth.js (`src/hooks/useAuth.js`)
Convenience hook for accessing auth context

```javascript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
};
```

#### useResponsive.js (`src/hooks/useResponsive.js`)
Detect screen size for conditional rendering (replaces horizontalSizeClass)

```javascript
export const useResponsive = () => {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width
  };
};
```

#### useFetch.js (`src/hooks/useFetch.js`)
Reusable data fetching hook

```javascript
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, options);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
};
```

---

## Phase 4: Responsive Design System

### Step 4.1: Tailwind Responsive Breakpoints

Your `tailwind.config.js` already extends these. Key breakpoints:
- **Mobile-first**: Default styles apply to mobile
- **md** (768px): Tablet and up
- **lg** (1024px): Desktop and up
- **xl** (1280px): Large desktop

### Step 4.2: Layout Patterns

#### Mobile Layout (< 768px)
```
┌─────────────────┐
│     HEADER      │  (Fixed, contains logo + actions)
├─────────────────┤
│                 │
│    CONTENT      │  (Scrollable, pb-16 for bottom nav clearance)
│    (Full width) │
│                 │
├─────────────────┤
│  BOTTOM NAV     │  (Fixed tabs: Home, Explore, Network, More)
└─────────────────┘
```

#### Tablet/Desktop Layout (≥ 768px)
```
┌──────────────────────────────────────┐
│           HEADER                     │ (Fixed)
├─────────────┬──────────────────────┤
│             │                      │
│  SIDEBAR    │    CONTENT           │
│  (w-64)     │    (Full width)      │
│             │                      │
│             │                      │
└─────────────┴──────────────────────┘
```

### Step 4.3: Color & Typography Scale

**Colors** - Using Tailwind with custom brand colors:
```javascript
// tailwind.config.js
extend: {
  colors: {
    'circl-blue': '#004aad',
    'circl-dark': '#001a3d',
    'circl-light': '#0066ff',
  }
}
```

**Typography** - Standard scales:
- Page titles: `text-4xl font-bold` (desktop), `text-2xl font-bold` (mobile)
- Section titles: `text-2xl font-semibold`
- Body: `text-base` or `text-sm`
- Captions: `text-xs text-gray-500`

### Step 4.4: Spacing & Sizing

Consistent with Tailwind's scale (4px base unit):
- `p-4` = 16px padding
- `gap-3` = 12px gap
- `space-y-2` = 8px vertical space

---

## Phase 5: Feature Implementation

### Implementation Order (Priority)

1. **Login Page** - Authentication entry point
2. **Forum Page** - Main feed (complex, high traffic)
3. **Networking Page** - Connection management
4. **Business Profile** - User profile management
5. **More Menu** - Navigation hub to other sections
6. **Mentors & Entrepreneurs** - Matching features
7. **Circles** - Community management
8. **Group Chats** - Messaging
9. **Settings** - User preferences

### Step 5.1: Login Page (`src/pages/Login.jsx`)

**Maps to:** `Page1` from iOS app (pre-authentication page)

**Features:**
- Email/password input form
- Forgot password link
- Sign up option
- Validation error messages
- Loading state during API call
- Remember me checkbox

**Data Flow:**
1. User enters credentials
2. Form validation (client-side)
3. API call to `POST /auth/login`
4. Store JWT token in localStorage
5. Set `isLoggedIn = true` in AuthContext
6. Redirect to Forum page

### Step 5.2: Forum Page (`src/pages/Forum.jsx`)

**Maps to:** `PageForum` from iOS app

**Features:**
- Feed of forum posts from all categories
- Post composer (top of page, sticky on desktop)
- Filter by category/privacy
- Like/comment interactions
- User profile click-through
- Post deletion for own posts
- Report functionality
- Time-ago formatting

**Components Used:**
- `Header` with category filter
- `PostComposer` - Create new post
- `ForumPost` - Individual post display
- `CommentSection` - Nested comments
- `BottomNav` / `Sidebar` for navigation

**Data Models** (from SharedDataModels.swift):
```javascript
// ForumPostModel
{
  id: number,
  user: string,
  user_id: number,
  profileImage: string?,
  content: string,
  category: string,
  privacy: string,
  image: string?,
  created_at: string,
  comment_count: number?,
  like_count: number,
  liked_by_user: boolean,
  isMentor: boolean?
}

// CommentModel
{
  id: number,
  user: string,
  text: string,
  created_at: string,
  like_count: number,
  liked_by_user: boolean,
  profile_image: string?
}
```

### Step 5.3: Networking Page (`src/pages/Networking.jsx`)

**Maps to:** `PageMyNetwork` from iOS app

**Features:**
- List of connections (accepted network requests)
- Pending invitations (sent/received)
- Search/filter by name or title
- View detailed profiles
- Send connection requests
- Accept/decline invitations
- Remove connections

**Data Models:**
```javascript
// InviteProfileData (for network items)
{
  id: UUID,
  user_id: number,
  name: string,
  username: string,
  email: string,
  title: string,
  company: string,
  proficiency: string,
  tags: [string],
  profileImage: string?
}
```

### Step 5.4: Business Profile Page (`src/pages/BusinessProfile.jsx`)

**Maps to:** `PageBusinessProfile` from iOS app

**Features:**
- Display user's business information
- Edit business profile (name, stage, industry, bio)
- Fund raising amount
- Looking for (skills/resources)
- Toggle mentor status
- Edit button for own profile

**Data Model:**
```javascript
// SharedEntrepreneurProfileData
{
  user_id: number,
  name: string,
  email: string,
  username: string,
  profileImage: string?,
  businessName: string,
  businessStage: string,
  businessIndustry: string,
  businessBio: string,
  fundingRaised: string,
  lookingFor: [string],
  isMentor: boolean
}
```

### Step 5.5: More Menu Page (`src/pages/More.jsx`)

**Maps to:** `PageMore` from iOS app

**Features:**
- Hub for accessing secondary features
- Navigation items with icons and badges
- User profile access
- Welcome message
- Links to all major sections:
  - Connect and Network
  - Your Business Profile
  - Professional Services
  - Find Entrepreneurs
  - Find Mentors
  - News & Knowledge
  - Circl Exchange (Skills)
  - Circles
  - Group Chats

**Components:**
- Large icon + title navigation items
- Profile header with user image
- Scrollable content area
- Unread message badge on appropriate items

### Step 5.6-5.9: Secondary Pages

#### Mentors Page (`src/pages/Mentors.jsx`)
- Search mentors by expertise
- Filter by industry/company
- View mentor profiles
- Send mentor requests
- Rating/review system

#### Entrepreneurs Page (`src/pages/Entrepreneurs.jsx`)
- Browse entrepreneur profiles
- Filter by business stage/industry
- View business details
- Connect with entrepreneurs

#### Circles Page (`src/pages/Circles.jsx`)
- List all available circles/communities
- Join/leave circles
- View circle members
- Access circle-specific content

#### Group Chats Page (`src/pages/GroupChats.jsx`)
- List group chats
- View messages in selected chat
- Send messages
- Manage group members

#### Settings Page (`src/pages/Settings.jsx`)
- **Account Settings:**
  - Change password
  - Email management
  - Phone number
  
- **Privacy Settings:**
  - Profile visibility
  - Who can connect
  - Message permissions
  
- **Notifications:**
  - Enable/disable notification types
  - Frequency settings
  
- **Blocked Users:**
  - List blocked users
  - Unblock functionality
  
- **Logout:**
  - Session management
  - "Sign out of all devices"

---

## Phase 6: API Integration

### Step 6.1: Create API Service Layer (`src/services/api.js`)

Configure Axios instance with base URL and interceptors:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401 (logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Step 6.2: Create Service Modules

#### authService.js
```javascript
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  register: (data) => api.post('/auth/register', data),
  refreshToken: () => api.post('/auth/refresh'),
};
```

#### forumService.js
```javascript
export const forumService = {
  getPosts: (category?, privacy?) => api.get('/forum/posts', { params: { category, privacy } }),
  createPost: (content, category, privacy, image?) => 
    api.post('/forum/posts', { content, category, privacy, image }),
  deletePost: (postId) => api.delete(`/forum/posts/${postId}`),
  likePost: (postId) => api.post(`/forum/posts/${postId}/like`),
  unlikePost: (postId) => api.delete(`/forum/posts/${postId}/like`),
  getComments: (postId) => api.get(`/forum/posts/${postId}/comments`),
  createComment: (postId, text) => api.post(`/forum/posts/${postId}/comments`, { text }),
};
```

#### networkService.js
```javascript
export const networkService = {
  getConnections: () => api.get('/network/connections'),
  getPendingInvites: () => api.get('/network/invites/pending'),
  sendInvite: (userId) => api.post('/network/invites', { user_id: userId }),
  acceptInvite: (inviteId) => api.post(`/network/invites/${inviteId}/accept`),
  rejectInvite: (inviteId) => api.post(`/network/invites/${inviteId}/reject`),
  removeConnection: (userId) => api.delete(`/network/connections/${userId}`),
};
```

#### profileService.js
```javascript
export const profileService = {
  getUserProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getPublicProfile: (userId) => api.get(`/profile/${userId}`),
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};
```

Similar services for: `mentorService.js`, `circleService.js`, `chatService.js`, `resourceService.js`

### Step 6.3: API Endpoints Reference

Based on your iOS app's API structure:

```
Authentication:
POST   /auth/login                     - User login
POST   /auth/logout                    - User logout
POST   /auth/register                  - Create new account
POST   /auth/refresh                   - Refresh JWT token

Forum:
GET    /forum/posts                    - Get forum feed (with filters)
POST   /forum/posts                    - Create new post
DELETE /forum/posts/{id}               - Delete post
POST   /forum/posts/{id}/like          - Like a post
DELETE /forum/posts/{id}/like          - Unlike a post
GET    /forum/posts/{id}/comments      - Get comments on post
POST   /forum/posts/{id}/comments      - Add comment to post

Network:
GET    /network/connections            - Get user connections
GET    /network/invites/pending        - Get pending invitations
POST   /network/invites                - Send connection invite
POST   /network/invites/{id}/accept    - Accept invite
POST   /network/invites/{id}/reject    - Reject invite
DELETE /network/connections/{id}       - Remove connection

Profile:
GET    /profile                        - Get current user profile
PUT    /profile                        - Update profile
GET    /profile/{id}                   - Get another user's profile
POST   /profile/image                  - Upload profile image

Mentors:
GET    /mentors                        - Search mentors (with filters)
GET    /mentors/{id}                   - Get mentor details
POST   /mentors/{id}/request           - Request mentor connection

Entrepreneurs:
GET    /entrepreneurs                  - Search entrepreneurs (with filters)
GET    /entrepreneurs/{id}             - Get entrepreneur details

Circles:
GET    /circles                        - Get all circles
GET    /circles/{id}                   - Get circle details
POST   /circles/{id}/join              - Join a circle
DELETE /circles/{id}/join              - Leave a circle
GET    /circles/{id}/members           - Get circle members

Chats:
GET    /chats                          - Get user chats
GET    /chats/{id}/messages            - Get chat messages
POST   /chats/{id}/messages            - Send message
```

---

## Phase 7: Routing Setup

### Step 7.1: Update App.jsx with React Router, QueryClient, and Error Boundary ✅ COMPLETE

Current `App.tsx` implementation:
```typescript
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider } from './context/NotificationContext';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

**Already Configured:**
- ✅ ErrorBoundary wrapper - Catches and prevents app crashes
- ✅ QueryClientProvider - React Query for data fetching/caching
- ✅ NotificationProvider - Toast notifications
- ✅ React Router ready for pages (Routes/Links to be added)

**Next Steps:**
1. Add React Router `<BrowserRouter>` wrapper
2. Create page components
3. Add `<Routes>` with protected route logic
4. Connect API services to React Query hooks

---

## Implementation Checklist

### Phase 1: Foundation ✅ COMPLETE
- ✅ TypeScript project setup with strict mode
- ✅ Vite dev server configured
- ✅ React Router ready for pages
- ✅ React Query (QueryClientProvider) integrated
- ✅ ErrorBoundary component created and active
- ✅ Toast Notifications (NotificationContext) setup with react-hot-toast
- ✅ Tailwind CSS + PostCSS + Autoprefixer configured
- ✅ tsconfig.json with JSX support
- ⏭️ Create `.env` file with API base URL
- ⏭️ Create color constants in `src/utils/colors.js`
- ⏭️ Test hot module reloading works (`npm run dev`)

### Phase 2: Components
- [ ] Create all base components (`Button`, `Input`, `Card`, `Avatar`)
- [ ] Create layout components (`Header`, `Sidebar`, `BottomNav`)
- [ ] Create `AdaptiveLayout` wrapper component
- [ ] Create feature-specific components (Forum, Networking)
- [ ] Test component rendering and responsive behavior

### Phase 3: State Management
- [ ] Create `AuthContext` with login/logout
- [ ] Create `UserContext` for profile data
- [ ] Create `NotificationContext` for alerts
- [ ] Create custom hooks (`useAuth`, `useResponsive`, `useFetch`)
- [ ] Test context providers in App.jsx

### Phase 4: Styling
- [ ] Verify Tailwind CSS works
- [ ] Create responsive layout with mobile-first approach
- [ ] Test breakpoint behavior (resize browser)
- [ ] Create custom CSS animations (optional)
- [ ] Add dark mode support (optional)

### Phase 5: Pages - Round 1
- [ ] Build Login page with form validation
- [ ] Build Forum page with post feed
- [ ] Build Networking page with connection list
- [ ] Build Business Profile page
- [ ] Build More menu page

### Phase 6: Pages - Round 2
- [ ] Build Mentors search page
- [ ] Build Entrepreneurs search page
- [ ] Build Circles directory page
- [ ] Build Group Chats page
- [ ] Build Settings page

### Phase 7: API Integration
- [ ] Create API service with Axios
- [ ] Implement auth interceptors
- [ ] Create service modules for each feature
- [ ] Connect Login page to auth API
- [ ] Connect Forum page to posts API
- [ ] Connect other pages to APIs
- [ ] Add error handling and loading states

### Phase 8: Testing & Polish
- [ ] Test all pages on mobile (< 768px)
- [ ] Test all pages on tablet (768px-1024px)
- [ ] Test all pages on desktop (> 1024px)
- [ ] Test authentication flow
- [ ] Test form submissions
- [ ] Test error states and edge cases
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Add loading screens and skeleton states

### Phase 9: Final Review
- [ ] Compare UI with original iOS/Mac app
- [ ] Adjust colors, spacing, typography to match
- [ ] Test on real devices/browsers
- [ ] Performance optimization
- [ ] SEO optimization (if needed)
- [ ] Accessibility audit (WCAG compliance)

---

## Development Workflow

### Starting Development Server
```bash
npm run dev
# Opens at http://localhost:5173
```

### Building for Production
```bash
npm run build
```

### Linting & Code Style
```bash
npm run lint
```

### Recommended Development Workflow
1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Make changes in VS Code
4. See hot reload instantly
5. Test on mobile view (browser dev tools)
6. Commit changes when feature is complete

---

## Key Differences from iOS to Keep in Mind

| iOS | Web |
|---|---|
| NavigationView/NavigationLink | React Router with Routes |
| @State for component state | useState hook |
| @EnvironmentObject | React Context + useContext |
| ZStack overlays | CSS z-index, position: absolute |
| .frame(width: 100, height: 100) | Tailwind `w-24 h-24` or custom CSS |
| .foregroundColor() | Tailwind `text-color-500` |
| .padding() | Tailwind `p-4`, `px-6`, `py-2` |
| AsyncImage for images | `<img>` with Tailwind responsive |
| Alert/Confirmation dialogs | Modal overlays with React state |
| KeyboardDismissModifier | Auto-hide on blur events |
| Date formatting with DateFormatter | date-fns or new Date().toLocaleDateString() |
| URLComponents for deep linking | React Router useNavigate |
| UserDefaults for persistence | localStorage API |

---

## Estimated Timeline

- **Phase 1-2 (Foundation + Components)**: 2-3 days
- **Phase 3-4 (State + Styling)**: 2 days
- **Phase 5 (Main Pages)**: 4-5 days
- **Phase 6 (Secondary Pages)**: 3 days
- **Phase 7 (API Integration)**: 4-5 days
- **Phase 8-9 (Testing + Polish)**: 3-4 days

**Total: 3-4 weeks of dedicated development**

---

## Next Steps

1. Review this plan and provide feedback
2. Share screenshots of iOS/Mac app pages for visual reference
3. Confirm backend API endpoints match documented structure
4. Discuss authentication details (JWT tokens, refresh tokens, etc.)
5. Begin Phase 1 implementation

---

**This is a living document. As we progress through implementation, we'll update it with specific learnings and adjustments.**
