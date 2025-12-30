# Testing Profile Picture API

## Quick Start

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the test page:**
   Open your browser and go to: `http://localhost:5173/test-profile-picture`

3. **Make sure you're logged in:**
   - If not logged in, go to `/login` first
   - Log in with your credentials
   - Then navigate back to `/test-profile-picture`

## What to Test

### Test 1: Fetch Current Profile Image
1. Click the **"Fetch Current Profile"** button
2. **Check the Console** (F12 → Console tab):
   - Look for: `🔍 Fetching profile for user: [userId]`
   - Look for: `✅ Profile fetched: {...}`
   - Look for: `🖼️ Image URL: [url]`

3. **Check the Network tab** (F12 → Network tab):
   - Filter by "XHR" or "Fetch"
   - Look for request to: `GET /api/users/profile/[userId]/`
   - Click on it to see:
     - **Request Headers**: Should include `Authorization: Token [your-token]`
     - **Response**: Should contain `profile_image` field

### Test 2: Upload New Profile Picture
1. Click **"Choose Image to Upload"**
2. Select an image file (JPG, PNG, etc.)
3. **Check the Console**:
   - Look for: `📤 Uploading file: {name, size, type, userId}`
   - Look for: `✅ Upload successful: {...}`
   - Or: `❌ Upload failed: [error]`

4. **Check the Network tab**:
   - Look for request to: `POST /api/users/upload_profile_image/`
   - Click on it to see:
     - **Request Headers**: 
       - `Authorization: Token [your-token]`
       - `Content-Type: multipart/form-data`
     - **Request Payload**: Should show `user_id` and `image` file
     - **Response**: Should return the new `profile_image` path

## Expected API Responses

### Success Response (Fetch Profile):
```json
{
  "user_id": 123,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "fullname": "John Doe",
  "profile_image": "/media/profile_images/user_123_abc.jpg"
}
```

### Success Response (Upload):
```json
{
  "profile_image": "/media/profile_images/user_123_xyz.jpg"
}
```

### Error Response Examples:
```json
{
  "error": "User not found"
}
```
```json
{
  "error": "Invalid file type"
}
```

## Troubleshooting

### Issue: "No user logged in" error
- **Solution**: Go to `/login` and log in first

### Issue: 401 Unauthorized
- **Cause**: Auth token is missing or expired
- **Solution**: 
  - Check localStorage for `auth_token`
  - Log out and log back in
  - Check console for token in request headers

### Issue: 400 Bad Request
- **Possible causes**:
  - Missing `user_id` in request
  - Invalid file format
  - File too large
- **Solution**: Check the error message in response

### Issue: 404 Not Found
- **Cause**: API endpoint doesn't exist on backend
- **Solution**: 
  - Verify backend is running
  - Check API endpoint URL matches backend exactly
  - Backend should have: `POST /api/users/upload_profile_image/`

### Issue: Image doesn't display after upload
- **Check**:
  1. Is the `profile_image` path in the response?
  2. Is the URL being constructed correctly?
  3. Try opening the image URL directly in browser
  4. Check CORS settings if loading from different domain

## Monitoring Tools

### Browser DevTools (F12)
1. **Console Tab**: See all log messages
2. **Network Tab**: 
   - See all HTTP requests
   - Filter by "XHR" to see only API calls
   - Click request → Headers/Payload/Response/Preview
3. **Application Tab**: 
   - Check localStorage for `auth_token`
   - Check sessionStorage

### What to Look For
✅ **Good signs:**
- Status code: 200 OK
- Response contains expected data
- Image loads successfully
- Console shows success logs

❌ **Problem signs:**
- Status code: 4xx or 5xx
- Empty response body
- CORS errors in console
- Image fails to load

## Next Steps After Testing

Once the API works:
1. Integrate into the actual Profile page
2. Add to onboarding ProfilePicturePage
3. Add image cropping/resizing if needed
4. Add upload progress indicator
5. Handle edge cases (large files, wrong formats)

## API Endpoint Documentation

### GET /api/users/profile/:userId/
**Purpose**: Fetch user profile including profile image

**Request:**
- Method: GET
- Headers: `Authorization: Token [token]`

**Response:**
```json
{
  "user_id": number,
  "email": string,
  "first_name": string,
  "last_name": string,
  "fullname": string,
  "profile_image": string | null
}
```

### POST /api/users/upload_profile_image/
**Purpose**: Upload a new profile picture

**Request:**
- Method: POST
- Headers: 
  - `Authorization: Token [token]`
  - `Content-Type: multipart/form-data`
- Body (FormData):
  - `user_id`: string
  - `image`: File

**Response:**
```json
{
  "profile_image": string
}
```

## Code Reference

The API service is located at:
`/Users/faraibekhan/circl_webapp/src/services/userServices.ts`

Usage example:
```typescript
import { userService } from '../services/userServices';

// Fetch profile
const profile = await userService.getUserProfile(userId);

// Upload image
const result = await userService.uploadProfileImage(userId, imageFile);

// Get full image URL
const imageUrl = userService.getProfileImageUrl(profile.profile_image);
```
