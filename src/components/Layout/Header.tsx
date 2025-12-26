import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  // Calculate profile completion
  const calculateCompletionPercentage = (): number => {
    if (!user) return 0;
    
    // Calculate based on multiple profile fields
    const fields = [
      user.fullname,
      user.email,
      // These fields would come from a more complete user profile
      false, // bio
      false, // profile_image
      false, // birthday
      false, // personality_type
      false, // institution
      false, // years_of_experience
      false, // locations
      false, // skills
      false, // hobbies
    ];
    
    const completed = fields.filter(f => f).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();
  const isComplete = completionPercentage >= 100;

  // Temporary: Show indicator even when user is null for testing
  const shouldShowIndicator = true;
  const displayPercentage = user ? completionPercentage : 18; // fallback to 18% when user is null

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: COLORS.primary }}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/forum')}
        >
          <span className="text-2xl font-bold text-white hidden sm:block">
            Circl.
          </span>
        </div>

        {/* Profile Completion Indicator */}
        {shouldShowIndicator && (
          <div className="relative">
            <button
              onClick={() => setShowCompletionPopup(!showCompletionPopup)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-white text-sm font-medium hidden sm:inline">
                Your Profile is {displayPercentage}% Complete
              </span>
              <span className="text-white text-sm font-medium sm:hidden">
                {displayPercentage}%
              </span>
            </button>

            {/* Popup */}
            {showCompletionPopup && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                <button
                  onClick={() => setShowCompletionPopup(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="mb-3">
                  <h3 className="text-gray-900 font-semibold text-sm mb-1">
                    Complete your profile
                  </h3>
                  <p className="text-gray-600 text-xs">
                    You're <span className="font-semibold" style={{ color: COLORS.primary }}>{displayPercentage}%</span> done
                  </p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${displayPercentage}%`, backgroundColor: COLORS.primary }}
                  />
                </div>

                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowCompletionPopup(false);
                  }}
                  className="w-full py-2 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Complete now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
