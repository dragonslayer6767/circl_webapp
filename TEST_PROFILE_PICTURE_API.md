# Testing Profile Picture API

## Quick Testing Checklist

### 1. **Frontend Test (Browser)**
- [ ] Navigate to `/test-profile-picture`
- [ ] Upload a test image
- [ ] Check DevTools Network tab for request
- [ ] Verify response includes `profile_image` field

### 2. **Verify API Endpoint**
Test with curl (replace with your actual user ID and token):

```bash
# Get your auth token from localStorage in browser console
TOKEN="your_auth_token_here"
USER_ID=49

# Create a test image file
echo "fake image data" > test_image.jpg

# Upload it
curl -X POST "https://circlapp.online/api/users/upload_profile_image/" \
  -H "Authorization: Token $TOKEN" \
  -F "user_id=$USER_ID" \
  -F "image=@test_image.jpg"
```

### 3. **Expected Responses**

**Success (200/201):**
```json
{
  "profile_image": "/media/profile_images/user_49_abc123.jpg"
}
```

**Bad Request (400):**
```json
{
  "error": "No image file provided"
}
```

**Unauthorized (401):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 4. **Common Issues & Fixes**

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token expired - login again |
| 400 Bad Request | Check: user_id and image fields in FormData |
| 500 Server Error | Contact backend team - API issue |
| CORS Error | Check axios config in `authService.ts` |

### 5. **Verify in Database**

Once uploaded, check if the image appears in user profile:
```bash
# Get updated profile
curl "https://circlapp.online/api/users/profile/49/" \
  -H "Authorization: Token $TOKEN"
```

Should return:
```json
{
  "user_id": 49,
  "profile_image": "/media/profile_images/user_49_abc123.jpg",
  ...
}
```

## Code Review Checklist

- [x] `uploadProfileImage` function exists in `userServices.ts`
- [x] Endpoint is `/api/users/upload_profile_image/`
- [x] FormData includes `user_id` and `image` fields
- [x] Content-Type is `multipart/form-data`
- [x] Auth token is auto-added by axios interceptor
- [x] `getProfileImageUrl` handles both relative and absolute URLs
