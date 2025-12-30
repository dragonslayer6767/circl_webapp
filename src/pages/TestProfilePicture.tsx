import { useState, useRef } from 'react';
import { userService } from '../services/userServices';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../utils/colors';

export default function TestProfilePicture() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug user info on load
  const handleDebugInfo = () => {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    const userEmail = localStorage.getItem('user_email');
    
    const info = `
      LocalStorage:
      - auth_token: ${token ? '✅ Present' : '❌ Missing'}
      - user_id: ${userId || '❌ Missing'}
      - user_email: ${userEmail || '❌ Missing'}
      
      useAuth() Hook:
      - user object: ${user ? '✅ Loaded' : '❌ Not loaded'}
      - user.user_id: ${user?.user_id || '❌ Missing'}
      - user.email: ${user?.email || '❌ Missing'}
      - user.fullname: ${user?.fullname || '❌ Missing'}
    `;
    
    setDebugInfo(info);
    console.log(info);
  };

  // Test 1: Fetch user profile and display image
  const handleFetchProfile = async () => {
    if (!user?.user_id) {
      setError('No user logged in');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      console.log('🔍 Fetching profile for user:', user.user_id);
      
      const profile = await userService.getUserProfile(user.user_id);
      console.log('✅ Profile fetched:', profile);
      
      const imageUrl = userService.getProfileImageUrl(profile.profile_image);
      console.log('🖼️ Image URL:', imageUrl);
      
      setCurrentImage(imageUrl);
      setSuccess(`Profile fetched successfully! Image: ${profile.profile_image || 'No image'}`);
    } catch (err: any) {
      console.error('❌ Fetch failed:', err);
      setError(`Fetch failed: ${err.response?.data?.message || err.message}`);
    }
  };

  // Test 2: Upload a new profile picture
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.user_id) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('📤 Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        userId: user.user_id
      });

      const result = await userService.uploadProfileImage(user.user_id, file);
      console.log('✅ Upload successful:', result);

      const imageUrl = userService.getProfileImageUrl(result.profile_image);
      setCurrentImage(imageUrl);
      setSuccess(`Upload successful! New image: ${result.profile_image}`);
      
      // Re-fetch profile to confirm
      setTimeout(handleFetchProfile, 1000);
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });
      setError(`Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Profile Picture API Test
        </h1>

        {/* User Info */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Current User</h2>
          <div className="space-y-2">
            <p><strong>User ID:</strong> {user?.user_id || 'Not logged in'}</p>
            <p><strong>Name:</strong> {user?.fullname || 'N/A'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          </div>
        </div>

        {/* Debug Section */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-yellow-900">🔧 Debug Info</h2>
          <button
            onClick={handleDebugInfo}
            className="px-6 py-3 rounded-xl font-semibold text-white mb-4"
            style={{ backgroundColor: '#FF8C42' }}
          >
            Check Auth Status
          </button>
          {debugInfo && (
            <pre className="bg-white p-4 rounded-lg text-sm overflow-auto text-gray-800">
              {debugInfo}
            </pre>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 font-medium">❌ Error: {error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-700 font-medium">✅ {success}</p>
          </div>
        )}

        {/* Test 1: Fetch Profile */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Test 1: Fetch Profile Image</h2>
          <button
            onClick={handleFetchProfile}
            disabled={!user?.user_id}
            className="px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: COLORS.primary }}
          >
            Fetch Current Profile
          </button>

          {currentImage && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Current Profile Image:</p>
              <img
                src={currentImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                onError={(e) => {
                  console.error('❌ Image failed to load:', currentImage);
                  e.currentTarget.src = '';
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs text-gray-500 mt-2 break-all">{currentImage}</p>
            </div>
          )}
        </div>

        {/* Test 2: Upload Image */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Test 2: Upload Profile Image</h2>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !user?.user_id}
            className="px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: COLORS.secondary }}
          >
            {uploading ? 'Uploading...' : 'Choose Image to Upload'}
          </button>

          <p className="text-sm text-gray-600 mt-4">
            Select an image file to test the upload API. The image will be uploaded to the backend.
          </p>
        </div>

        {/* Console Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3 text-blue-900">📝 How to Monitor API Calls</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Open browser DevTools (F12 or Right-click → Inspect)</li>
            <li>Go to the <strong>Console</strong> tab to see logs</li>
            <li>Go to the <strong>Network</strong> tab to see API requests</li>
            <li>Filter by "XHR" or "Fetch" to see only API calls</li>
            <li>Click on a request to see Headers, Payload, and Response</li>
          </ol>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="font-bold mb-2">Expected API Calls:</p>
            <ul className="space-y-1 text-sm">
              <li>• <code className="bg-blue-100 px-2 py-1 rounded">GET /api/users/profile/{'{userId}'}/</code></li>
              <li>• <code className="bg-blue-100 px-2 py-1 rounded">POST /api/users/upload_profile_image/</code></li>
            </ul>
          </div>
        </div>

        {/* API Endpoint Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-bold mb-3 text-gray-900">🔗 API Endpoints</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-mono text-xs text-gray-600">GET /api/users/profile/:userId/</p>
              <p className="text-gray-700 mt-1">Fetches user profile including profile_image field</p>
            </div>
            <div>
              <p className="font-mono text-xs text-gray-600">POST /api/users/upload_profile_image/</p>
              <p className="text-gray-700 mt-1">Uploads profile image (multipart/form-data)</p>
              <p className="text-gray-600 text-xs mt-1">Payload: user_id (string), image (file)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
