import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTutorial } from '../../context/TutorialContext';
import { COLORS } from '../../utils/colors';

export default function TutorialOverlay() {
  const {
    currentFlow,
    currentStepIndex,
    isShowingTutorial,
    nextStep,
    skipTutorial,
  } = useTutorial();
  
  const navigate = useNavigate();

  const currentStep = currentFlow?.steps[currentStepIndex];

  // Handle navigation when step changes
  useEffect(() => {
    if (currentStep?.navigationDestination && isShowingTutorial) {
      navigate(currentStep.navigationDestination);
    }
  }, [currentStep, navigate, isShowingTutorial]);

  if (!isShowingTutorial || !currentFlow || !currentStep) {
    return null;
  }

  const progress = ((currentStepIndex + 1) / currentFlow.steps.length) * 100;
  const isLastStep = currentStepIndex === currentFlow.steps.length - 1;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          // Don't allow clicking outside to dismiss
        }}
      />

      {/* Tutorial Card */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-auto">
        <div className="bg-white rounded-t-3xl shadow-2xl mx-auto max-w-2xl">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 rounded-t-3xl overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: COLORS.primary,
              }}
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    Step {currentStepIndex + 1} of {currentFlow.steps.length}
                  </span>
                  {currentStep.isInteractive && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                      Interactive
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {currentStep.title}
                </h2>
                <p className="text-sm text-gray-600">{currentStep.description}</p>
              </div>

              {/* Skip Button */}
              <button
                onClick={skipTutorial}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                aria-label="Skip tutorial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message */}
            <div className="bg-blue-50 border-l-4 rounded-r-lg p-4" style={{ borderColor: COLORS.primary }}>
              <p className="text-gray-700 leading-relaxed">{currentStep.message}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm font-semibold text-gray-700">
                {Math.round(progress)}% Complete
              </div>

              <div className="flex gap-3">
                <button
                  onClick={skipTutorial}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <span>{isLastStep ? 'Finish' : 'Next'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
