import { TutorialFlow, TutorialStep, UserType } from '../types/tutorial';

// Helper to create tutorial access step (common to all tutorials)
const createTutorialAccessStep = (): TutorialStep => ({
  id: 'tutorial-access',
  title: 'Tutorial Access',
  description: 'You can always rewatch tutorials',
  targetView: 'settings_tutorial_access',
  message:
    "Forgot how to use a feature? No worries! You can always rewatch any tutorial by going to Settings and tapping 'Tutorial'. All tutorials are available anytime you need them!",
  tooltipAlignment: 'center',
  isInteractive: false,
});

// Helper to create final community step (common to all tutorials)
const createFinalCommunityStep = (): TutorialStep => ({
  id: 'final-community',
  title: "You're Ready!",
  description: 'Welcome to the Circl community',
  targetView: 'success_tips',
  message:
    "You're all set! Remember, Circl is about building genuine connections. Be authentic, help others, and don't hesitate to ask questions. The community is here to support your journey!",
  tooltipAlignment: 'center',
  isInteractive: false,
});

// Entrepreneur Tutorial
export function createEntrepreneurTutorial(): TutorialFlow {
  const steps: TutorialStep[] = [
    {
      id: 'entrepreneur-welcome',
      title: 'Welcome to Circl, Entrepreneur!',
      description: "Let's show you how Circl can accelerate your entrepreneurial journey",
      targetView: 'main_navigation',
      message:
        'As an entrepreneur, you need tools to find co-founders, investors, mentors, and grow your network. Circl is designed specifically for ambitious founders like you.',
      navigationDestination: '/forum',
      tooltipAlignment: 'center',
      isInteractive: false,
    },
    {
      id: 'entrepreneur-forum',
      title: 'Your Entrepreneurial Bulletin Board',
      description: 'Share your updates and see what others in the community are posting',
      targetView: 'home_tab',
      message:
        'Think of this as your community bulletin board where entrepreneurs share wins, challenges, insights, and opportunities. Post your own updates, celebrate milestones, and engage with fellow founders content to build meaningful connections.',
      navigationDestination: '/network',
      tooltipAlignment: 'bottom',
      isInteractive: false,
    },
    {
      id: 'entrepreneur-network',
      title: 'Find Co-Founders & Mentors',
      description: 'Connect with potential co-founders, experienced mentors, and strategic partners',
      targetView: 'network_tab',
      message:
        "This is your most powerful tool as an entrepreneur. Search for co-founders with complementary skills, experienced mentors who've been where you're going, and industry experts who can provide valuable guidance for your startup journey.",
      navigationDestination: '/circles',
      tooltipAlignment: 'top',
      isInteractive: true,
    },
    {
      id: 'entrepreneur-circles-business',
      title: 'Run Your Business Through Circles',
      description: 'Use Circles as your business management and collaboration platform',
      targetView: 'circles_tab',
      message:
        "Create a circle to run your business operations. Manage tasks, track KPIs, centralize team communication, and coordinate with co-founders. It's your startup's command center in one organized space.",
      tooltipAlignment: 'bottom',
      isInteractive: false,
    },
    {
      id: 'entrepreneur-circles-social',
      title: 'Join Entrepreneurial Circles',
      description: 'Connect with like-minded founders and industry-specific groups',
      targetView: 'circles_tab',
      message:
        'Join circles based on your industry, business model, or stage of growth. Share challenges, celebrate wins, and learn from other entrepreneurs facing similar journeys.',
      tooltipAlignment: 'top',
      isInteractive: false,
    },
    {
      id: 'entrepreneur-circles-strategic',
      title: 'Create or Join Strategic Circles',
      description: 'Build communities around your startup or join investor/advisor groups',
      targetView: 'circles_tab',
      message:
        'Create a circle for your startup team and advisors, or join exclusive investor networks and accelerator groups. Use circles strategically to build your startup ecosystem.',
      navigationDestination: '/business-profile',
      tooltipAlignment: 'left',
      isInteractive: false,
    },
    {
      id: 'entrepreneur-business-profile',
      title: 'Showcase Your Venture',
      description: 'Create a compelling business profile to attract investors and co-founders',
      targetView: 'business_profile_tab',
      message:
        "Your business profile is crucial for attracting investors and co-founders. Share your startup's mission, traction, funding needs, and what roles you're looking to fill.",
      navigationDestination: '/messages',
      tooltipAlignment: 'top',
      isInteractive: false,
    },
    {
      id: 'entrepreneur-messages',
      title: 'Conversate, Collaborate, Pass Networks, and Sell',
      description: 'Use messages for deep connections and business opportunities',
      targetView: 'messages_tab',
      message:
        'Use messages to have meaningful conversations with mentors, collaborate with co-founders and team members, pass valuable network connections to others, and engage with potential clients or customers. This is where relationships turn into business opportunities.',
      navigationDestination: '/forum',
      tooltipAlignment: 'right',
      isInteractive: false,
    },
    {
      id: 'entrepreneur-success-tips',
      title: 'Entrepreneur Success Tips',
      description: 'Make the most of Circl for your startup journey',
      targetView: 'success_tips',
      message:
        'Pro tips: Update your business profile regularly, engage authentically in circles, be specific about what you're looking for, and always follow up on connections. Consistency builds trust!',
      tooltipAlignment: 'center',
      isInteractive: false,
    },
  ];

  return {
    id: 'entrepreneur-tutorial',
    userType: 'entrepreneur',
    title: "Entrepreneur's Guide to Circl",
    description: 'Learn how to leverage Circl to find co-founders, investors, and grow your startup',
    steps: [...steps, createTutorialAccessStep(), createFinalCommunityStep()],
    estimatedDuration: 10 * 60, // 10 minutes
    isRequired: true,
  };
}

