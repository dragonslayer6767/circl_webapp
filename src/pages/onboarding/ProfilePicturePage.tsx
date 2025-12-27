import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useOnboarding } from '../../context/OnboardingContext';
import { useNotification } from '../../context/NotificationContext';

export default function ProfilePicturePage() {
  const navigate = useNavigate();
  const { data, updateData, nextStep } = useOnboarding();
  const { addNotification } = useNotification();

  const [selectedImage, setSelectedImage] = useState<string | null>(data.profilePicture);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification('Image must be less than 5MB', 'error');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      addNotification('Please select an image file', 'error');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      addNotification('Please select an image first', 'error');
      return;
    }

    setIsUploading(true);

    try {
      // TODO: Implement actual image upload to backend
      // For now, just store the base64 string locally
      updateData({ profilePicture: selectedImage });
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification('Profile picture uploaded!', 'success');
      nextStep();
      navigate('/onboarding/personal-info');
    } catch (error) {
      addNotification('Failed to upload image', 'error');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    updateData({ profilePicture: null });
    nextStep();
    navigate('/onboarding/personal-info');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-8 py-12 relative overflow-hidden"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Decorative Clouds */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ top: '10px', right: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ top: '0px', right: '40px' }}></div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-48 h-24">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ bottom: '10px', right: '10px' }}></div>
        </div>
      </div>

      <div className="absolute top-10 left-5 pointer-events-none opacity-80">
        <div className="relative w-32 h-32">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ top: '20px', left: '10px' }}></div>
          <div className="absolute w-24 h-24 bg-white rounded-full" style={{ top: '0px', left: '30px' }}></div>
        </div>
      </div>

      <div className="max-w-md w-full z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.yellow }}>
            Add Profile Picture
          </h1>
          <div className="w-48 h-0.5 bg-white mx-auto mb-6"></div>
          <p className="text-white text-lg">
            Make your profile stand out! Add a photo so others can get to know you better.
          </p>
        </div>

        {/* Profile Picture Display */}
        <div className="flex flex-col items-center mb-12">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative group"
          >
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow-xl transition-transform group-hover:scale-105">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 mb-2" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: COLORS.primary }}>
                    Tap to add photo
                  </span>
                </div>
              )}
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {isUploading && (
            <div className="mt-4 flex items-center gap-2 text-white">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </div>
          )}

          {selectedImage && !isUploading && (
            <p className="mt-4 text-white font-medium">Photo ready to upload!</p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          {/* Upload/Next Button */}
          {selectedImage ? (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full py-4 rounded-2xl text-xl font-bold shadow-lg transition-all ${
                !isUploading ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ 
                backgroundColor: isUploading ? '#888' : COLORS.yellow,
                color: COLORS.primary
              }}
            >
              {isUploading ? 'Uploading...' : 'Next'}
            </button>
          ) : null}

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="w-full py-4 rounded-2xl text-xl font-bold border-2 border-white text-white hover:bg-white hover:text-blue-800 transition-all"
          >
            Skip for Now
          </button>

          {/* Back Button */}
          <button
            onClick={() => navigate('/onboarding/signup')}
            className="w-full mt-4 py-3 text-white text-base underline hover:text-yellow-300 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
