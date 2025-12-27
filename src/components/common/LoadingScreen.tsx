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

  // Array of available loading screens
  const loadingScreens = [
    'loadingscreen1.png',
    'loadingscreen2.png',
    'loadingscreen3.png',
    'loadingscreen4.png',
    'loadingscreen5.png',
    'loadingscreen6.png',
  ];

  useEffect(() => {
    // Randomly select a loading screen
    const randomScreen = loadingScreens[Math.floor(Math.random() * loadingScreens.length)];
    setBackgroundImage(randomScreen);

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
