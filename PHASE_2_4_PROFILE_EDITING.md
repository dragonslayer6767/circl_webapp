# PHASE 2.4: PROFILE EDITING IMPLEMENTATION GUIDE

**Target:** Allow users to edit their profile information and upload profile picture  
**Estimated Time:** 6-8 hours  
**Status:** 0% Complete - Starting from scratch

---

## 📋 OVERVIEW

This phase adds profile editing capabilities:
- ✏️ Edit profile information
- 🖼️ Upload profile picture
- 💾 Save changes
- ✔️ Form validation
- 📸 Image preview

---

## 🎯 IMPLEMENTATION PLAN

### 2.4.1: Create ProfileEdit Page (4 hours)

**File:** `src/pages/ProfileEdit.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { profileService, UserProfile } from '../services/profileService';
import MainLayout from '../components/Layout/MainLayout';
import { COLORS } from '../utils/colors';

interface FormData {
  fullname: string;
  title: string;
  company: string;
  bio: string;
  tags: string[];
}

export default function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    fullname: user?.fullname || '',
    title: '',
    company: '',
    bio: '',
    tags: [],
  });
  
  const [profileImage, setProfileImage] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load current profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.user_id) return;
      
      try {
        const profile = await profileService.getCurrentProfile();
        setFormData({
          fullname: profile.fullname,
          title: profile.title || '',
          company: profile.company || '',
          bio: profile.bio || '',
          tags: profile.tags || [],
        });
        
        if (profile.profile_image) {
          const imageUrl = profileService.getProfileImageUrl(profile.profile_image);
          setImagePreview(imageUrl);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load current profile');
      }
    };

    loadProfile();
  }, [user?.user_id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim();
      
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        input.value = '';
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullname.trim()) {
      setError('Name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update profile data
      await profileService.updateProfile({
        fullname: formData.fullname,
        title: formData.title,
        company: formData.company,
        bio: formData.bio,
        tags: formData.tags,
      });

      // Upload image if selected
      if (profileImage && user?.user_id) {
        await profileService.uploadProfileImage(user.user_id, profileImage);
      }

      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/profile/${user?.user_id}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your profile information</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            ✓ Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-lg p-6">
          {/* Profile Picture Section */}
          <div>
            <label className="block text-sm font-semibold mb-4">Profile Picture</label>
            
            <div className="flex flex-col items-center gap-4">
              {/* Preview */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4" style={{ borderColor: COLORS.primary }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {formData.fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('image-input')?.click()}
                  className="px-6 py-2 rounded-lg font-semibold text-white transition"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  📸 Choose Photo
                </button>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImage(undefined);
                      setImagePreview(undefined);
                    }}
                    className="px-6 py-2 rounded-lg font-semibold border-2 hover:bg-gray-100 transition"
                    style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <p className="text-xs text-gray-500 text-center">
                JPG, PNG or GIF (Max 5MB)
              </p>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold mb-2">
              Professional Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Product Manager, Founder, Designer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              What's your professional role?
            </p>
          </div>

          {/* Company Field */}
          <div>
            <label htmlFor="company" className="block text-sm font-semibold mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Your company"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Bio Field */}
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell others about yourself..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/200 characters
            </p>
          </div>

          {/* Tags Field */}
          <div>
            <label htmlFor="tags-input" className="block text-sm font-semibold mb-2">
              Skills & Interests
            </label>
            <input
              type="text"
              id="tags-input"
              placeholder="Type and press Enter to add"
              onKeyDown={handleAddTag}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              disabled={isLoading}
            />
            
            {/* Tag Pills */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <div
                    key={tag}
                    className="px-3 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-white hover:opacity-80"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/profile/${user?.user_id}`)}
              className="px-6 py-3 rounded-lg font-semibold border-2 hover:bg-gray-100 transition flex-1"
              style={{ borderColor: COLORS.primary, color: COLORS.primary }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold text-white transition flex-1"
              style={{ backgroundColor: COLORS.primary }}
              disabled={isLoading}
            >
              {isLoading ? '💾 Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
```

### 2.4.2: Integrate API Calls (2 hours)

The profileService already has the necessary methods:

```typescript
// Update profile
await profileService.updateProfile({
  fullname: string,
  title: string,
  company: string,
  bio: string,
  tags: string[],
});

// Upload image
await profileService.uploadProfileImage(userId, imageFile);
```

Already implemented in the ProfileEdit component above.

### 2.4.3: Image Upload Handler (1 hour)

Image handling is already included in:
- File validation (size, type)
- Preview generation
- File upload to backend
- Error handling

---

## 🗂️ FILES TO CREATE/MODIFY

### New Files
```
src/pages/ProfileEdit.tsx ⏳ New
```

### Modified Files
```
src/services/profileService.ts - Should already have update methods
src/pages/ProfileView.tsx - Add link to edit button (Phase 2.3)
src/App.tsx - Add /profile/edit route
```

---

## 🔗 API ENDPOINTS REFERENCE

```typescript
// Update profile
PUT /api/profile
Request: {
  fullname: string,
  title?: string,
  company?: string,
  bio?: string,
  tags?: string[]
}
Response: UserProfile

// Upload profile image
POST /api/profile/image
Request: FormData with image file
Response: { profile_image: string }
```

---

## 📝 FORM FIELDS

| Field | Type | Required | Max Length | Validation |
|-------|------|----------|-----------|------------|
| Full Name | Text | ✓ | 100 | Non-empty |
| Title | Text | | 50 | Optional |
| Company | Text | | 50 | Optional |
| Bio | Textarea | | 200 | Optional |
| Tags | Array | | 5-20 chars each | Press Enter |
| Image | File | | 5MB | JPG, PNG, GIF |

---

## 🎨 UI/UX DESIGN

### Form Layout
- Profile picture section at top
  - Image preview (round)
  - Upload button
  - Remove button
  - File size info
- Form fields below
  - Name (required, clear indicator)
  - Title (optional)
  - Company (optional)
  - Bio (textarea with counter)
  - Tags (with add/remove)
- Save/Cancel buttons at bottom

### Visual States
- **Default:** Grayed out, enabled
- **Hover:** Slightly darker, enabled
- **Loading:** Button shows spinner/text, inputs disabled
- **Success:** Green checkmark, auto-redirect
- **Error:** Red banner at top

---

## 🧪 TESTING CHECKLIST

### Form Submission
- [ ] Can update name
- [ ] Can update title
- [ ] Can update company
- [ ] Can update bio
- [ ] Can add tags
- [ ] Can remove tags
- [ ] Bio character counter works
- [ ] Save button is disabled when loading

### Image Upload
- [ ] Can select image
- [ ] Preview shows before upload
- [ ] Can remove selected image
- [ ] File size validation works
- [ ] File type validation works
- [ ] Image uploads to backend
- [ ] Image displays on profile after save

### Validation
- [ ] Name is required
- [ ] Cannot submit with empty name
- [ ] File size limit enforced (5MB)
- [ ] File type validation (image only)
- [ ] Multiple tags can be added
- [ ] Tags are unique

### Navigation & Flow
- [ ] Can navigate to edit from profile
- [ ] Cancel returns to profile
- [ ] After save, redirects to profile
- [ ] Changes persist on reload
- [ ] Can edit again after save

### Error Handling
- [ ] Network error shows message
- [ ] Validation error shows message
- [ ] File upload error shows message
- [ ] Error doesn't crash page
- [ ] Can retry after error

---

## 🚀 IMPLEMENTATION ORDER

1. **Hours 1-2:** Create ProfileEdit component
2. **Hour 3:** Add routing in App.tsx
3. **Hour 4:** Test form submission
4. **Hour 5:** Test image upload
5. **Hour 6:** Test validation
6. **Hour 7-8:** Polish and refinement

---

## 📋 ROUTING SETUP

Add to App.tsx:

```tsx
<Route
  path="/profile/edit"
  element={
    <ProtectedRoute>
      <MainLayout>
        <ProfileEdit />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

Also update ProfileView to link to edit:

```tsx
{isOwnProfile && (
  <button
    onClick={() => navigate('/profile/edit')}
    className="..."
  >
    Edit Profile
  </button>
)}
```

---

## 🆘 COMMON ISSUES

### Changes not saving
- Check network tab for failed requests
- Check API endpoint is correct
- Check auth token is being sent
- Check backend validation

### Image not uploading
- Check file size (<5MB)
- Check file format (JPG, PNG, GIF)
- Check FormData is correct
- Check backend image handler

### Form not validating
- Check required field validation
- Check input value bindings
- Check onChange handlers
- Check form submit handler

### Redirect not working
- Check navigate is imported
- Check route exists
- Check user ID is available
- Check setTimeout delay

---

## ✅ COMPLETION CRITERIA

Phase 2.4 is complete when:
1. ProfileEdit page displays all fields
2. Can update all profile fields
3. Can upload profile image
4. Image preview works
5. Tags can be added/removed
6. Form validation works
7. Success notification shows
8. Redirects to profile after save
9. Changes persist on reload
10. Error handling works
11. Responsive design works
12. All tests pass

---

## 📋 AFTER PHASE 2.4

All Phase 2 (Social Features) will be complete:
- ✅ 2.1 Post Creation
- ✅ 2.2 Likes & Comments
- ✅ 2.3 Profile Viewing
- ✅ 2.4 Profile Editing

Next: **Phase 3: Networking** (Browse professionals, connect)

---

**Start implementing ProfileEdit page**
