import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useOnboarding } from '../../context/OnboardingContext';

export default function CompletionPage() {
  const navigate = useNavigate();
  const { resetOnboarding } = useOnboarding();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);

    // Mark onboarding as complete
    localStorage.setItem('just_completed_onboarding', 'true');
    localStorage.setItem('onboarding_completed', 'true');

    // Auto-hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    // Clear onboarding context
    resetOnboarding();
    
    // Navigate to forum (main app)
    navigate('/forum');
  };

  const handleShareInvite = () => {
    const shareText = "I want to see you win this year. Join Circl with me.";
    const shareUrl = "https://circlapp.online";
    
    if (navigator.share) {
      navigator.share({
        title: "Join Circl with me!",
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-8 py-12 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(to bottom, ${COLORS.primary}, #0066cc)`
      }}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#ffde59', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Decorative Clouds - Top Left */}
      <div className="absolute top-0 left-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ top: '10px', left: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ top: '0px', left: '40px' }}></div>
          <div className="absolute w-28 h-28 bg-white rounded-full" style={{ top: '20px', left: '100px' }}></div>
        </div>
      </div>

      {/* Bottom Right Cloud */}
      <div className="absolute bottom-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ bottom: '10px', right: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ bottom: '0px', right: '40px' }}></div>
          <div className="absolute w-28 h-28 bg-white rounded-full" style={{ bottom: '20px', right: '80px' }}></div>
        </div>
      </div>

      <div className="max-w-2xl w-full z-10 flex flex-col items-center">
        {/* Logo */}
        <div 
          className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-white flex items-center justify-center mb-10 shadow-xl animate-bounce-slow"
        >
          <h1 className="text-5xl md:text-6xl font-bold" style={{ color: COLORS.primary }}>
            Circl.
          </h1>
        </div>

        {/* Message */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Congratulations!
          </h2>
          <p className="text-xl md:text-2xl font-bold text-white px-4">
            Welcome to your future, go dream big and build your way to the top!
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-md space-y-4">
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-xl text-lg font-bold shadow-xl transition-transform hover:scale-105"
            style={{ 
              backgroundColor: COLORS.yellow,
              color: COLORS.primary
            }}
          >
            Continue to Circl
          </button>

          {/* Invite Friends Button */}
          <button
            onClick={handleShareInvite}
            className="w-full py-4 rounded-xl text-lg font-bold shadow-xl transition-transform hover:scale-105 bg-white"
            style={{ color: COLORS.primary }}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Invite your Friends
            </span>
          </button>
        </div>
      </div>

      {/* Confetti Animation Styles */}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-fall {
          animation: fall linear forwards;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
