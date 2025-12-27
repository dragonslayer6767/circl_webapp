# Notification Deep Linking System

## Overview

The Circl webapp notification system includes intelligent deep linking that automatically navigates users to the exact location where the notification originated. This works seamlessly with backend integration.

## Architecture

### Components

1. **NotificationContext** (`src/context/NotificationContext.tsx`)
   - Manages global notification state
   - Handles localStorage persistence
   - Calculates badge counts per section
   - Triggers toast notifications

2. **NotificationHelpers** (`src/utils/notificationHelpers.ts`)
   - Helper functions for creating notifications with proper deep links
   - Type-safe and backend-ready
   - Handles all notification types

3. **NotificationCenter** (`src/components/common/NotificationCenter.tsx`)
   - Displays all notifications in a dropdown
   - Shows unread count badge
   - Navigate to notifications when clicked

4. **Sidebar Badges** (`src/components/Layout/Sidebar.tsx`)
   - Displays count badges on navigation items
   - Sections: Messages, Network, Circles, Home (Forum)
   - Red animated badges for visual prominence

## Deep Linking URL Patterns

### Messages
```
Private Messages:
  /messages?conversation=CONVERSATION_ID
  
Circle Channel Messages:
  /circles/CIRCLE_ID/channel/CHANNEL_ID
```

### Forum
```
Posts:
  /forum?post=POST_ID
  
Comments/Replies:
  /forum?post=POST_ID  (scrolls to specific comment with query params)
```

### Network
```
User Profiles:
  /network?profile=USER_ID
```

### Circles
```
Circle Overview:
  /circles/CIRCLE_ID
  
Circle Events:
  /circles/CIRCLE_ID?event=EVENT_ID
  
Circle Announcements:
  /circles/CIRCLE_ID?section=announcements
```

## Implementation Guide

### For Backend Developers

When your backend sends a notification event, include the necessary IDs:

#### Example: Message Notification
```json
{
  "type": "message",
  "senderId": "user-123",
  "senderName": "Sarah Chen",
  "messagePreview": "Hey, how are you?",
  "conversationId": "conv-456"
}
```

#### Example: Post Like Notification
```json
{
  "type": "like",
  "likerId": "user-789",
  "likerName": "James Wilson",
  "postId": 42,
  "postTitle": "My startup journey"
}
```

#### Example: Circle Invite Notification
```json
{
  "type": "circle_invite",
  "circleId": "circle-tech-entrepreneurs",
  "circleName": "Tech Entrepreneurs",
  "inviterId": "user-001",
  "inviterName": "Robert Chen"
}
```

### For Frontend Developers

Use the `NotificationHelpers` utility to create notifications:

```typescript
import { useNotification } from '@/context/NotificationContext';
import { NotificationHelpers } from '@/utils/notificationHelpers';

export function MyComponent() {
  const { addNotification } = useNotification();

  // When receiving a message from backend
  const handleNewMessage = (data) => {
    addNotification(
      NotificationHelpers.newMessage(
        data.senderId,
        data.senderName,
        data.messagePreview,
        data.conversationId  // This creates: /messages?conversation=conv-456
      )
    );
  };

  // When user likes a post
  const handlePostLike = (data) => {
    addNotification(
      NotificationHelpers.postLiked(
        data.likerName,
        data.postId,
        data.postTitle  // This creates: /forum?post=42
      )
    );
  };

  // When someone invites user to circle
  const handleCircleInvite = (data) => {
    addNotification(
      NotificationHelpers.circleInvite(
        data.circleId,
        data.circleName,
        data.inviterName  // This creates: /circles/circle-tech-entrepreneurs
      )
    );
  };
}
```

## Available Helper Functions

### Message Notifications
- `NotificationHelpers.newMessage(senderId, senderName, messagePreview, conversationId?)`
- `NotificationHelpers.circleMessage(circleId, channelId, circleName, senderName, messagePreview)`

### Forum Notifications
- `NotificationHelpers.postLiked(likerName, postId, postTitle?)`
- `NotificationHelpers.newComment(commenterName, postId, postTitle?)`
- `NotificationHelpers.commentReply(replierName, postId, replyPreview?)`
- `NotificationHelpers.mentioned(mentionerName, postId, context?)`

