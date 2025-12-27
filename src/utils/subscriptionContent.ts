import { SubscriptionContent, SubscriptionPlan, UserType } from '../types/subscription';

// Universal plans used across all user types (matching iOS version)
function universalPlans(): SubscriptionPlan[] {
  return [
    {
      id: 'student-plus',
      title: 'Student+',
      price: '$7.99',
      period: 'monthly',
      features: [
        'Unlimited daily connections (vs 4/day free limit), mentor matches, and Circle creation',
        'Earn more with 50% less transaction fee at 7% compared to 14% transaction fee',
        'Full circles dashboard access: Task Manager, KPI Tracking, Calendar and Events feature',
        '2 free marketplace boosts (30% more visibility, $15 value each)',
        'Priority Access to future products such as CRM integration and Video call features',
        '* Must validate student email via profile to qualify for Student+ pricing'
      ],
      isPopular: false,
    },
    {
      id: 'entrepreneur-plus',
      title: 'Entrepreneur+',
      price: '$29.99',
      period: 'monthly',
      features: [
        'Unlimited daily connections (vs 4/day free limit), mentor matches, and Circle creation',
        'Earn more with 50% less transaction fee at 7% compared to 14% transaction fee',
        'Full circles dashboard access: Task Manager, KPI Tracking, Calendar and Events feature',
        'Unlimited job and project listings and monetization (vs 2/month free limit)',
        'Advanced circle dashboard: Real-time analytics, CRM import/API integration',
        '2 free marketplace boosts + 1 monthly recurring boost (45% more visibility, $45 value)',
        'Priority Access to future products such as CRM integration and Video call features',
        'Advanced search filters: Industry, location, experience level, funding stage'
      ],
      isPopular: true,
    },
    {
      id: 'founderx',
      title: 'FounderX',
      price: '$54.99',
      period: 'monthly',
      features: [
        'Unlimited daily connections (vs 4/day free limit), mentor matches, and Circle creation',
        'Earn more with 50% less transaction fee at 7% compared to 14% transaction fee',
        'Full circles dashboard access: Task Manager, KPI Tracking, Calendar and Events feature',
        'Unlimited job and project listings and monetization (vs 2/month free limit)',
        'Advanced circle dashboard: Real-time analytics, CRM import/API integration',
        '2 free marketplace boosts + 2 monthly recurring boosts (60% more visibility, $60 value)',
        'Early Access to new products including CRM integration and Video call features',
        'Advanced search filters: Industry, location, experience level, funding stage',
        'Priority support with 24-hour response guarantee',
        'Access to 500+ verified investors and exclusive networking events'
      ],
      isPopular: false,
    }
  ];
}

export function createSubscriptionContent(userType: UserType): SubscriptionContent {
  switch (userType) {
    case 'entrepreneur':
      return createEntrepreneurSubscription();
    case 'student':
      return createStudentSubscription();
    case 'student-entrepreneur':
      return createStudentEntrepreneurSubscription();
    case 'mentor':
      return createMentorSubscription();
    case 'community-builder':
      return createCommunityBuilderSubscription();
    case 'investor':
      return createInvestorSubscription();
    default:
      return createCommunityBuilderSubscription();
  }
}

function createEntrepreneurSubscription(): SubscriptionContent {
  const plans = universalPlans();

  return {
    userType: 'entrepreneur',
    backgroundImage: 'EntrepreneurPaywall',
    title: 'Take Control Of Your Future',
    subtitle: 'Circl is designed to be your success command center',
    benefits: [],
    plans,
  };
}

function createStudentSubscription(): SubscriptionContent {
  const plans = universalPlans();

  return {
    userType: 'student',
    backgroundImage: 'StudentPaywall',
    title: 'Take Control Of Your Future',
    subtitle: 'Circl is designed to be your success command center',
    benefits: [],
    plans,
  };
}

function createStudentEntrepreneurSubscription(): SubscriptionContent {
  const plans = universalPlans();

  return {
    userType: 'student-entrepreneur',
    backgroundImage: 'StudentEntrepreneurPaywall',
    title: 'Take Control Of Your Future',
    subtitle: 'Circl is designed to be your success command center',
    benefits: [],
    plans,
  };
}

function createMentorSubscription(): SubscriptionContent {
  const plans = universalPlans();

  return {
    userType: 'mentor',
    backgroundImage: 'MentorPaywall',
    title: 'Take Control Of Your Future',
    subtitle: 'Circl is designed to be your success command center',
    benefits: [],
    plans,
  };
}

function createCommunityBuilderSubscription(): SubscriptionContent {
  const plans = universalPlans();

  return {
    userType: 'community-builder',
    backgroundImage: 'CommunityBuilderPaywall',
    title: 'Take Control Of Your Future',
    subtitle: 'Circl is designed to be your success command center',
    benefits: [],
    plans,
  };
}

function createInvestorSubscription(): SubscriptionContent {
  const plans = universalPlans();

  return {
    userType: 'investor',
    backgroundImage: 'InvestorPaywall',
    title: 'Take Control Of Your Future',
    subtitle: 'Circl is designed to be your success command center',
    benefits: [],
    plans,
  };
}
