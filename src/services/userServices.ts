import api from './authService';

// ============ Interfaces ============

export interface UserProfile {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  fullname: string;
  bio?: string;
  profile_image?: string;
}

export interface NetworkContact {
  user_id: number;
  name: string;
  email: string;
  profile_image?: string;
  last_message?: string;
  last_message_timestamp?: string;
  unread_count?: number;
}

export interface DirectMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  timestamp: string;
  is_read: boolean;
}

export interface BlockedUser {
  id: number;
  name: string;
  company?: string;
}

// ============ User Service ============

export const userService = {
  // Profile
  getUserProfile: async (userId: number): Promise<UserProfile> => {
    const response = await api.get(`/users/profile/${userId}/`);
    return response.data;
  },

  updateUserProfile: async (userId: number, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.post('/users/update-user-profile/', { user_id: userId, ...profileData });
    return response.data;
  },

  updateUserBio: async (userId: number, bio: string): Promise<void> => {
    await api.post('/users/update-user-bio/', { user_id: userId, bio });
  },

  // Onboarding: personal details (birthday, personality type)
  updatePersonalDetails: async (userId: number, birthday: string, personalityType: string): Promise<void> => {
    await api.post('/users/update-personal-details/', {
      user_id: userId,
      birthday,
      personality_type: personalityType,
    });
  },

  // Onboarding: skills/location
  updateSkillsInterests: async (userId: number, locations: string[]): Promise<void> => {
    await api.post('/users/update-skills-interests/', { user_id: userId, locations });
  },

  // Onboarding + Settings: profile picture upload
  uploadProfileImage: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('image', file);
    await api.post('/users/upload_profile_image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Settings: change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/users/change_password/', { old_password: oldPassword, new_password: newPassword });
  },

  // Settings: become mentor
  applyMentor: async (name: string, industry: string, reason: string): Promise<void> => {
    await api.post('/users/apply_mentor/', { name, industry, reason });
  },

  // Settings: blocked users
  getBlockedUsers: async (): Promise<BlockedUser[]> => {
    const response = await api.get('/users/get_blocked_users/');
    return response.data;
  },

  blockUser: async (userId: number): Promise<void> => {
    await api.post('/users/block_user/', { user_id: userId });
  },

  unblockUser: async (userId: number): Promise<void> => {
    await api.post('/users/unblock_user/', { user_id: userId });
  },

  // Settings: delete account
  requestDeleteAccount: async (): Promise<void> => {
    await api.post('/users/request_delete_account/');
  },

  // Settings: feedback/report
  submitFeedback: async (subject: string, message: string): Promise<void> => {
    await api.post('/users/submit_feedback/', { subject, message });
  },

  // Messaging: get network (contacts user can DM)
  getNetwork: async (userId: number): Promise<NetworkContact[]> => {
    const response = await api.get(`/users/get_network/${userId}/`);
    return response.data;
  },

  // Messaging: get DM thread with another user
  getMessages: async (userId: number): Promise<DirectMessage[]> => {
    const response = await api.get(`/users/get_messages/${userId}/`);
    return response.data;
  },

  // Messaging: send a DM
  sendMessage: async (recipientId: number, content: string): Promise<DirectMessage> => {
    const senderId = parseInt(localStorage.getItem('user_id') || '0', 10);
    const response = await api.post('/users/send_message/', {
      sender_id: senderId,
      receiver_id: recipientId,
      content,
    });
    return response.data;
  },

  // Messaging: mark thread as read
  markMessagesRead: async (userId: number): Promise<void> => {
    await api.post('/users/mark_messages_read/', { user_id: userId });
  },
};
