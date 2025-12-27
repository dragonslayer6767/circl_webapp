export type NotificationType = 
  | 'mention'
  | 'like'
  | 'comment'
  | 'reply'
  | 'circle_invite'
  | 'circle_update'
  | 'event'
  | 'message'
  | 'connection'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatarUrl?: string;
  senderName?: string;
}
