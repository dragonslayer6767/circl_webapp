import React, { createContext, useContext, useState, useCallback } from 'react';
import { SubscriptionContent, SubscriptionState, UserType } from '../types/subscription';
import { createSubscriptionContent } from '../utils/subscriptionContent';

interface SubscriptionContextType {
  isShowingPaywall: boolean;
  subscriptionState: SubscriptionState;
  currentContent: SubscriptionContent | null;
  selectedPlanId: string | null;
  selectedUserType: UserType | null;
  
  showPaywall: (userType: UserType) => void;
  dismissPaywall: () => void;
  selectPlan: (planId: string) => void;
  completeSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isShowingPaywall, setIsShowingPaywall] = useState(false);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>(SubscriptionState.NotShowing);
  const [currentContent, setCurrentContent] = useState<SubscriptionContent | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const showPaywall = useCallback((userType: UserType) => {
    console.log('🎯 PAYWALL SHOW: Starting for', userType);
    
    // Reset state
    setSubscriptionState(SubscriptionState.NotShowing);
    setCurrentContent(null);
    setSelectedPlanId(null);
    setSelectedUserType(userType);

    // Get content for user type
    const content = createSubscriptionContent(userType);
    setCurrentContent(content);

    // Show background immediately
    setSubscriptionState(SubscriptionState.ShowingBackground);
    setIsShowingPaywall(true);

    // Show content after 0.6s for impact
    setTimeout(() => {
      setSubscriptionState(SubscriptionState.ShowingContent);
    }, 600);
  }, []);

  const dismissPaywall = useCallback(() => {
    console.log('🎯 PAYWALL DISMISS: Starting dismissal');
    setSubscriptionState(SubscriptionState.Dismissed);
    setIsShowingPaywall(false);
    
    // Reset after animation
    setTimeout(() => {
      setCurrentContent(null);
      setSelectedPlanId(null);
      setSelectedUserType(null);
      setSubscriptionState(SubscriptionState.NotShowing);
    }, 300);
  }, []);

  const selectPlan = useCallback((planId: string) => {
    setSelectedPlanId(planId);
  }, []);

  const completeSubscription = useCallback(() => {
    console.log('🎯 SUBSCRIPTION COMPLETE: User selected plan:', selectedPlanId);
    setSubscriptionState(SubscriptionState.Completed);
    
    // TODO: Process subscription with backend
    // After successful purchase, dismiss paywall
    setTimeout(() => {
      dismissPaywall();
    }, 500);
  }, [selectedPlanId, dismissPaywall]);

  return (
    <SubscriptionContext.Provider
      value={{
        isShowingPaywall,
        subscriptionState,
        currentContent,
        selectedPlanId,
        selectedUserType,
        showPaywall,
        dismissPaywall,
        selectPlan,
        completeSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
