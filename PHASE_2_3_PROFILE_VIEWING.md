# PHASE 2.3: PROFILE VIEWING IMPLEMENTATION GUIDE

**Target:** Allow users to view profiles and navigate between them  
**Estimated Time:** 6-8 hours  
**Status:** 0% Complete - Starting from scratch

---

## 📋 OVERVIEW

This phase adds user profile pages:
- 👤 View other users' profiles
- 🔗 Click username to visit profile
- 📊 Show user's recent posts
- 🤝 Connection button
- 💬 Message button

---

## 🎯 IMPLEMENTATION PLAN

### 2.3.1: Create Profile Service (1 hour)

**File:** `src/services/profileService.ts`

```typescript
import api from './authService';

export interface UserProfile {
  user_id: number;
  fullname: string;
  username?: string;
  email: string;
  title?: string;
  company?: string;
  bio?: string;
  profile_image?: string;
  tags: string[];
  created_at?: string;
  is_mentor?: boolean;
}

export const profileService = {
  // Get current user's profile
  getCurrentProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/api/profile');
    return response.data;
  },

  // Get user profile by ID
  getUserProfile: async (userId: number): Promise<UserProfile> => {
    const response = await api.get(`/api/profile/${userId}`);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/api/profile', data);
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (userId: number, imageFile: File): Promise<{ profile_image: string }> => {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('image', imageFile);

    const response = await api.post('/api/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get profile image URL
  getProfileImageUrl: (profileImage: string | undefined): string | undefined => {
    if (!profileImage) return undefined;

    if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
      return profileImage;
    }

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://circlapp.online';
    return `${baseURL}${profileImage}`;
  },
};
```

### 2.3.2: Create ProfileView Page (4 hours)

