export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  timestamp: string;
  is_read: boolean;
}

export interface Conversation {
  userId: string;
  userName: string;
  userImage?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface NetworkUser {
  id: string;
  name: string;
  email: string;
  profile_image?: string;
  company?: string;
}
