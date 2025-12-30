# ⚡ CIRCL WEB APP - QUICK REFERENCE CARD

**Last Updated:** December 29, 2025

---

## 🚀 START HERE

### Current Status
- ✅ Phase 1 (MVP Core) - COMPLETE
- 🔄 Phase 2 (Social Features) - IN PROGRESS (85% ready)
- ⏳ Phase 3+ - Planning phase

### Dev Server
```bash
npm run dev
# Runs on http://localhost:5176
```

### Quick Access
- **Main Plan:** `FAST_SHIP_PLAN.md`
- **Implementation Status:** `IMPLEMENTATION_STATUS.md`
- **Next Steps:** `NEXT_STEPS_GUIDE.md`
- **Phase Guides:** `PHASE_2_X_*.md`

---

## 📋 PHASE 2 IMPLEMENTATION ORDER

### 2.1 Post Creation (2-3 hours) 🔴 NEXT
**Status:** API integrated, need Forum integration
**Files:** `src/pages/Forum.tsx`, `src/components/forum/PostComposer.tsx`

```typescript
// In Forum.tsx, replace inline form with:
<PostComposer onPostCreate={handlePostCreated} />
```

**Guide:** `PHASE_2_1_POST_CREATION_COMPLETION.md`

---

### 2.2 Likes & Comments (8-10 hours) 🟡 AFTER 2.1
**Status:** Service endpoints ready, components needed
**Create:** `CommentSection.tsx`, `CommentItem.tsx`
**Update:** `ForumPost.tsx` (add like button)

**Guide:** `PHASE_2_2_LIKES_COMMENTS.md`

---

### 2.3 Profile Viewing (6-8 hours) 🟡 AFTER 2.2
**Status:** Starting from scratch
**Create:** `profileService.ts`, `ProfileView.tsx`
**Update:** `Profile.tsx`, `App.tsx` (add routes)

**Guide:** `PHASE_2_3_PROFILE_VIEWING.md`

---

### 2.4 Profile Editing (6-8 hours) 🟡 AFTER 2.3
**Status:** Starting from scratch
**Create:** `ProfileEdit.tsx` with form
**Update:** `profileService.ts` (update methods)

**Guide:** `PHASE_2_4_PROFILE_EDITING.md`

---

## 🔑 KEY FILES

### Services
```
src/services/
├── authService.ts         ← Auth & token management
├── forumService.ts        ← Forum posts, likes, comments
├── userServices.ts        ← User profile & image upload
├── circleServices.ts      ← Circles (Phase 1)
└── profileService.ts      ← To create (Phase 2.3)
```

### Pages
```
src/pages/
├── Login.tsx              ← Login page
├── Forum.tsx              ← Main forum feed
├── Profile.tsx            ← My profile
├── ProfileView.tsx        ← To create (Phase 2.3)
├── ProfileEdit.tsx        ← To create (Phase 2.4)
└── Network.tsx            ← Network connections
```

### Components
```
src/components/forum/
├── PostComposer.tsx       ← Create posts (API integrated)
├── ForumPost.tsx          ← Display posts
├── CommentsModal.tsx      ← Comments view
├── CommentSection.tsx     ← To create (Phase 2.2)
└── CommentItem.tsx        ← To create (Phase 2.2)
```

---

## ⚙️ API ENDPOINTS

### Forum Endpoints (forumService)
```typescript
// Posts
POST   /api/forum/posts              ← createPost()
GET    /api/forum/posts              ← getPosts()
GET    /api/forum/posts/{id}         ← getPost()
PUT    /api/forum/posts/{id}         ← updatePost()
DELETE /api/forum/posts/{id}         ← deletePost()

// Likes
POST   /api/forum/posts/{id}/like    ← likePost()
DELETE /api/forum/posts/{id}/like    ← unlikePost()

// Comments
GET    /api/forum/posts/{id}/comments                    ← getComments()
POST   /api/forum/posts/{id}/comments                    ← createComment()
PUT    /api/forum/posts/{id}/comments/{commentId}        ← updateComment()
DELETE /api/forum/posts/{id}/comments/{commentId}        ← deleteComment()
POST   /api/forum/posts/{id}/comments/{commentId}/like   ← likeComment()
DELETE /api/forum/posts/{id}/comments/{commentId}/like   ← unlikeComment()
```