// Student Tutorial
export function createStudentTutorial(): TutorialFlow {
  const steps: TutorialStep[] = [
    {
      id: 'student-welcome',
      title: 'Welcome to Circl, Student!',
      description: 'The job market has changed, getting hired and keeping your job is harder than ever',
      targetView: 'main_navigation',
      message:
        'In Circl, you will build your future, from being part of a project from a business to boost your resume, opportunities to getting hired, and even choosing to help build a startup!',
      navigationDestination: '/forum',
      tooltipAlignment: 'center',
      isInteractive: false,
    },
    {
      id: 'student-learn-market',
      title: 'Learn the Market and Discuss!',
      description: 'Get insights from companies and entrepreneurs',
      targetView: 'home_tab',
      message:
        'The home feed is your research database. Read stories, learn failures and successes, and stay updated on market trends. This knowledge will be invaluable for your future ventures.',
      navigationDestination: '/network',
      tooltipAlignment: 'bottom',
      isInteractive: false,
    },
    {
      id: 'student-find-mentors',
      title: 'Find Mentors & Learn from Experts',
      description: 'Connect with industry professionals with experience and willingness to guide',
      targetView: 'network_tab',
      message:
        'Many successful employees and entrepreneurs love mentoring students. Use the network to find mentors in your field of interest, ask for advice, and learn from their experiences. This is pure gold for your development!',
      navigationDestination: '/forum',
      tooltipAlignment: 'top',
      isInteractive: true,
    },
    {
      id: 'student-collaborate',
      title: 'Collaborate, Collaborate, Collaborate, Maybe Make Money',
      description: "Building your future doesn't involve building alone, that's sad and hard",
      targetView: 'forum_tab',
      message:
        "Circl is the first networking app where you can actually collaborate with professionals. Find projects from our project/job listing board. If you think it's necessary, don't hesitate to charge a business for your service. Build a team with your friends. Your future is yours!",
      navigationDestination: '/circles',
      tooltipAlignment: 'bottom',
      isInteractive: false,
    },
    {
      id: 'student-join-orgs',
      title: "Join Your Student Organization's Circl",
      description: 'Supercharge your network further by being involved on campus',
      targetView: 'circles_tab',
      message:
        'Joining organizations gives you insider access to their partner companies, their alumni network, and their professional workshops giving you better development than most students who are not in one.',
      navigationDestination: '/profile',
      tooltipAlignment: 'top',
      isInteractive: false,
    },
    {
      id: 'student-profile',
      title: 'Complete Your Profile',
      description: 'Help other professionals understand you more',
      targetView: 'profile_tab',
      message:
        "Circl is built on collaboration, having an incomplete profile may cause distrust between users, besides if the community understands you better, they'll know how to work with you best!",
      navigationDestination: '/messages',
      tooltipAlignment: 'bottom',
      isInteractive: false,
    },
    {
      id: 'student-messages',
      title: 'Connect and Message Professionally',
      description: 'Build relationships that will shape your career',
      targetView: 'messages_tab',
      message:
        'Use messages to have deeper conversations with mentors, collaborate on projects, and build lasting professional relationships. Remember to be respectful, genuine, and always follow up on commitments.',
      navigationDestination: '/forum',
      tooltipAlignment: 'right',
      isInteractive: false,
    },
    {
      id: 'student-future',
      title: 'Build Your Future',
      description: 'Use Circl to explore different paths',
      targetView: 'success_tips',
      message:
        "Explore industries, talk to founders and other professionals. Get projects from our project board. Try entrepreneurship, it's not as scary as you think it is. In Circl you can build a team! Dream Big!",
      tooltipAlignment: 'center',
      isInteractive: false,
    },
  ];

  return {
    id: 'student-tutorial',
    userType: 'student',
    title: "Student's Guide to Building Your Future",
    description: 'Learn how to use Circl to build your career, find opportunities, and explore your potential',
    steps: [...steps, createTutorialAccessStep(), createFinalCommunityStep()],
    estimatedDuration: 10 * 60,
    isRequired: true,
  };
}

