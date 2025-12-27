import { useEffect, useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { SubscriptionContent } from '../../types/subscription';
import { COLORS } from '../../utils/colors';

export default function SubscriptionPaywall() {
  const { isShowingPaywall, subscriptionState, currentContent, dismissPaywall } = useSubscription();
  const [showContent, setShowContent] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    if (isShowingPaywall && !backgroundImage) {
      // Randomly select one of the 3 payment images
      const imageNumber = Math.floor(Math.random() * 3) + 1;
      setBackgroundImage(`payment${imageNumber}.png`);
    }
  }, [isShowingPaywall, backgroundImage]);

  useEffect(() => {
    if (subscriptionState === 'showingContent') {
      // Small delay for content animation
      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
    }
  }, [subscriptionState]);

  if (!isShowingPaywall || !currentContent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Background Image - Full Screen */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/subscription-backgrounds/${backgroundImage})`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-30" />

      {/* Close Button */}
      <button
        onClick={dismissPaywall}
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Content Container */}
      <div className="relative h-full overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {/* Top Spacer */}
          <div className="flex-shrink-0 h-16 md:h-24" />

          {/* White Content Container - Smaller */}
          <div
            className={`
              bg-white bg-opacity-95 backdrop-blur-sm rounded-t-3xl mx-auto max-w-5xl w-full px-6 py-8 space-y-6
              transform transition-all duration-500
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
            `}
          >
            {/* Title Section */}
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
                {currentContent.title}
              </h1>
              <p className="text-sm md:text-base text-center text-gray-600">
                {currentContent.subtitle}
              </p>
            </div>

            {/* Subscription Plans - Centered */}
            <div className="flex justify-center py-4">
              <div className="flex gap-4 overflow-x-auto px-4 max-w-full">
                {currentContent.plans.map((plan) => (
                  <SubscriptionPlanCard key={plan.id} plan={plan} content={currentContent} />
                ))}
              </div>
            </div>

            {/* Subscribe Button */}
            <div className="flex justify-center">
              <SubscribeButton content={currentContent} />
            </div>

            {/* Terms & Privacy */}
            <div className="flex justify-center gap-6 pt-3 border-t border-gray-200">
              <button className="text-xs text-gray-500 hover:text-gray-700">
                Terms of Service
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-700">
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Bottom Spacer */}
          <div className="flex-shrink-0 h-8" />
        </div>
      </div>
    </div>
  );
}

function SubscriptionPlanCard({ plan, content: _content }: any) {
  const { selectedPlanId, selectPlan } = useSubscription();
  const isSelected = selectedPlanId === plan.id;

  return (
    <button
      onClick={() => selectPlan(plan.id)}
      className={`
        w-72 h-[420px] p-5 rounded-2xl transition-all flex-shrink-0 flex flex-col
        ${
          isSelected
            ? 'ring-2 ring-offset-2'
            : 'bg-white hover:shadow-md'
        }
      `}
      style={{
        ...(isSelected && { '--tw-ring-color': COLORS.primary } as any),
        backgroundColor: isSelected ? '#f0f9ff' : undefined,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="flex items-start justify-between flex-shrink-0">
          <div className="text-left flex-1">
            {plan.isPopular && (
              <span className="inline-block text-xs font-bold text-white bg-orange-500 px-3 py-1 rounded-full mb-2">
                POPULAR
              </span>
            )}
            <h3 className="font-bold text-xl" style={{ color: COLORS.primary }}>
              {plan.title}
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                {plan.price}
              </span>
              <span className="text-base" style={{ color: '#0066ff' }}>
                /{plan.period}
              </span>
            </div>
            {plan.originalPrice && plan.discount && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500 line-through">{plan.originalPrice}</span>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                  {plan.discount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Features - Scrollable */}
        <div className="flex-1 overflow-y-auto mt-4 pt-4 border-t border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="space-y-3 pr-2">
            {plan.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs text-gray-700 text-left leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function SubscribeButton({ content: _content }: { content: SubscriptionContent }) {
  const { selectedPlanId, completeSubscription } = useSubscription();

  return (
    <button
      onClick={completeSubscription}
      disabled={!selectedPlanId}
      className={`
        w-full max-w-md py-3 rounded-full font-bold text-base text-white
        transition-all transform
        ${
          selectedPlanId
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg active:scale-95'
            : 'bg-gray-300 cursor-not-allowed'
        }
      `}
    >
      <div className="flex items-center justify-center gap-2">
        <span>Start Your Journey</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </button>
  );
}