### Profile Endpoints (profileService - to create)
```typescript
// Profile
GET    /api/profile         ← getCurrentProfile()
GET    /api/profile/{id}    ← getUserProfile()
PUT    /api/profile         ← updateProfile()

// Image
POST   /api/profile/image   ← uploadProfileImage()
```

---

## 🎯 COMMON PATTERNS

### Service Pattern
```typescript
import api from './authService';

export interface TypeName {
  id: number;
  name: string;
}

export const serviceName = {
  getData: async (): Promise<TypeName[]> => {
    const response = await api.get('/endpoint');
    return response.data;
  },
};
```

### Component Pattern
```typescript
export default function ComponentName() {
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    try {
      setIsLoading(true);
      await apiCall();
    } catch (err) {
      setError('Error message');
    } finally {
      setIsLoading(false);
    }
  };

  return <div>{/* JSX */}</div>;
}
```

### API Call Pattern
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: async () => forumService.getPosts(),
});
```

---

## 🧪 TESTING QUICK START

### Test Forum Post Creation
1. Go to `http://localhost:5176/forum`
2. Fill in PostComposer form
3. Click "Post" button
4. Check if post appears at top of feed
5. Check browser console for errors

### Test Profile (After Phase 2.3)
1. Go to `/profile/me` or click username
2. Check profile info displays
3. Check recent posts show
4. Click "Edit Profile" button (own profile only)

### Test Comments (After Phase 2.2)
1. Click comment button on post
2. Type a comment
3. Submit
4. Check comment appears
5. Click like on comment

---

## 📊 PROGRESS TRACKING

```
Week 1:
  Mon: Phase 2.1 (2-3h)    ← START HERE
  Tue: Phase 2.2 (4-5h)
  Wed: Phase 2.2 (4-5h)
  Thu: Phase 2.3 (3-4h)
  Fri: Phase 2.3 (3-4h)

Week 2:
  Mon: Phase 2.4 (2-3h)
  Tue: Phase 2.4 (3-4h)
  Wed: Testing & bug fixes
  Thu: Phase 3 start
  Fri: Phase 3 progress

Target: Ship MVP by end of Week 2
```

---

## 🆘 QUICK TROUBLESHOOTING

### PostComposer not showing
```
✓ Check import in Forum.tsx
✓ Check component path is correct
✓ Check CSS file exists
```

### Create post fails
```
✓ Check dev server is running
✓ Check browser console for error
✓ Check API_BASE_URL in .env
✓ Check auth token in localStorage
```

### TypeScript errors
```
✓ Check interface definitions
✓ Check null/undefined handling
✓ Run: npx tsc --noEmit
```

### Styling issues
```
✓ Check Tailwind CSS is imported
✓ Check color constants in utils/colors.ts
✓ Check CSS file is imported
✓ Clear browser cache
```

---

## 💾 STATE MANAGEMENT

### Where to Use What

| Use Case | Solution | Where |
|----------|----------|-------|
| Auth state | AuthContext | context/AuthContext.tsx |
| User info | useAuth() hook | hooks/useAuth.ts |
| Local form | useState | In component |
| API cache | React Query | useQuery/useMutation |
| Global theme | Context or CSS vars | utils/colors.ts |

---

## 🔗 USEFUL COMMANDS

```bash
# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Check for unused code
npm run build:prod

# View project structure
find src -type f -name "*.tsx" | head -20
```

---

## 📚 FILE REFERENCE

