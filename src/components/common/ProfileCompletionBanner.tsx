import { useState } from 'react';
import { COLORS } from '../../utils/colors';

interface ProfileCompletionBannerProps {
  completionPercentage: number;
  onCompleteClick: () => void;
  compact?: boolean;
  onDismiss?: () => void;
}

export default function ProfileCompletionBanner({ 
  completionPercentage, 
  onCompleteClick,
  compact = false,
  onDismiss
}: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show banner if profile is 100% complete or if dismissed
  if (completionPercentage >= 100 || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (compact) {
    return (
      <div className="bg-blue-50 border-l-4 rounded-lg p-3 mb-4 hover:bg-blue-100 transition-colors group" style={{ borderLeftColor: COLORS.primary }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <svg 
              className="w-4 h-4 flex-shrink-0" 
              style={{ color: COLORS.primary }} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-gray-700 text-sm font-medium truncate">
              Complete your profile <span style={{ color: COLORS.primary }} className="font-semibold">{completionPercentage}%</span>
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onCompleteClick}
              className="text-sm font-semibold px-3 py-1 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COLORS.primary }}
            >
              Update
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"
              title="Dismiss"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border-2 border-blue-100 hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Icon and text */}
        <div className="flex items-center gap-4 flex-1">
          {/* Icon */}
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: COLORS.primary + '20' }}
          >
            <svg 
              className="w-6 h-6" 
              style={{ color: COLORS.primary }} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>

          {/* Text content */}
          <div className="flex-1">
            <h3 className="text-gray-900 font-semibold text-base mb-1">
              Complete your profile to stand out
            </h3>
            <p className="text-gray-600 text-sm">
              You're <span className="font-semibold" style={{ color: COLORS.primary }}>
                {completionPercentage}% done
              </span> with your profile
            </p>
          </div>
        </div>

        {/* Right side - Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onCompleteClick}
            className="px-6 py-2.5 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.primary }}
          >
            Complete now
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Dismiss"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${completionPercentage}%`,
            backgroundColor: COLORS.primary 
          }}
        />
      </div>
    </div>
  );
}
