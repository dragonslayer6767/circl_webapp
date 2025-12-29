import api from './authService';

export interface UserProfile {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  fullname: string;
}

export const userService = {
  getUserProfile: async (userId: number): Promise<UserProfile> => {
    const response = await api.get(`/api/users/${userId}/`); // Use /api prefix for Django REST
    return response.data;
  },
  updateUserProfile: async (userId: number, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data;
  },
};

