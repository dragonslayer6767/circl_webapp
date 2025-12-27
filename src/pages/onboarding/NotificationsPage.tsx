import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useOnboarding } from '../../context/OnboardingContext';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { data, updateData, nextStep } = useOnboarding();
  const [notificationsEnabled, setNotificationsEnabled] = useState(data?.notificationsEnabled || false);

  const handleContinue = () => {
    updateData({ notificationsEnabled });
    
    // Request browser notification permission if enabled
    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
    
    nextStep();
    navigate('/onboarding/complete');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-8 py-12 relative overflow-hidden"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="h-2 bg-white/20">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: '83.33%',
              backgroundColor: COLORS.yellow 
            }}
          />
        </div>
        <div className="text-center py-2">
          <span className="text-white text-sm font-medium">Step 5 of 6</span>
        </div>
      </div>

      {/* Decorative Clouds */}
      <div className="absolute top-0 left-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ top: '10px', left: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ top: '0px', left: '40px' }}></div>
          <div className="absolute w-28 h-28 bg-white rounded-full" style={{ top: '20px', left: '100px' }}></div>
        </div>
      </div>

      {/* Bottom Left Cloud */}
      <div className="absolute bottom-0 left-0 pointer-events-none opacity-80">
        <div className="relative w-48 h-24">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ bottom: '10px', left: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ bottom: '0px', left: '40px' }}></div>
        </div>
      </div>

      {/* Middle Right Cloud */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-80">
        <div className="relative w-32 h-32">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ top: '20px', right: '10px' }}></div>
          <div className="absolute w-24 h-24 bg-white rounded-full" style={{ top: '40px', right: '30px' }}></div>
        </div>
      </div>

      <div className="max-w-2xl w-full z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.yellow }}>
            Notifications
          </h1>
          <div className="w-48 h-0.5 bg-white mx-auto"></div>
        </div>

        {/* Body Text */}
        <p className="text-white text-center text-xl md:text-2xl font-bold mb-12 px-4">
          Turn on your notifications so we can give you new information, exclusive deals, and more!
        </p>

        {/* Toggle Section */}
        <div className="flex flex-col items-center gap-6 mb-16">
          <p className="text-white text-xl md:text-2xl font-bold">
            Mobile App Notifications
          </p>

          {/* Custom Toggle */}
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative w-20 h-10 rounded-full transition-colors duration-300 ${
              notificationsEnabled ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-300 ${
                notificationsEnabled ? 'translate-x-10' : 'translate-x-1'
              }`}
            ></div>
          </button>

          <p className="text-white text-lg">
            {notificationsEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full max-w-md mx-auto block py-4 rounded-2xl text-xl font-bold shadow-lg transition-transform hover:scale-105"
          style={{ 
            backgroundColor: COLORS.yellow,
            color: COLORS.primary
          }}
        >
          Continue
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate('/onboarding/personal-info')}
          className="w-full mt-6 py-3 text-white text-base underline hover:text-yellow-300 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
