import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logoScale, setLogoScale] = useState(0.8);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [currentTip, setCurrentTip] = useState('');

  // Array of available loading screens
  const loadingScreens = [
    'loadingscreen1.png',
    'loadingscreen2.png',
    'loadingscreen3.png',
    'loadingscreen4.png',
    'loadingscreen5.png',
    'loadingscreen6.png',
  ];

  // Array of tips and advice
  const tips = [
    "Swipe left on bad ideas, not on mentors.",
    "Collaboration > ego. Unless you're a lone wolf, in which case… good luck.",
    "Team chat is like traffic: the more you ignore it, the worse it gets.",
    "Remember, your business plan is not a cheat code. Until you start executing and learning.",
    "Deadline? Pfft. Time is just a social construct, right?",
    "Your competitors aren't your enemies… except when they are.",
    "KPIs don't lie, but people sure do. Check both.",
    "Mentors aren't magic; they're cheat codes with homework.",
    "Ideas are cheap. Execution is priceless.",
    "Your MVP doesn't have to be perfect. Just not catastrophic.",
    "Trust your instincts… and also your legal counsel.",
    "Logging one task a day keeps chaos at bay… maybe.",
    "Steve Jobs didn't invent everything. He just made the world want it.",
    "Your roadmap isn't Candy Crush: don't just swipe and hope for the best.",
    "Airbnb didn't just rent beds, they sold experiences. What's your twist?",
    "Twitter may be full of drama, but hey, at least it's free market research.",
    "Mark Cuban would probably tell you to hustle harder… or buy a boat. Both work.",
    "Don't just chase funding chase clarity first.",
    "Good ideas age like milk if you don't act fast.",
    "Start small, fail fast, learn faster.",
    "Yes, your app can crash spectacularly. Welcome to the club.",
    "Hackathons: because sleep is for losers.",
  ];

  useEffect(() => {
    // Randomly select a loading screen
    const randomScreen = loadingScreens[Math.floor(Math.random() * loadingScreens.length)];
    setBackgroundImage(randomScreen);

    // Randomly select a tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);

    // Animate logo appearance
    setTimeout(() => {
      setLogoScale(1.0);
      setLogoOpacity(1.0);
    }, 100);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) {
            setTimeout(onComplete, 300); // Small delay after completion
          }
          return 100;
        }
        return prev + (100 / (duration / 50)); // Update every 50ms
      });
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/loading-screens/${backgroundImage})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-30" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between py-12">
        {/* Top Spacer */}
        <div className="h-12" />

        {/* Logo */}
        <div className="flex-1 flex items-start justify-center pt-20">
          <img
            src="/loading-screens/circllogotransparent.png"
            alt="Circl Logo"
            className="w-48 h-48 object-contain transition-all duration-800"
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))',
            }}
          />
        </div>

        {/* Tip Bubble */}
        <div className="px-6 max-w-2xl mx-auto mb-8">
          <div 
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border-2 border-white border-opacity-40"
            style={{
              opacity: logoOpacity,
            }}
          >
            <p className="text-gray-800 text-center text-sm md:text-base font-medium leading-relaxed">
              💡 <span className="italic">{currentTip}</span>
            </p>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center space-y-5 pb-16">
          {/* Loading Text */}
          <div
            className="text-white text-base font-bold tracking-[0.3em] opacity-90"
            style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            }}
          >
            LOADING
          </div>

          {/* Progress Bar */}
          <div className="relative w-64 h-1.5 bg-black bg-opacity-30 rounded-full overflow-hidden shadow-md">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #ffffff, #fb923c)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
