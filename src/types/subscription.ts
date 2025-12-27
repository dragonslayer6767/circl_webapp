// Subscription models matching the iOS design
export interface SubscriptionPlan {
  id: string;
  title: string;
  price: string;
  period: 'monthly' | 'yearly';
  features: string[];
  isPopular: boolean;
  originalPrice?: string;
  discount?: string;
}

export interface SubscriptionContent {
  userType: UserType;
  backgroundImage: string;
  title: string;
  subtitle: string;
  benefits: string[];
  plans: SubscriptionPlan[];
}

export type UserType = 
  | 'entrepreneur'
  | 'student'
  | 'student-entrepreneur'
  | 'mentor'
  | 'community-builder'
  | 'investor'
  | 'other';

export const USER_TYPE_LABELS: Record<UserType, string> = {
  entrepreneur: 'Entrepreneur',
  student: 'Student',
  'student-entrepreneur': 'Student Entrepreneur',
  mentor: 'Mentor',
  'community-builder': 'Community Builder',
  investor: 'Investor',
  other: 'Other',
};

export enum SubscriptionState {
  NotShowing = 'notShowing',
  ShowingBackground = 'showingBackground',
  ShowingContent = 'showingContent',
  Completed = 'completed',
  Dismissed = 'dismissed',
}