### Network Notifications
- `NotificationHelpers.connectionRequest(requesterId, requesterName)`
- `NotificationHelpers.connectionAccepted(accepterId, accepterName)`

### Circle Notifications
- `NotificationHelpers.circleInvite(circleId, circleName, inviterName?)`
- `NotificationHelpers.circleUpdate(circleId, circleName, updateType)`
- `NotificationHelpers.circleEvent(circleId, eventId, eventName, startTime)`

### System Notifications
- `NotificationHelpers.systemNotification(title, message, actionUrl?)`

## How It Works

### 1. Backend Sends Notification
```
Backend API → WebSocket/HTTP → Frontend
{
  type: 'message',
  conversationId: 'conv-456',
  senderId: 'user-123',
  senderName: 'Sarah'
}
```

### 2. Frontend Processes & Stores
```
NotificationHelpers.newMessage(...) 
  ↓
Creates: { type: 'message', actionUrl: '/messages?conversation=conv-456', ... }
  ↓
addNotification() → Context updates state
  ↓
Toast popup shows in top-right
  ↓
Notification stored in localStorage
```

### 3. User Clicks Notification
```
User clicks notification in dropdown
  ↓
handleNotificationClick() triggered
  ↓
navigate(actionUrl) → /messages?conversation=conv-456
  ↓
Messages page loads with conversation open
```

### 4. Badge Updates
```
New notification arrives
  ↓
NotificationContext updates
  ↓
Sidebar re-renders with new badge counts
  ↓
Red badge with count appears on relevant section
```

## Testing

### Manual Testing
1. Navigate to any page in the app
2. Click "Test Random Notification" in bottom-right
3. Verify toast appears in top-right
4. Click notification in bell icon dropdown
5. Verify navigation to correct page with deep link

### Testing Different Types
```typescript
// In NotificationTester component
const testNotifications = [
  NotificationHelpers.newMessage('user-001', 'Alex', 'Hi there', 'conv-123'),
  NotificationHelpers.postLiked('Sarah', 42, 'Great post'),
  NotificationHelpers.circleInvite('circle-tech', 'Tech Entrepreneurs', 'John'),
  // ... more examples
];
```

## Badge Calculation

The sidebar shows badge counts for each section:

- **Messages**: Count of unread `message` notifications
- **Network**: Count of unread `connection` + `mention` notifications
- **Circles**: Count of unread `circle_invite` + `circle_update` + `event` notifications
- **Home** (Forum): Count of unread `comment` + `reply` + `like` notifications

Badge counts are stored in context and persisted to localStorage.

## Persistent Notifications

All notifications are persisted to localStorage with the key `circl_notifications`. This means:

- Users see old notifications when they return to the app
- Unread state is preserved
- Notifications can be marked as read
- Notifications can be cleared

## URL Query Parameters

The deep linking system uses query parameters for flexible navigation:

```
/messages?conversation=conv-456
/forum?post=42
/network?profile=user-123
/circles/circle-id?event=event-456
/circles/circle-id?section=announcements
```

These parameters can be processed by page components to:
- Scroll to specific content
- Open modals or panels
- Filter list views
- Pre-load specific data

## Future Enhancements

1. **Real-time Updates**: WebSocket connection for instant notifications
2. **Sound/Vibration**: Audio alerts for important notifications
3. **Notification Grouping**: Combine similar notifications
4. **Smart Notifications**: ML-based priority ranking
5. **Notification Preferences**: User-configurable notification rules
6. **Read Receipts**: Track when notifications are read
7. **Notification History**: Full archive with search

## Troubleshooting

### Notifications Not Showing
- Check `NotificationContext` is wrapping the app in `App.tsx`
- Verify `AppToaster` component is rendered
- Check browser console for errors

### Deep Links Not Working
- Ensure URLs match your route definitions
- Check that pages handle query parameters
- Test with NotificationTester component

### Badge Counts Incorrect
- Check notification type matches expected value
- Verify read/unread state is updating
- Clear localStorage and refresh

## Related Files

- `src/context/NotificationContext.tsx` - State management
- `src/utils/notificationHelpers.ts` - Helper functions
- `src/components/common/NotificationCenter.tsx` - Notification dropdown
- `src/components/common/NotificationTester.tsx` - Testing component
- `src/components/Layout/Sidebar.tsx` - Badge display
- `src/types/notifications.ts` - TypeScript definitions
