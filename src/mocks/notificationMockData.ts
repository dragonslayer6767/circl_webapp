/**
 * Mock notification data for testing deep linking
 * This file provides sample data for testing notifications before backend integration
 */

import { NotificationHelpers } from '../utils/notificationHelpers';

// ============================================================================
// MOCK USERS
// ============================================================================
export const mockUsers = {
  user1: { id: 'user-001', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  user2: { id: 'user-002', name: 'Marcus Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  user3: { id: 'user-003', name: 'Elena Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
  user4: { id: 'user-004', name: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  user5: { id: 'user-005', name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
};

// ============================================================================
// MOCK CONVERSATIONS (for Messages)
// ============================================================================
export const mockConversations = {
  conv1: {
    id: 'conv-001',
    participantId: mockUsers.user1.id,
    participantName: mockUsers.user1.name,
    lastMessage: 'I wanted to discuss the business proposal we talked about last week.',
  },
  conv2: {
    id: 'conv-002',
    participantId: mockUsers.user2.id,
    participantName: mockUsers.user2.name,
    lastMessage: 'Great! Let\'s schedule a call to discuss partnership opportunities.',
  },
  conv3: {
    id: 'conv-003',
    participantId: mockUsers.user3.id,
    participantName: mockUsers.user3.name,
    lastMessage: 'Thanks for the feedback on my startup pitch!',
  },
};

// ============================================================================
// MOCK FORUM POSTS (for Forum)
// ============================================================================
export const mockForumPosts = {
  post1: {
    id: 'post-001',
    title: 'Best practices for scaling a startup',
    author: mockUsers.user2.name,
    excerpt: 'Share your experiences with scaling from 0-100 employees',
  },
  post2: {
    id: 'post-002',
    title: 'Fundraising tips for Series A',
    author: mockUsers.user4.name,
    excerpt: 'What did you learn during your Series A fundraising journey?',
  },
  post3: {
    id: 'post-003',
    title: 'Building a strong company culture',
    author: mockUsers.user1.name,
    excerpt: 'How do you maintain culture while growing quickly?',
  },
  post4: {
    id: 'post-004',
    title: 'Remote team management strategies',
    author: mockUsers.user5.name,
    excerpt: 'Challenges and solutions for managing distributed teams',
  },
};

// ============================================================================
// MOCK CIRCLES
// ============================================================================
export const mockCircles = {
  circle1: {
    id: 'circle-001',
    name: 'Tech Founders',
    channels: {
      general: { id: 'channel-001', name: 'general' },
      introductions: { id: 'channel-002', name: 'introductions' },
      resources: { id: 'channel-003', name: 'resources' },
    },
    events: {
      event1: {
        id: 'event-001',
        name: 'Monthly Founder Meetup',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      },
      event2: {
        id: 'event-002',
        name: 'Q&A with Series A Investors',
        startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      },
    },
  },
  circle2: {
    id: 'circle-002',
    name: 'Women in Business',
    channels: {
      general: { id: 'channel-004', name: 'general' },
      mentorship: { id: 'channel-005', name: 'mentorship' },
    },
    events: {
      event3: {
        id: 'event-003',
        name: 'Leadership Workshop',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      },
    },
  },
  circle3: {
    id: 'circle-003',
    name: 'SaaS Builders',
    channels: {
      general: { id: 'channel-006', name: 'general' },
      product: { id: 'channel-007', name: 'product' },
    },
    events: {},
  },
};

// ============================================================================
// MOCK NOTIFICATIONS
// ============================================================================

/**
 * Generate all mock notifications using NotificationHelpers
 * These use the IDs defined above to create realistic deep links
 */
export const generateMockNotifications = () => {
  return [
    // MESSAGE NOTIFICATIONS
    NotificationHelpers.newMessage(
      mockUsers.user1.id,
      mockUsers.user1.name,
      'I wanted to discuss the business proposal we talked about last week.',
      mockConversations.conv1.id
    ),
    NotificationHelpers.newMessage(
      mockUsers.user2.id,
      mockUsers.user2.name,
      'Great! Let\'s schedule a call to discuss partnership opportunities.',
      mockConversations.conv2.id
    ),
    NotificationHelpers.newMessage(
      mockUsers.user3.id,
      mockUsers.user3.name,
      'Thanks for the feedback on my startup pitch!',
      mockConversations.conv3.id
    ),

    // FORUM NOTIFICATIONS
    NotificationHelpers.postLiked(
      mockUsers.user4.name,
      mockForumPosts.post1.id,
      mockForumPosts.post1.title
    ),
    NotificationHelpers.newComment(
      mockUsers.user2.name,
      mockForumPosts.post2.id,
      mockForumPosts.post2.title
    ),
    NotificationHelpers.commentReply(
      mockUsers.user5.name,
      mockForumPosts.post3.id,
      'That\'s a great point about psychological safety!'
    ),
    NotificationHelpers.mentioned(
      mockUsers.user1.name,
      mockForumPosts.post4.id,
      'forum'
    ),

    // NETWORK NOTIFICATIONS
    NotificationHelpers.connectionRequest(
      mockUsers.user3.id,
      mockUsers.user3.name
    ),
    NotificationHelpers.connectionAccepted(
      mockUsers.user4.id,
      mockUsers.user4.name
    ),

    // CIRCLE NOTIFICATIONS
    NotificationHelpers.circleInvite(
      mockCircles.circle1.id,
      mockCircles.circle1.name,
      mockUsers.user2.name
    ),
    NotificationHelpers.circleUpdate(
      mockCircles.circle2.id,
      mockCircles.circle2.name,
      'announcement'
    ),
    NotificationHelpers.circleEvent(
      mockCircles.circle1.id,
      mockCircles.circle1.events.event1.id,
      mockCircles.circle1.events.event1.name,
      mockCircles.circle1.events.event1.startTime
    ),
    NotificationHelpers.circleMessage(
      mockCircles.circle3.id,
      mockCircles.circle3.channels.general.id,
      mockCircles.circle3.name,
      mockUsers.user5.name,
      'Just launched our new feature! Check it out and let us know what you think.'
    ),

    // SYSTEM NOTIFICATION
    NotificationHelpers.systemNotification(
      'Welcome to Circl!',
      'Explore circles, connect with entrepreneurs, and grow your network.',
      '/network'
    ),
  ];
};

/**
 * Get a random subset of mock notifications for testing
 * @param count - Number of random notifications to return
 * @returns Array of random notifications
 */
export const getRandomMockNotifications = (count: number = 3) => {
  const all = generateMockNotifications();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, all.length));
};

/**
 * Get notifications filtered by type
 */
export const getMockNotificationsByType = (type: string) => {
  return generateMockNotifications().filter(n => n.type === type);
};

/**
 * Get all notifications grouped by section (for sidebar)
 */
export const getMockNotificationsBySection = () => {
  const all = generateMockNotifications();
  return {
    messages: all.filter(n => n.type === 'message'),
    forum: all.filter(n => ['comment', 'reply', 'like', 'mention'].includes(n.type)),
    circles: all.filter(n => ['circle_invite', 'circle_update', 'event'].includes(n.type)),
    network: all.filter(n => ['connection', 'mention'].includes(n.type)),
  };
};

/**
 * Sample data for testing deep links directly
 * Provides URLs that can be tested in the browser
 */
export const deepLinkTestUrls = {
  messages: `/messages?conversation=${mockConversations.conv1.id}`,
  forum: `/forum?post=${mockForumPosts.post1.id}`,
  forumWithScroll: `/forum?post=${mockForumPosts.post2.id}#comments`,
  circleOverview: `/circles/${mockCircles.circle1.id}`,
  circleEvent: `/circles/${mockCircles.circle1.id}?event=${mockCircles.circle1.events.event1.id}`,
  circleChannel: `/circles/${mockCircles.circle3.id}/channel/${mockCircles.circle3.channels.general.id}`,
  network: `/network?profile=${mockUsers.user3.id}`,
  networkConnectionRequests: `/network?view=requests`,
};

/**
 * Export all mock data as a single object for convenience
 */
export const mockNotificationData = {
  users: mockUsers,
  conversations: mockConversations,
  forumPosts: mockForumPosts,
  circles: mockCircles,
  generateMockNotifications,
  getRandomMockNotifications,
  getMockNotificationsByType,
  getMockNotificationsBySection,
  deepLinkTestUrls,
};