// Student Entrepreneur Tutorial
export function createStudentEntrepreneurTutorial(): TutorialFlow {
  const steps: TutorialStep[] = [
    {
      id: 'student-ent-welcome',
      title: 'Welcome to Circl, Future Entrepreneur!',
      description: 'Discover how Circl can jumpstart your entrepreneurial education',
      targetView: 'main_navigation',
      message:
        "As a student entrepreneur, you're perfectly positioned to learn, network, and start building your entrepreneurial journey. Circl connects you with experienced founders, mentors, and peers.",
      navigationDestination: '/forum',
      tooltipAlignment: 'center',
      isInteractive: false,
    },
    {
      id: 'student-ent-learn',
      title: 'Learn from Founder Stories',
      description: 'Get insights from real entrepreneurs and startup case studies',
      targetView: 'home_tab',
      message:
        'The home feed is your entrepreneurship classroom. Read founder stories, learn from failures and successes, and stay updated on startup trends. This knowledge will be invaluable for your future ventures.',
      navigationDestination: '/network',
      tooltipAlignment: 'bottom',
      isInteractive: false,
    },
    {
      id: 'student-ent-mentors',
      title: 'Find Mentors & Learn from Experts',
      description: 'Connect with experienced entrepreneurs willing to guide students',
      targetView: 'network_tab',
      message:
        'Many successful entrepreneurs love mentoring students. Use the network to find mentors in your field of interest, ask for advice, and learn from their experiences. This is pure gold for your development!',
      navigationDestination: '/circles',
      tooltipAlignment: 'top',
      isInteractive: true,
    },
    {
      id: 'student-ent-circles',
      title: 'Join Student Entrepreneur Circles',
      description: 'Connect with fellow student entrepreneurs and recent graduates',
      targetView: 'circles_tab',
      message:
        "Join circles like 'Student Entrepreneurs', 'College Startup Founders', or industry-specific groups. Share ideas, find potential co-founders, and learn from peers who are on similar journeys.",
      tooltipAlignment: 'top',
      isInteractive: false,
    },
    {
      id: 'student-ent-run-business',
      title: 'Run Your Business Through Circles',
      description: 'Use Circles as your business management platform',
      targetView: 'circles_tab',
      message:
        'Create a Circle to run your business operations. Manage tasks and KPIs, centralize messaging for your employees, use the calendar feature for meetings and deadlines, and keep everything organized in one powerful platform designed for collaboration.',
      tooltipAlignment: 'bottom',
      isInteractive: false,
    },
    {
      id: 'student-ent-recruit',
      title: 'Recruit & Build Your College Team',
      description: 'Find talented college students to join your startup',
      targetView: 'circles_tab',
      message:
        'Recruit and build a team for your business with other college students on the platform. Find students with complementary skills, shared entrepreneurial drive, and the flexibility that comes with being in school. Your next co-founder or key team member might be just a few dorms away!',
      navigationDestination: '/profile',
      tooltipAlignment: 'left',
      isInteractive: false,
    },
    {
      id: 'student-ent-profile',
      title: 'Build Your Entrepreneurial Profile',
      description: 'Start building your professional presence while still in school',
      targetView: 'profile_tab',
      message:
        'Even as a student, showcase your projects, internships, and entrepreneurial interests. This helps mentors understand your goals and attracts like-minded student entrepreneurs.',
      navigationDestination: '/messages',
      tooltipAlignment: 'top',
      isInteractive: false,
    },
    {
      id: 'student-ent-networking',
      title: 'Student Networking Strategy',
      description: 'Learn how to network effectively as a student',
      targetView: 'messages_tab',
      message:
        "When reaching out to entrepreneurs, be genuine about being a student. Ask thoughtful questions, show you've done your research, and offer to help with small tasks. Authenticity beats perfection!",
      navigationDestination: '/forum',
      tooltipAlignment: 'right',
      isInteractive: false,
    },
    {
      id: 'student-ent-future',
      title: 'Plan Your Entrepreneurial Future',
      description: 'Use Circl to explore different entrepreneurial paths',
      targetView: 'success_tips',
      message:
        'Explore different industries, talk to founders in various stages, and understand different business models. This exploration phase is crucial for finding what truly excites you!',
      tooltipAlignment: 'center',
      isInteractive: false,
    },
  ];

  return {
    id: 'student-entrepreneur-tutorial',
    userType: 'student-entrepreneur',
    title: "Student Entrepreneur's Guide to Circl",
    description: 'Learn how to use Circl to build your entrepreneurial knowledge and network while studying',
    steps: [...steps, createTutorialAccessStep(), createFinalCommunityStep()],
    estimatedDuration: 12 * 60,
    isRequired: true,
  };
}

// Get tutorial flow based on user type
export function getTutorialFlow(userType: UserType): TutorialFlow | null {
  switch (userType) {
    case 'entrepreneur':
      return createEntrepreneurTutorial();
    case 'student':
      return createStudentTutorial();
    case 'student-entrepreneur':
      return createStudentEntrepreneurTutorial();
    case 'mentor':
    case 'community-builder':
    case 'investor':
    case 'other':
      // For now, default to entrepreneur tutorial
      // TODO: Create specific tutorials for these user types
      return createEntrepreneurTutorial();
    default:
      return null;
  }
}
