# Notification Types Documentation

This document outlines all notification types available in the Circl webapp and where they originate.

## Notification Types by Category

### Messages Notifications
1. **message** - New direct message received
   - Context: When someone sends a DM
   - Action: Navigate to `/messages` or specific chat thread
   - Icon: Envelope/Message
   - Color: Indigo

2. **message_read** - Message was read by recipient
   - Context: When your sent message is read
   - Action: Navigate to `/messages`
   - Icon: Check mark
   - Color: Blue

3. **typing** - Someone is typing a message
   - Context: Real-time indicator when user types in chat
   - Action: No navigation needed
   - Icon: Dots animation
   - Color: Gray

### Network Notifications
4. **connection** - New connection request or connection accepted
   - Context: When someone requests to connect or accepts your request
   - Action: Navigate to `/network`
   - Icon: Plus in circle or handshake
   - Color: Teal

5. **profile_view** - Someone viewed your profile
   - Context: When a user visits your profile
   - Action: Navigate to `/network`
   - Icon: Eye
   - Color: Blue

6. **mention** - You were mentioned in a post/comment
   - Context: When someone tags you (@mention) in forum or circles
   - Action: Navigate to relevant post/thread
   - Icon: @ symbol
   - Color: Green

### Circles Notifications
7. **circle_invite** - You were invited to join a circle
   - Context: When circle admin/owner invites you
   - Action: Navigate to `/circles`
   - Icon: Users/Group
   - Color: Purple

8. **circle_update** - New activity in your circles
   - Context: Posts, announcements, or updates in circles you're in
   - Action: Navigate to `/circles`
   - Icon: Circle/Ring
   - Color: Purple

9. **event** - New event in a circle
   - Context: When an event is created in a circle you're part of
   - Action: Navigate to specific circle event
   - Icon: Calendar
   - Color: Orange

10. **dues_reminder** - Circle dues are due soon
    - Context: Payment reminder for paid circles
    - Action: Navigate to circle dues page
    - Icon: Credit card
    - Color: Red/Orange

### Forum Notifications
11. **comment** - New comment on your post
    - Context: When someone comments on something you posted
    - Action: Navigate to `/forum` and specific post
    - Icon: Chat bubble
    - Color: Blue

12. **reply** - Someone replied to your comment
    - Context: When someone responds to your comment
    - Action: Navigate to `/forum` and specific thread
    - Icon: Chat bubble with arrow
    - Color: Blue

13. **like** - Someone liked your post/comment
    - Context: When a post or comment receives a like
    - Action: Navigate to `/forum`
    - Icon: Heart
    - Color: Red

### System Notifications
14. **system** - System/admin notification
    - Context: Maintenance alerts, policy updates, feature announcements
    - Action: Navigate to settings or notification center
    - Icon: Bell/Info
    - Color: Gray

15. **tutorial** - Tutorial/onboarding notification
    - Context: Tips and onboarding messages
    - Action: Navigate to tutorial or feature page
    - Icon: Lightbulb
    - Color: Yellow

## Sidebar Badge System

The sidebar will display notification badges for each section:

- **Messages**: Badge with count of unread messages
- **Network**: Badge with count of connection requests + profile views
- **Circles**: Badge with count of invites + updates + events
- **Forum**: Badge with count of comments + replies + likes + mentions

### Badge Behavior
- Red background with white number
- Shows only if count > 0
- Number shows actual count (capped at 99+)
- Animated pulse on new notifications

## Toast Popup Notifications

When a new notification arrives, a toast popup appears in the **top-right corner** with:

- **Icon**: Type-specific icon
- **Title**: Notification title
- **Message**: Notification message (max 2 lines)
- **Timestamp**: Relative time (e.g., "Just now", "5m ago")
- **Close button**: X to dismiss
- **Duration**: Auto-dismiss after 4-5 seconds (varies by type)

### Toast Types by Notification Type
- **Important** (5 seconds): circle_invite, event, dues_reminder, connection, message
- **Normal** (4 seconds): comment, reply, like, mention, circle_update, profile_view
- **Background** (3 seconds): message_read, typing, system, tutorial

## Storage & Persistence

Notifications should be:
- Stored in a context (NotificationContext)
- Persisted in localStorage for session continuity
- Synced with backend API (future implementation)
- Cleared when marked as read

## Implementation Priority

### Phase 1 (Current)
- Messages: message, message_read
- Network: connection, mention
- Circles: circle_invite, circle_update, event
- Forum: comment, reply, like
- System: system

### Phase 2 (Future)
- Messages: typing
- Network: profile_view
- Circles: dues_reminder
- System: tutorial

## Notification Display in Notification Center

The main Notification Center dropdown will show:
- All 15+ notification types
- Color-coded icons
- Sender information (avatar, name)
- Relative timestamps
- Unread indicators
- Mark as read functionality
- Filter/search capabilities (future)
