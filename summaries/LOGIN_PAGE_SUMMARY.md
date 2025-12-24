# Login Page Design & Architecture Summary

## Overview
The Login page is the entry point to the Circl web application. It features a clean, modern design with a blue background, frosted glass container, and intuitive form layout. The page is fully responsive and uses React with TypeScript for type safety.

## Design Details

### Visual Hierarchy
- **Background**: Full-screen solid blue (`#004aad`) covering 100% viewport width and height
- **Logo**: 160px × 160px white circular logo with "Circl." text centered at the top
- **Tagline**: "Where Ideas Go Around" - white text below logo for brand messaging

### Color Palette
```
Primary Blue:       #004aad (background, text color in buttons)
Yellow/Gold:        #ffde59 (Join Circl button)
White:              #ffffff (logo, login button, input backgrounds in container)
Light Grey:         #d1d5db (bg-gray-300, input backgrounds)
Medium Grey:        #9ca3af (placeholder text)
Dark Grey:          #374151 (input text)
Semi-transparent:   rgba(255,255,255,0.1) (container background)
```

### Layout Structure
1. **Full-screen container** - Fixed positioning covers entire viewport
2. **Centered content area** - `max-w-2xl` constrained width for desktop, responsive on mobile
3. **Logo section** - Vertically centered in upper portion
4. **Form container** - Frosted glass card with rounded corners (`rounded-3xl`)
5. **Input fields** - Full-width, light grey background, vertical stacking
6. **Buttons** - Full-width with consistent padding and rounded corners
7. **Footer link** - "Forgot your password?" centered below form

### Typography
- **Logo text**: 44px bold
- **Tagline**: 20px bold white
- **Button text**: 18px bold
- **Input text**: 18px dark grey
- **Link text**: 16px medium white with underline

### Spacing & Dimensions
- **Logo width/height**: 160px × 160px
- **Input padding**: 16px (px-5) horizontal, 16px (py-4) vertical
- **Button padding**: 16px vertical (py-4)
- **Container padding**: 24px (p-6)
- **Form gap between inputs**: 16px (space-y-4)
- **Margin between sections**: 24px (mb-6, mt-6)

### Interactive States
- **Hover effects**: 90% opacity on buttons
- **Focus state**: 2px blue ring on inputs (`focus:ring-blue-400`)
- **Loading state**: Button text changes to "Logging in..." with disabled opacity
- **Error state**: Toast notifications with error messages

## Code Architecture

### File Structure
```
src/pages/Login.tsx                 # Main login page component
src/hooks/useAuth.ts                # Auth context consumer hook
src/context/AuthContext.tsx         # Global auth state management
src/services/authService.ts         # API integration for auth endpoints
src/utils/colors.ts                 # Brand color constants
src/index.css                       # Global styles with Tailwind
```

### Component Breakdown

#### Login.tsx (Main Component)
**State Management:**
- `email` - Input field for user email
- `password` - Input field for user password
- `isLoading` - Boolean for async operation status
- `showForgotPassword` - Boolean for modal visibility
- `forgotPasswordEmail` - Email input for password reset

**Event Handlers:**
- `handleLogin()` - Validates inputs, calls auth service, redirects on success
- `handleForgotPassword()` - Handles password reset flow
- `handleJoinCircl()` - Navigates to signup page

**JSX Structure:**
1. Full-screen blue background container (fixed positioning)
2. Logo section with circular white background
3. "Join Circl" button (yellow, full-width)
4. Form container with frosted glass effect
   - Email input (grey background)
   - Password input (grey background)
   - Login button (white background)
5. "Forgot password?" link
6. Forgot password modal (conditional rendering)

#### AuthContext.tsx
**Global State:**
- `isLoggedIn` - Authentication status
- `user` - User object (user_id, email, fullname)
- `isLoading` - Initial load state
- `login()` - Async function to authenticate
- `logout()` - Clear auth state and redirect

**Features:**
- Token-based authentication with localStorage
- Automatic session persistence
- 300ms initial load delay for consistency