### Need to create a service?
→ Look at `src/services/forumService.ts` for pattern

### Need to create a component?
→ Look at `src/components/forum/ForumPost.tsx` for pattern

### Need to create a page?
→ Look at `src/pages/Forum.tsx` for pattern

### Need to add a route?
→ Edit `src/App.tsx` - search for `<Route`

### Need to use auth?
→ Use `useAuth()` hook from `src/hooks/useAuth.ts`

---

## ✅ COMPLETION CHECKLIST

### Phase 2.1 ✓
- [ ] PostComposer integrated into Forum
- [ ] Success notification shows
- [ ] Feed refreshes after post
- [ ] Test with backend API
- [ ] Error handling works

### Phase 2.2 ⏳
- [ ] Like button works
- [ ] Comment section works
- [ ] Can add comments
- [ ] Comments persist
- [ ] Like count updates

### Phase 2.3 ⏳
- [ ] profileService created
- [ ] ProfileView page works
- [ ] Can view other profiles
- [ ] Username links work
- [ ] Recent posts show

### Phase 2.4 ⏳
- [ ] ProfileEdit page works
- [ ] Can update profile
- [ ] Image upload works
- [ ] Changes persist
- [ ] Validation works

---

## 🎓 LEARNING

### React Concepts Used
- Hooks (useState, useEffect, useContext)
- Custom hooks
- Component composition
- Conditional rendering
- Event handling
- Form handling

### TypeScript Patterns
- Interfaces for types
- Union types
- Optional properties
- Function signatures
- Generic types

### API Integration
- Axios requests
- Error handling
- FormData for files
- Token management
- Optimistic updates

---

## 🚀 QUICK START

1. **Review current status**
   ```bash
   cat IMPLEMENTATION_STATUS.md
   ```

2. **Follow Phase 2.1 guide**
   ```bash
   cat PHASE_2_1_POST_CREATION_COMPLETION.md
   ```

3. **Start coding**
   - Open `src/pages/Forum.tsx`
   - Replace inline form with PostComposer
   - Test with backend API

4. **Move to next phase**
   - Read Phase 2.2 guide
   - Create new components
   - Test as you go

---

## 📞 NEED HELP?

1. Check the phase guide for that feature
2. Look at similar existing code
3. Read browser console errors carefully
4. Check TypeScript error messages
5. Review FAST_SHIP_PLAN.md for context

---

## 🎉 YOU'VE GOT THIS!

Everything is documented. All patterns are set. Just follow the guides and you'll ship Phase 2 in a week.

**Time Estimate:**
- Phase 2.1: 2-3 hours ⏰
- Phase 2.2: 8-10 hours 📅
- Phase 2.3: 6-8 hours 📅
- Phase 2.4: 6-8 hours 📅
- **Total: ~28-32 hours = 1 week** ✅

**Start with Phase 2.1. Let's go! 🚀**

---

## 📋 ALL DOCUMENTATION

| Document | Purpose | Link |
|----------|---------|------|
| FAST_SHIP_PLAN.md | Master plan for MVP | Main doc |
| IMPLEMENTATION_STATUS.md | Current progress tracking | Status |
| NEXT_STEPS_GUIDE.md | Complete roadmap | Roadmap |
| PHASE_2_1_POST_CREATION_COMPLETION.md | Post creation guide | 2.1 |
| PHASE_2_2_LIKES_COMMENTS.md | Comments & likes guide | 2.2 |
| PHASE_2_3_PROFILE_VIEWING.md | Profile viewing guide | 2.3 |
| PHASE_2_4_PROFILE_EDITING.md | Profile editing guide | 2.4 |
| QUICK_REFERENCE_CARD.md | This file | Quick ref |

---

**Last Update:** December 29, 2025  
**Status:** All Phase 2 guides ready to implement  
**Next Action:** Follow PHASE_2_1_POST_CREATION_COMPLETION.md
