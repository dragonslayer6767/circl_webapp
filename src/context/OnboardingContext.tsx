import { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  // Step 1: Terms acceptance
  agreedToTerms: boolean;
  agreedToPrivacyPolicy: boolean;

  // Step 2: Basic registration
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  selectedUsageInterest: string;
  selectedIndustryInterest: string;

  // Step 3: Profile picture
  profilePicture: string | null;

  // Step 4: Personal info
  birthday: string;
  location: string;
  gender: string;
  availability: string;
  personalityType: string;

  // Step 5: Notifications
  notificationsEnabled: boolean;

  // Metadata
  userId?: number;
  currentStep: number;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetOnboarding: () => void;
}

const defaultData: OnboardingData = {
  agreedToTerms: false,
  agreedToPrivacyPolicy: false,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  selectedUsageInterest: '',
  selectedIndustryInterest: '',
  profilePicture: null,
  birthday: '',
  location: '',
  gender: '',
  availability: '',
  personalityType: '',
  notificationsEnabled: false,
  currentStep: 1,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setData(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  };

  const resetOnboarding = () => {
    setData(defaultData);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, nextStep, prevStep, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
