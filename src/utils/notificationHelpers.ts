// Notification helper functions for creating notifications with proper deep links

import { NotificationType } from '../types/notifications';

interface NotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  senderName?: string;
  avatarUrl?: string;
}

/**
 * Helper functions to create notifications with proper deep linking
 */
export const NotificationHelpers = {
  // Message notifications
  newMessage: (_senderId: string, senderName: string, messagePreview: string, conversationId?: string): NotificationParams => ({
    type: 'message',
    title: 'New Message',
    message: `${senderName}: "${messagePreview}"`,
    actionUrl: conversationId ? `/messages?conversation=${conversationId}` : '/messages',
    senderName,
  }),

  // Forum notifications
  postLiked: (likerName: string, postId: string, postTitle?: string): NotificationParams => ({
    type: 'like',
    title: 'Post Liked',
    message: `${likerName} liked your post${postTitle ? ` "${postTitle}"` : ''}`,
    actionUrl: `/forum?post=${postId}`,
    senderName: likerName,
  }),

  newComment: (commenterName: string, postId: string, postTitle?: string): NotificationParams => ({
    type: 'comment',
    title: 'New Comment',
    message: `${commenterName} commented on your post${postTitle ? ` "${postTitle}"` : ''}`,
    actionUrl: `/forum?post=${postId}`,
    senderName: commenterName,
  }),

  commentReply: (replierName: string, postId: string, replyPreview?: string): NotificationParams => ({
    type: 'reply',
    title: 'New Reply',
    message: `${replierName} replied to your comment${replyPreview ? `: "${replyPreview}"` : ''}`,
    actionUrl: `/forum?post=${postId}`,
    senderName: replierName,
  }),

  mentioned: (mentionerName: string, postId: string, context: 'forum' | 'circle' = 'forum'): NotificationParams => ({
    type: 'mention',
    title: 'You were mentioned',
    message: `${mentionerName} mentioned you in a ${context}`,
    actionUrl: context === 'forum' ? `/forum?post=${postId}` : `/circles?post=${postId}`,
    senderName: mentionerName,
  }),

  // Network notifications
  connectionRequest: (requesterId: string, requesterName: string): NotificationParams => ({
    type: 'connection',
    title: 'New Connection Request',
    message: `${requesterName} wants to connect with you`,
    actionUrl: `/network?profile=${requesterId}`,
    senderName: requesterName,
  }),

  connectionAccepted: (accepterId: string, accepterName: string): NotificationParams => ({
    type: 'connection',
    title: 'Connection Accepted',
    message: `${accepterName} accepted your connection request`,
    actionUrl: `/network?profile=${accepterId}`,
    senderName: accepterName,
  }),

  // Circle notifications
  circleInvite: (circleId: string, circleName: string, inviterName?: string): NotificationParams => ({
    type: 'circle_invite',
    title: 'Circle Invitation',
    message: inviterName 
      ? `${inviterName} invited you to join "${circleName}"`
      : `You were invited to join "${circleName}"`,
    actionUrl: `/circles/${circleId}`,
    senderName: inviterName,
  }),

  circleUpdate: (circleId: string, circleName: string, updateType: string): NotificationParams => ({
    type: 'circle_update',
    title: 'Circle Update',
    message: `New ${updateType} in ${circleName}`,
    actionUrl: `/circles/${circleId}`,
  }),

  circleEvent: (circleId: string, eventId: string, eventName: string, startTime: string): NotificationParams => ({
    type: 'event',
    title: 'Event Reminder',
    message: `"${eventName}" starts ${startTime}`,
    actionUrl: `/circles/${circleId}?event=${eventId}`,
  }),

  circleMessage: (circleId: string, channelId: string, circleName: string, senderName: string, messagePreview: string): NotificationParams => ({
    type: 'message',
    title: `New message in ${circleName}`,
    message: `${senderName}: "${messagePreview}"`,
    actionUrl: `/circles/${circleId}/channel/${channelId}`,
    senderName,
  }),

  // System notifications
  systemNotification: (title: string, message: string, actionUrl?: string): NotificationParams => ({
    type: 'system',
    title,
    message,
    actionUrl,
  }),
};

/**
 * Example usage:
 * 
 * const { addNotification } = useNotification();
 * 
 * // When someone sends a message
 * addNotification(NotificationHelpers.newMessage('user-123', 'Alex Smith', 'Hey, want to grab coffee?', 'conv-456'));
 * 
 * // When someone likes your post
 * addNotification(NotificationHelpers.postLiked('Sarah Chen', 789, 'My startup journey'));
 * 
 * // When someone invites you to a circle
 * addNotification(NotificationHelpers.circleInvite('circle-123', 'Tech Entrepreneurs', 'John Doe'));
 * 
 * // When there's a new message in a circle channel
 * addNotification(NotificationHelpers.circleMessage('circle-123', 'channel-456', 'Business Network', 'Emma', 'Check out this opportunity!'));
 */
