// Tutorial Type System
export type UserType =
  | 'entrepreneur'
  | 'student'
  | 'student-entrepreneur'
  | 'mentor'
  | 'community-builder'
  | 'investor';

export const USER_TYPE_LABELS: Record<UserType, string> = {
  entrepreneur: 'Entrepreneur',
  student: 'Student',
  'student-entrepreneur': 'Student Entrepreneur',
  mentor: 'Mentor',
  'community-builder': 'Community Builder',
  investor: 'Investor',
};

// Tutorial Step Model
export type TooltipAlignment = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetView: string; // Identifier for the view/component to highlight
  message: string; // Detailed explanation for this user type
  navigationDestination?: string; // Where to navigate (if needed)
  highlightRect?: { x: number; y: number; width: number; height: number };
  tooltipAlignment: TooltipAlignment;
  duration?: number;
  isInteractive: boolean; // Whether user needs to interact or just view
}

// Tutorial Flow Model
export interface TutorialFlow {
  id: string;
  userType: UserType;
  title: string;
  description: string;
  steps: TutorialStep[];
  estimatedDuration: number; // in seconds
  isRequired: boolean;
}

// Tutorial State
export type TutorialState = 
  | { type: 'notStarted' }
  | { type: 'inProgress'; stepIndex: number }
  | { type: 'completed' }
  | { type: 'skipped' };

// Tutorial Progress
export interface TutorialProgress {
  flowId: string;
  completedSteps: string[];
  currentStepIndex: number;
  isCompleted: boolean;
  lastAccessed: Date;
  startedAt: Date;
}

// Onboarding Data for User Type Detection
export interface OnboardingData {
  usageInterests: string;
  industryInterests: string;
  location: string;
  userGoals?: string;
}
