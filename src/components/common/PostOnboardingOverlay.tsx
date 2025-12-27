import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';

interface PostOnboardingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostOnboardingOverlay({ isOpen, onClose }: PostOnboardingOverlayProps) {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    if (isOpen && !backgroundImage) {
      // Randomly select one of the loading screen images
      const loadingScreens = [
        'loadingscreen1.png',
        'loadingscreen2.png',
        'loadingscreen3.png',
        'loadingscreen4.png',
        'loadingscreen5.png',
        'loadingscreen6.png',
      ];
      const randomScreen = loadingScreens[Math.floor(Math.random() * loadingScreens.length)];
      setBackgroundImage(randomScreen);
    }
  }, [isOpen, backgroundImage]);

  useEffect(() => {
    if (isOpen) {
      // Small delay for content animation
      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const handleCreateCircle = () => {
    onClose();
    navigate('/circles');
  };

  const handleInviteFriends = () => {
    onClose();
    // TODO: Implement invite friends flow
    navigate('/settings');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Background Image - Full Screen */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/loading-screens/${backgroundImage})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Content Container */}
      <div className="relative h-full overflow-y-auto flex items-center justify-center p-4">
        <div
          className={`
            bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl mx-auto max-w-2xl w-full p-8 md:p-12 space-y-8
            transform transition-all duration-500 shadow-2xl
            ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
        >
          {/* Celebration Icon */}
          <div className="flex justify-center">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.primary}20` }}
            >
              <svg 
                className="w-12 h-12" 
                style={{ color: COLORS.primary }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>

          {/* Congratulations Message */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              🎉 Welcome to Circl!
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              You're all set to start building your future
            </p>
          </div>

          {/* Feature Highlight */}
          <div 
            className="p-6 rounded-2xl space-y-3"
            style={{ backgroundColor: `${COLORS.primary}10` }}
          >
            <h3 
              className="text-xl font-bold"
              style={{ color: COLORS.primary }}
            >
              Run Your Business Through Circles
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Create a Circle to manage your business operations, track KPIs, collaborate with your team, and centralize all your communication in one powerful platform.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">Task Management</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">Team Collaboration</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">KPI Tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">Event Calendar</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCreateCircle}
              className="w-full py-4 rounded-full font-bold text-white text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: COLORS.primary }}
            >
              Create Your Circle
            </button>
            
            <button
              onClick={handleInviteFriends}
              className="w-full py-4 rounded-full font-bold text-gray-700 text-lg border-2 transition-all transform hover:scale-105 active:scale-95"
              style={{ borderColor: COLORS.primary }}
            >
              Invite Friends
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
