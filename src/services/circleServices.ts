import api from './authService';
import { Circle, CircleMember, Announcement, CreateCircleData } from '../types/circle';

// ============ Response Types ============

export interface ApiChannel {
  id: number;
  name: string;
  category?: string;
}

export interface ApiThread {
  id: number;
  author: string;
  author_id?: number;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  liked_by_user?: boolean;
}

export interface ApiMessage {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  created_at: string;
}

export interface CreateThreadPayload {
  circle_id: number;
  user_id: number;
  content: string;
  channel_id?: number;
}

export interface CreateCirclePayload {
  user_id: number;
  name: string;
  industry?: string;
  description: string;
  join_type?: string;
  channels?: string[];
  category?: string;
  is_private?: boolean;
  access_code?: string;
}

// ============ Circle Service ============

export const circleService = {
  // My circles
  getMyCircles: async (userId: number): Promise<Circle[]> => {
    const response = await api.get(`/circles/my_circles/${userId}/`);
    return response.data;
  },

  // Explore circles
  exploreCircles: async (userId: number): Promise<Circle[]> => {
    const response = await api.get(`/circles/explore_circles/${userId}/`);
    return response.data;
  },

  // Join a circle
  joinCircle: async (circleId: number, userId: number): Promise<{ message: string }> => {
    const response = await api.post('/circles/join_circle/', { circle_id: circleId, user_id: userId });
    return response.data;
  },

  // Leave a circle
  leaveCircle: async (circleId: number, userId: number): Promise<{ message: string }> => {
    const response = await api.post('/circles/leave_circle/', { circle_id: circleId, user_id: userId });
    return response.data;
  },

  // Create a circle with channels
  createCircle: async (payload: CreateCirclePayload): Promise<Circle> => {
    const response = await api.post('/circles/create_with_channels/', payload);
    return response.data;
  },

  // Delete a circle (admin only)
  deleteCircle: async (circleId: number, userId: number): Promise<void> => {
    await api.post('/circles/delete_circle/', { circle_id: circleId, user_id: userId });
  },

  // Get full circle details
  getCircleDetails: async (circleId: number, userId: number): Promise<Circle> => {
    const response = await api.get('/circles/get_circle_details/', {
      params: { circle_id: circleId, user_id: userId },
    });
    return response.data;
  },

  // Get circle members
  getMembers: async (circleId: number): Promise<CircleMember[]> => {
    const response = await api.get(`/circles/members/${circleId}/`);
    return response.data;
  },

  // Get channels in a circle
  getChannels: async (circleId: number): Promise<ApiChannel[]> => {
    const response = await api.get(`/circles/get_channels/${circleId}/`);
    return response.data;
  },

  // Get announcements
  getAnnouncements: async (circleId: number): Promise<Announcement[]> => {
    const response = await api.get(`/circles/get_announcements/${circleId}/`);
    return response.data;
  },

  // Post an announcement (admin)
  postAnnouncement: async (circleId: number, title: string, content: string): Promise<Announcement> => {
    const response = await api.post('/circles/post_announcement/', { circle_id: circleId, title, content });
    return response.data;
  },

  // Delete an announcement
  deleteAnnouncement: async (announcementId: number): Promise<void> => {
    await api.delete(`/circles/announcements/delete/${announcementId}/`);
  },

  // Get threads
  getThreads: async (circleId: number): Promise<ApiThread[]> => {
    const response = await api.get(`/circles/get_threads/${circleId}/`);
    return response.data;
  },

  // Create a thread
  createThread: async (payload: CreateThreadPayload): Promise<ApiThread> => {
    const response = await api.post('/circles/create_thread/', payload);
    return response.data;
  },

  // Toggle like on a thread
  toggleLike: async (threadId: number, userId: number): Promise<void> => {
    await api.post('/circles/toggle_like/', { thread_id: threadId, user_id: userId });
  },

  // Get comments on a thread
  getComments: async (threadId: number): Promise<unknown[]> => {
    const response = await api.get(`/circles/get_comments/${threadId}/`);
    return response.data;
  },

  // Post a comment on a thread
  postComment: async (threadId: number, userId: number, content: string): Promise<void> => {
    await api.post('/circles/post_comment/', { thread_id: threadId, user_id: userId, content });
  },

  // Get channel messages
  getMessages: async (channelId: number): Promise<ApiMessage[]> => {
    const response = await api.get(`/circles/get_messages/${channelId}/`);
    return response.data;
  },

  // Send a channel message — backend reads request.data["user_id"], requires FormData
  sendMessage: async (channelId: number, content: string): Promise<ApiMessage> => {
    const userId = localStorage.getItem('user_id');
    const formData = new FormData();
    formData.append('user_id', userId!);
    formData.append('channel_id', channelId.toString());
    formData.append('content', content);
    const response = await api.post('/circles/send_message/', formData);
    return response.data;
  },

  // Create an invite link
  createInviteLink: async (circleId: number): Promise<{ token: string; url: string }> => {
    const response = await api.post(`/circles/create_invite_link/${circleId}/`);
    return response.data;
  },

  // Preview an invite
  getInvitePreview: async (token: string): Promise<Circle> => {
    const response = await api.get(`/circles/invite_preview/${token}/`);
    return response.data;
  },

  // Accept invite
  resolveInvite: async (token: string): Promise<{ message: string }> => {
    const response = await api.post(`/circles/resolve_invite/${token}/`);
    return response.data;
  },

  // Upload circle image
  uploadCircleImage: async (circleId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('circle_id', circleId.toString());
    await api.post('/circles/upload_circle_image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export type { CreateCircleData };
