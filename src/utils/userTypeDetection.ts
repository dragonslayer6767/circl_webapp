// User Type Detection for Tutorial System

export enum UserType {
  ENTREPRENEUR = 'entrepreneur',
  STUDENT = 'student',
  STUDENT_ENTREPRENEUR = 'studentEntrepreneur',
  MENTOR = 'mentor',
  COMMUNITY_BUILDER = 'communityBuilder',
  INVESTOR = 'investor',
  OTHER = 'other'
}

export interface OnboardingData {
  usageInterests: string;
  industryInterests: string;
  location: string;
  userGoals?: string;
}

export const UserTypeDisplayNames: Record<UserType, string> = {
  [UserType.ENTREPRENEUR]: 'Entrepreneur',
  [UserType.STUDENT]: 'Student',
  [UserType.STUDENT_ENTREPRENEUR]: 'Student Entrepreneur',
  [UserType.MENTOR]: 'Mentor',
  [UserType.COMMUNITY_BUILDER]: 'Community Builder',
  [UserType.INVESTOR]: 'Investor',
  [UserType.OTHER]: 'Other'
};

/**
 * Detects user type based on onboarding responses
 * Maps directly from Page3 "Main Usage Interests" selections
 */
export function detectUserType(onboardingData: OnboardingData): UserType {
  const interests = onboardingData.usageInterests.toLowerCase();
  const industry = onboardingData.industryInterests.toLowerCase();
  
  console.log('🔍 Detecting user type from interests:', interests, 'and industry:', industry);
  console.log('📋 Available Page3 options: Student, Start Your Business, Scale Your Business, Network with Entrepreneurs, Find Co-Founder/s, Find Mentors, Find Investors, Be Part of the Community, Share Knowledge, Make Investments, Sell a Skill');
  
  // EXACT MAPPING from Page3 "Main Usage Interests":
  
  // Student --> Student Tutorial
  if (interests.includes('student') && 
      !interests.includes('entrepreneur') && 
      !interests.includes('start your business') && 
      !interests.includes('scale your business')) {
    console.log('✅ Detected: Student (from "Student" interest)');
    return UserType.STUDENT;
  }
  
  // Check for student entrepreneur (student + business interests)
  if (interests.includes('student') && 
      (interests.includes('entrepreneur') || 
       interests.includes('start your business') || 
       interests.includes('scale your business'))) {
    console.log('✅ Detected: Student Entrepreneur');
    return UserType.STUDENT_ENTREPRENEUR;
  }
  
  // Start Your Business --> Entrepreneur Tutorial
  if (interests.includes('start your business')) {
    console.log('✅ Detected: Entrepreneur (from "Start Your Business" interest)');
    return UserType.ENTREPRENEUR;
  }
  
  // Scale Your Business --> Entrepreneur Tutorial
  if (interests.includes('scale your business')) {
    console.log('✅ Detected: Entrepreneur (from "Scale Your Business" interest)');
    return UserType.ENTREPRENEUR;
  }
  
  // Network with Entrepreneurs --> Entrepreneur Tutorial
  if (interests.includes('network with entrepreneurs')) {
    console.log('✅ Detected: Entrepreneur (from "Network with Entrepreneurs" interest)');
    return UserType.ENTREPRENEUR;
  }
  
  // Find Co-Founder/s --> Entrepreneur Tutorial
  if (interests.includes('find co-founder')) {
    console.log('✅ Detected: Entrepreneur (from "Find Co-Founder/s" interest)');
    return UserType.ENTREPRENEUR;
  }
  
  // Find Mentors --> Entrepreneur Tutorial
  if (interests.includes('find mentors')) {
    console.log('✅ Detected: Entrepreneur (from "Find Mentors" interest)');
    return UserType.ENTREPRENEUR;
  }
  
  // Find Investors --> Entrepreneur Tutorial
  if (interests.includes('find investors')) {
    console.log('✅ Detected: Entrepreneur (from "Find Investors" interest)');
    return UserType.ENTREPRENEUR;
  }
  
  // Make Investments --> Investor
  if (interests.includes('make investments')) {
    console.log('✅ Detected: Investor (from "Make Investments" interest)');
    return UserType.INVESTOR;
  }
  
  // Share Knowledge --> Mentor
  if (interests.includes('share knowledge')) {
    console.log('✅ Detected: Mentor (from "Share Knowledge" interest)');
    return UserType.MENTOR;
  }
  
  // Sell a Skill --> Entrepreneur Tutorial
  if (interests.includes('sell a skill')) {
    console.log('✅ Detected: Entrepreneur (from "Sell a Skill" interest)');
    return UserType.ENTREPRENEUR;
  }
  
  // Be Part of the Community --> Community Builder
  if (interests.includes('be part of the community')) {
    console.log('✅ Detected: Community Builder (from "Be Part of the Community" interest)');
    return UserType.COMMUNITY_BUILDER;
  }
  
  // Fallback checks for broader keyword matching
  if (interests.includes('entrepreneur') || industry.includes('startups & entrepreneurship')) {
    console.log('✅ Detected: Entrepreneur (from broad keyword matching)');
    return UserType.ENTREPRENEUR;
  }
  
  if (interests.includes('invest') || interests.includes('investor') || interests.includes('funding')) {
    console.log('✅ Detected: Investor (from broad keyword matching)');
    return UserType.INVESTOR;
  }
  
  if (interests.includes('mentor') || interests.includes('coach') || interests.includes('teach')) {
    console.log('✅ Detected: Mentor (from broad keyword matching)');
    return UserType.MENTOR;
  }
  
  if (interests.includes('community') || interests.includes('network')) {
    console.log('✅ Detected: Community Builder (from broad keyword matching)');
    return UserType.COMMUNITY_BUILDER;
  }
  
  // Default fallback
  console.log('⚠️ No specific match - defaulting to Community Builder');
  return UserType.COMMUNITY_BUILDER;
}

/**
 * Stores user type detection results in localStorage
 */
export function saveUserType(userType: UserType): void {
  localStorage.setItem('user_type_detected', userType);
  localStorage.setItem('user_type_display_name', UserTypeDisplayNames[userType]);
  console.log('💾 Saved user type:', UserTypeDisplayNames[userType]);
}

/**
 * Retrieves detected user type from localStorage
 */
export function getUserType(): UserType | null {
  const storedType = localStorage.getItem('user_type_detected');
  if (storedType && Object.values(UserType).includes(storedType as UserType)) {
    return storedType as UserType;
  }
  return null;
}

/**
 * Clears all tutorial-related data
 */
export function clearTutorialData(): void {
  localStorage.removeItem('user_type_detected');
  localStorage.removeItem('user_type_display_name');
  localStorage.removeItem('tutorial_completed');
  localStorage.removeItem('tutorial_progress');
  localStorage.removeItem('tutorial_skipped');
  console.log('🧹 Cleared all tutorial data');
}

/**
 * Detects user type from onboarding data and saves it
 */
export function detectAndSetUserType(onboardingData: OnboardingData): UserType {
  const detectedType = detectUserType(onboardingData);
  saveUserType(detectedType);
  return detectedType;
}
