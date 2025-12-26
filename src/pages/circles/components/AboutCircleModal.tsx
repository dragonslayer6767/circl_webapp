import { useState, useRef } from 'react';
import { COLORS } from '../../../utils/colors';
import { Circle } from '../../../types/circle';

interface AboutCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  circle: Circle;
}

export default function AboutCircleModal({ isOpen, onClose, circle }: AboutCircleModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(circle.profile_image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to API
    setIsUploading(true);
    await uploadCircleImage(file);
    setIsUploading(false);
  };

  const uploadCircleImage = async (file: File) => {
    const formData = new FormData();
    formData.append('circle_id', circle.id.toString());
    formData.append('user_id', '1'); // TODO: Get from auth context
    formData.append('profile_image', file);

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('https://circlapp.online/api/circles/upload_circle_image/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Token ${token}`
      //   },
      //   body: formData
      // });

      console.log('Circle image uploaded:', file.name);
    } catch (error) {
      console.error('Failed to upload circle image:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div 
          className="px-6 py-4 border-b border-white/20 flex items-center justify-between"
          style={{ backgroundColor: COLORS.primary }}
        >
          <h2 className="text-2xl font-bold text-white">{circle.name}</h2>
          <button
            onClick={onClose}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Circle Image Upload Section - Moderator Only */}
          {circle.is_moderator && (
            <div className="flex flex-col items-center space-y-3">
              <div 
                className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt={circle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isUploading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-sm font-semibold underline disabled:opacity-50"
                style={{ color: COLORS.primary }}
              >
                {isUploading ? 'Uploading...' : 'Upload Circle Photo'}
              </button>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">About This Circle</h3>
            <p className="text-gray-700 leading-relaxed">{circle.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-500">Industry</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{circle.industry || 'N/A'}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-sm font-medium text-gray-500">Members</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{circle.member_count}</p>
            </div>

            {circle.pricing && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500">Pricing</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{circle.pricing}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-500">Privacy</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{circle.is_private ? 'Private' : 'Public'}</p>
            </div>

            {circle.join_type && (
              <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500">Join Method</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{circle.join_type}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}