**File:** `src/pages/ProfileView.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { profileService, UserProfile } from '../services/profileService';
import { forumService } from '../services/forumService';
import ForumPost from '../components/forum/ForumPost';
import MainLayout from '../components/Layout/MainLayout';
import { COLORS } from '../utils/colors';
import { ForumPost as ForumPostType } from '../types/forum';

export default function ProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const numericUserId = userId ? parseInt(userId) : null;
  const isOwnProfile = numericUserId === currentUser?.user_id;

  useEffect(() => {
    if (!numericUserId) {
      setError('Invalid user ID');
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await profileService.getUserProfile(numericUserId);
        setProfile(profileData);

        // Load user's recent posts
        const postsData = await forumService.getPosts();
        const userPosts = postsData.filter(p => p.user_id === numericUserId).slice(0, 10);
        setPosts(userPosts);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [numericUserId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading profile...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-xl text-red-600 mb-4">{error || 'Profile not found'}</div>
          <button
            onClick={() => navigate('/forum')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Forum
          </button>
        </div>
      </MainLayout>
    );
  }

  const profileImageUrl = profileService.getProfileImageUrl(profile.profile_image);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          {/* Cover Photo Placeholder */}
          <div
            className="h-32 bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(135deg, ${COLORS.primary} 0%, #667eea 100%)`,
            }}
          />

          {/* Profile Info */}
          <div className="px-4 pb-4">
            {/* Avatar */}
            <div className="flex items-end gap-4 -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={profile.fullname} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {profile.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="flex gap-2 mb-2">
                  <button
                    className="px-6 py-2 rounded-full font-semibold text-white transition"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                  <button className="px-6 py-2 rounded-full font-semibold border-2 transition hover:bg-gray-100">
                    Message
                  </button>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div>
              <h1 className="text-2xl font-bold">{profile.fullname}</h1>
              {profile.title && <p className="text-gray-600">{profile.title}</p>}
              {profile.company && <p className="text-gray-600">{profile.company}</p>}
              {profile.bio && <p className="text-gray-700 mt-2">{profile.bio}</p>}

              {/* Tags */}
              {profile.tags && profile.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Edit Profile Button */}
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="mt-4 px-6 py-2 rounded-lg font-semibold border-2"
                  style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User's Posts */}
        <div className="mt-6">
          <h2 className="text-xl font-bold px-4 mb-4">Recent Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No posts yet</p>
            </div>
          ) : (
            <div>
              {posts.map(post => (
                <ForumPost
                  key={post.id}
                  post={post}
                  isCurrentUser={post.user_id === currentUser?.user_id}
                  onComment={() => {}}
                  onLike={() => {}}
                  onDelete={() => {}}
                  onProfileClick={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
```

### 2.3.3: Make Usernames Clickable (1 hour)

**File:** `src/components/forum/ForumPost.tsx`

Update the username/user section to be clickable:

```tsx
// Before
<span className="font-semibold">{post.user}</span>

// After
<button
  onClick={() => onProfileClick(post.user_id)}
  className="font-semibold text-blue-600 hover:underline"
>
  {post.user}
</button>
```

Then in Forum.tsx:
```typescript
const handleProfileClick = (userId: number) => {
  navigate(`/profile/${userId}`);
};
```

### 2.3.4: Create My Profile Page (2 hours)

**File:** `src/pages/Profile.tsx` (Update existing)

Modify to use ProfileView for current user:

```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileView from './ProfileView';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Render ProfileView for current user
  // This will use the user's ID
  return <ProfileView />;
}
```

Or create separate `/profile/me` route in App.tsx:
```tsx
<Route
  path="/profile/me"
  element={
    <MainLayout>
      <ProfileView userId={user?.user_id.toString()} />
    </MainLayout>
  }
/>
```

---

## 🗂️ FILES TO CREATE/MODIFY

### New Files
```
src/services/profileService.ts ⏳ New
src/pages/ProfileView.tsx ⏳ New
```

### Modified Files
```
src/pages/Profile.tsx - Update to use ProfileView
src/components/forum/ForumPost.tsx - Make username clickable
src/pages/Forum.tsx - Add navigation handler
src/App.tsx - Add /profile/:userId route
```

---

## 🔗 API ENDPOINTS REFERENCE

```typescript
// Get current user profile
GET /api/profile
Response: UserProfile

// Get specific user profile
GET /api/profile/{userId}
Response: UserProfile

// Update profile (Phase 2.4)
PUT /api/profile
Request: { name, title, company, bio, tags }
Response: UserProfile

// Upload profile image (Phase 2.4)
POST /api/profile/image
Request: FormData with image file
Response: { profile_image: string }
```

---

## 📊 DATA TYPES

```typescript
interface UserProfile {
  user_id: number;
  fullname: string;
  username?: string;
  email: string;
  title?: string;
  company?: string;
  bio?: string;
  profile_image?: string;
  tags: string[];
  created_at?: string;
  is_mentor?: boolean;
}
```

---

## 🎨 UI/UX DESIGN

### Profile Header Section
- Cover photo (gradient background)
- Large avatar image
- User name (h1)
- Title/Company (secondary text)
- Bio text
- Tags as pills
- Connect/Message buttons (if not own profile)
- Edit button (if own profile)

### Recent Posts Section
- "Recent Posts" heading
- List of user's posts
- "No posts yet" state
- Link to view all posts

---

## 🧪 TESTING CHECKLIST

### Profile Loading
- [ ] Can load own profile
- [ ] Can load other user's profile
- [ ] Invalid user ID shows error
- [ ] Loading state shows spinner
- [ ] Profile image displays correctly

### Profile Display
- [ ] User name shows
- [ ] Title/company shows if available
- [ ] Bio shows if available
- [ ] Tags display as pills
- [ ] Avatar displays or shows initials

### Navigation
- [ ] Click username in post → goes to profile
- [ ] Click connect button → shows connected state
- [ ] Click message button → opens chat (Phase 3)
- [ ] Click edit button → goes to edit page (Phase 2.4)
- [ ] Back button navigates back

### User's Posts
- [ ] Recent posts load
- [ ] No posts state shows message
- [ ] Can like/comment on posts
- [ ] Click post user → navigates to their profile

---

## 🚀 IMPLEMENTATION ORDER

1. **Hour 1:** Create profileService
2. **Hour 2-4:** Create ProfileView page
3. **Hour 5:** Make usernames clickable
4. **Hour 6:** Update profile page
5. **Hour 7-8:** Testing and refinement

---

## 📝 ROUTING SETUP

Add to App.tsx:

```tsx
<Route
  path="/profile/:userId"
  element={
    <MainLayout>
      <ProfileView />
    </MainLayout>
  }
/>

// Also update existing /profile route
<Route
  path="/profile"
  element={
    <MainLayout>
      <Profile />
    </MainLayout>
  }
/>
```

---

## 🆘 COMMON ISSUES

### Profile not loading
- Check userId param is valid number
- Check API endpoint exists
- Check auth token is sent

### Username click not working
- Check onProfileClick is passed to ForumPost
- Check navigate is imported
- Check route exists

### Image not showing
- Check profile_image URL format
- Check image is publicly accessible
- Use getProfileImageUrl() to resolve URL

### Performance
- Lazy load user's posts
- Paginate comments if many
- Cache profile data

---

## ✅ COMPLETION CRITERIA

Phase 2.3 is complete when:
1. profileService is created with all endpoints
2. ProfileView page displays all profile info
3. Can click username to visit profile
4. My Profile page works
5. User's recent posts load
6. Connect/Message buttons appear
7. Edit button appears on own profile
8. All navigation works
9. Error handling works
10. Responsive design works

---

## 📋 NEXT PHASE

Once Phase 2.3 is complete, proceed with:
**Phase 2.4: Profile Editing** (6-8 hours)

---

**Start with profileService creation**
