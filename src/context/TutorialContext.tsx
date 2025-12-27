import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { TutorialFlow, TutorialState, TutorialStep, UserType } from '../types/tutorial';
import { getTutorialFlow } from '../utils/tutorialContent';

interface TutorialContextType {
  currentFlow: TutorialFlow | null;
  currentStepIndex: number;
  isShowingTutorial: boolean;
  tutorialState: TutorialState;
  userType: UserType;
  
  startTutorial: (userType?: UserType) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  restartTutorial: () => void;
  setUserType: (type: UserType) => void;
  checkAndTriggerTutorial: () => void;
  clearAllTutorialData: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentFlow, setCurrentFlow] = useState<TutorialFlow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isShowingTutorial, setIsShowingTutorial] = useState(false);
  const [tutorialState, setTutorialState] = useState<TutorialState>({ type: 'notStarted' });
  const [userType, setUserTypeState] = useState<UserType>('community-builder');
  const [isTutorialStarting, setIsTutorialStarting] = useState(false);

  // Load user type and tutorial progress from localStorage
  useEffect(() => {
    const savedUserType = localStorage.getItem('user_type_detected') as UserType;
    if (savedUserType) {
      setUserTypeState(savedUserType);
    }
    
    // Load tutorial progress
    const savedProgress = localStorage.getItem('tutorial_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        // Could restore progress here if needed
      } catch (e) {
        console.error('Failed to parse tutorial progress:', e);
      }
    }
  }, []);

  const setUserType = useCallback((type: UserType) => {
    setUserTypeState(type);
    localStorage.setItem('user_type_detected', type);
  }, []);

  const hasTutorialBeenCompleted = useCallback((type: UserType): boolean => {
    const completedFlows = JSON.parse(localStorage.getItem('completed_tutorial_flows') || '[]');
    return completedFlows.includes(type);
  }, []);

  const startTutorial = useCallback((targetUserType?: UserType) => {
    const typeToUse = targetUserType || userType;
    
    console.log('🎬 Starting tutorial for:', typeToUse);
    
    // Don't start if already completed (unless manual restart)
    if (!targetUserType && hasTutorialBeenCompleted(typeToUse)) {
      console.log('Tutorial already completed for:', typeToUse);
      return;
    }

    if (isTutorialStarting) {
      console.log('Tutorial already starting, preventing duplicate');
      return;
    }

    setIsTutorialStarting(true);

    const flow = getTutorialFlow(typeToUse);
    if (!flow) {
      console.log('No tutorial flow found for:', typeToUse);
      setIsTutorialStarting(false);
      return;
    }

    setCurrentFlow(flow);
    setCurrentStepIndex(0);
    setTutorialState({ type: 'inProgress', stepIndex: 0 });
    setIsShowingTutorial(true);
    
    // Save progress
    saveTutorialProgress(flow.id, 0, []);
    
    setTimeout(() => {
      setIsTutorialStarting(false);
    }, 1000);

    console.log('✅ Tutorial started:', flow.title);
  }, [userType, hasTutorialBeenCompleted, isTutorialStarting]);

  const nextStep = useCallback(() => {
    if (!currentFlow) return;

    if (currentStepIndex < currentFlow.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTutorialState({ type: 'inProgress', stepIndex: nextIndex });
      
      // Save progress
      const completedSteps = currentFlow.steps.slice(0, nextIndex).map(s => s.id);
      saveTutorialProgress(currentFlow.id, nextIndex, completedSteps);
      
      console.log('➡️ Moving to step', nextIndex + 1, 'of', currentFlow.steps.length);
    } else {
      completeTutorial();
    }
  }, [currentFlow, currentStepIndex]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setTutorialState({ type: 'inProgress', stepIndex: prevIndex });
      console.log('⬅️ Moving back to step', prevIndex + 1);
    }
  }, [currentStepIndex]);

  const skipTutorial = useCallback(() => {
    console.log('⏭️ Tutorial skipped');
    setTutorialState({ type: 'skipped' });
    setIsShowingTutorial(false);
    setCurrentFlow(null);
    setCurrentStepIndex(0);
    
    // Mark as skipped but don't mark as completed
    localStorage.setItem('tutorial_skipped', 'true');
  }, []);

  const completeTutorial = useCallback(() => {
    console.log('✅ Tutorial completed!');
    setTutorialState({ type: 'completed' });
    setIsShowingTutorial(false);
    
    if (currentFlow) {
      // Mark this tutorial as completed
      const completedFlows = JSON.parse(localStorage.getItem('completed_tutorial_flows') || '[]');
      if (!completedFlows.includes(currentFlow.userType)) {
        completedFlows.push(currentFlow.userType);
        localStorage.setItem('completed_tutorial_flows', JSON.stringify(completedFlows));
      }
    }
    
    setCurrentFlow(null);
    setCurrentStepIndex(0);
  }, [currentFlow]);

  const restartTutorial = useCallback(() => {
    console.log('🔄 Restarting tutorial for:', userType);
    clearAllTutorialData();
    startTutorial(userType);
  }, [userType, startTutorial]);

  const checkAndTriggerTutorial = useCallback(() => {
    const justCompletedOnboarding = localStorage.getItem('just_completed_onboarding') === 'true';
    
    if (justCompletedOnboarding) {
      console.log('🎯 Just completed onboarding, triggering tutorial');
      localStorage.removeItem('just_completed_onboarding');
      startTutorial();
    }
  }, [startTutorial]);

  const clearAllTutorialData = useCallback(() => {
    localStorage.removeItem('tutorial_progress');
    localStorage.removeItem('completed_tutorial_flows');
    localStorage.removeItem('tutorial_skipped');
    localStorage.removeItem('just_completed_onboarding');
    setTutorialState({ type: 'notStarted' });
    setCurrentFlow(null);
    setCurrentStepIndex(0);
    setIsShowingTutorial(false);
    console.log('🗑️ Cleared all tutorial data');
  }, []);

  const saveTutorialProgress = (flowId: string, stepIndex: number, completedSteps: string[]) => {
    const progress = {
      flowId,
      currentStepIndex: stepIndex,
      completedSteps,
      lastAccessed: new Date().toISOString(),
      startedAt: new Date().toISOString()
    };
    localStorage.setItem('tutorial_progress', JSON.stringify(progress));
  };

  return (
    <TutorialContext.Provider
      value={{
        currentFlow,
        currentStepIndex,
        isShowingTutorial,
        tutorialState,
        userType,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        completeTutorial,
        restartTutorial,
        setUserType,
        checkAndTriggerTutorial,
        clearAllTutorialData
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
