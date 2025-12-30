import api from './authService';

export interface UserProfile {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  fullname: string;
  profile_image?: string;
  bio?: string;
  birthday?: string;
  personality_type?: string;
  institution_attended?: string;
  years_of_experience?: number;
  locations?: string[];
  skillsets?: string[];
  clubs?: string[];
  hobbies?: string[];
  entrepreneurial_history?: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface UserUpdatePayload {
  first_name?: string;
  last_name?: string;
  bio?: string;
  birthday?: string;
  personality_type?: string;
  institution_attended?: string;
  years_of_experience?: number;
  locations?: string[];
  skillsets?: string[];
  clubs?: string[];
  hobbies?: string[];
  entrepreneurial_history?: string;
}

export const userService = {
  // Get current user profile
  getCurrentProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/api/users/profile/');
    return response.data;
  },

  // Get specific user profile
  getUserProfile: async (userId: number): Promise<UserProfile> => {
    const response = await api.get(`/api/users/profile/${userId}/`);
    return response.data;
  },
  
  // Register new user
  register: async (data: UserRegistration): Promise<{ user: UserProfile; token: string }> => {
    const response = await api.post('/api/users/register/', data);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userId: number, profileData: UserUpdatePayload): Promise<UserProfile> => {
    const response = await api.put(`/api/users/${userId}/`, profileData);
    return response.data;
  },

  // Partially update user profile
  patchUserProfile: async (userId: number, profileData: Partial<UserUpdatePayload>): Promise<UserProfile> => {
    const response = await api.patch(`/api/users/${userId}/`, profileData);
    return response.data;
  },
  
  // Upload profile picture
  uploadProfileImage: async (userId: number, imageFile: File): Promise<{ profile_image: string }> => {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('image', imageFile);
    
    const response = await api.post('/api/users/upload_profile_image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete user account
  deleteAccount: async (userId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/users/${userId}/`);
    return response.data;
  },
  
  // Get profile image URL
  getProfileImageUrl: (profileImage: string | undefined): string | undefined => {
    if (!profileImage) return undefined;
    
    if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
      return profileImage;
    }
    
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://circlapp.online';
    return `${baseURL}${profileImage}`;
  },
};