#### authService.ts
**API Integration:**
- `login(email, password)` - POST request to `/api/login/`
- `logout()` - Clear local storage and redirect
- `isAuthenticated()` - Check if user has valid token
- `getCurrentUser()` - Retrieve user from storage
- Axios interceptors for automatic header injection
- 401 interceptor for auto-logout on token expiration

**Data Flow:**
```
User Input → handleLogin() → authService.login() → 
API Response → localStorage → AuthContext → Navigate to /forum
```

#### useAuth.ts
**Purpose:** Custom hook to access AuthContext with error handling

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Styling Approach

**Tailwind CSS v3**
- Utility-first CSS framework
- Responsive design with mobile-first approach
- Custom colors via `style` prop for brand colors
- Rounded corners with `rounded-xl`, `rounded-3xl`
- Spacing utilities: `px-5`, `py-4`, `mb-6`, `space-y-4`
- Focus states: `focus:outline-none`, `focus:ring-2`

**PostCSS Configuration**
- Autoprefixer for browser compatibility
- Tailwind CSS processing via PostCSS
- CSS reset in index.css for consistent baseline

### Form Validation
- **Email**: Required field, type validation via HTML5
- **Password**: Required field, type validation via HTML5
- **Custom validation**: JavaScript checks before API call
- **Error handling**: Toast notifications for user feedback

### Error Handling
- Try/catch blocks in async handlers
- Toast notifications for all error states
- Specific error messages for login failures
- Modal dismissal on success

### Security Considerations
- **Token storage**: localStorage (secure in production with httpOnly cookies)
- **Password field**: HTML5 password type with masking
- **HTTPS**: Required for production
- **CORS**: Handled by backend API configuration

## User Flows

### Successful Login
1. User enters email and password
2. Clicks "Login" button
3. Form validation passes
4. API call to `/api/login/`
5. Token received and stored
6. User redirected to `/forum`
7. Success toast notification

### Failed Login
1. User enters invalid credentials
2. API returns 401 error
3. Error toast notification shown
4. User remains on login page
5. Can retry with different credentials

### Forgot Password
1. User clicks "Forgot your password?" link
2. Modal opens with email input
3. User enters email and clicks "Submit"
4. Success notification shown
5. Modal closes
6. (Backend sends password reset email)

### Sign Up Flow
1. User clicks "Join Circl" button
2. Routed to signup page (not yet implemented)

## Dependencies

### NPM Packages
- `react` (19.2.0) - UI framework
- `react-dom` (19.2.0) - DOM rendering
- `react-router-dom` (7.11.0) - Client-side routing
- `axios` (1.13.2) - HTTP client
- `react-hot-toast` (2.6.0) - Notification system
- `@tanstack/react-query` (5.90.12) - Data fetching/caching
- `tailwindcss` (3.4.1) - CSS utility framework
- `typescript` (5.9.3) - Type safety

### Context Providers
- `ErrorBoundary` - Crash prevention wrapper
- `QueryClientProvider` - React Query initialization
- `AuthProvider` - Global auth state
- `NotificationProvider` - Toast notifications

## Performance Optimizations
- Fixed positioning prevents layout reflows
- Memoized handlers avoid unnecessary re-renders
- Conditional rendering of modal only when needed
- CSS-in-JS styles cached via React
- Input blur on background click (improved UX)

## Future Enhancements
- [ ] Implement signup page
- [ ] Add forgot password API integration
- [ ] Add "Remember me" functionality
- [ ] Social login (Google, Apple)
- [ ] Two-factor authentication
- [ ] Rate limiting on login attempts
- [ ] Password strength indicator
- [ ] Multi-language support

## Notes for Developers
- All API calls use token-based authentication
- Backend API: `https://circlapp.online/api/`
- Environment variables configured in `.env`
- TypeScript strict mode enabled for type safety
- Mobile-first responsive design approach
- Keyboard dismissal on background click for better mobile UX
