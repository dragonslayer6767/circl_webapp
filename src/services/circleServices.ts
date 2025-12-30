import api from './authService';

// ============ TypeScript Interfaces ============

export interface Circle {
  id: number;
  name: string;
  description: string;
  image?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  member_count: number;
  is_member?: boolean;
}

export interface CircleCreatePayload {
  name: string;
  description: string;
  image?: File;
  is_public: boolean;
}

export interface CircleUpdatePayload {
  name?: string;
  description?: string;
  image?: File;
  is_public?: boolean;
}

export interface CircleMember {
  id: number;
  user_id: number;
  circle_id: number;
  joined_at: string;
  role: 'admin' | 'moderator' | 'member';
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
  };
}

export interface InviteLink {
  id: number;
  circle_id: number;
  token: string;
  code: string;
  created_at: string;
  expires_at?: string;
  max_uses?: number;
  uses: number;
  is_active: boolean;
}

// ============ Circle Service ============

export const circleService = {
  // Create a new circle
  createCircle: async (payload: CircleCreatePayload): Promise<Circle> => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    formData.append('is_public', payload.is_public.toString());
    
    if (payload.image) {
      formData.append('image', payload.image);
    }

    const response = await api.post('/api/circles/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all circles user is member of
  getCircles: async (): Promise<Circle[]> => {
    const response = await api.get('/api/circles/');
    return response.data;
  },

  // Get paginated circles
  getCirclesPaginated: async (page: number = 1, pageSize: number = 20): Promise<{ count: number; results: Circle[] }> => {
    const response = await api.get('/api/circles/', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // Get circle details
  getCircle: async (circleId: number): Promise<Circle> => {
    const response = await api.get(`/api/circles/${circleId}/`);
    return response.data;
  },

  // Update circle
  updateCircle: async (circleId: number, payload: CircleUpdatePayload): Promise<Circle> => {
    const formData = new FormData();
    
    if (payload.name) formData.append('name', payload.name);
    if (payload.description) formData.append('description', payload.description);
    if (payload.is_public !== undefined) formData.append('is_public', payload.is_public.toString());
    if (payload.image) formData.append('image', payload.image);

    const response = await api.put(`/api/circles/${circleId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete circle
  deleteCircle: async (circleId: number): Promise<void> => {
    await api.delete(`/api/circles/${circleId}/`);
  },

  // Join circle with access code
  joinCircle: async (circleId: number, accessCode?: string): Promise<{ message: string }> => {
    const response = await api.post(`/api/circles/${circleId}/join/`, {
      access_code: accessCode,
    });
    return response.data;
  },

  // Leave circle
  leaveCircle: async (circleId: number): Promise<{ message: string }> => {
    const response = await api.post(`/api/circles/${circleId}/leave/`);
    return response.data;
  },

  // Get circle members
  getCircleMembers: async (circleId: number, page: number = 1, pageSize: number = 50): Promise<{ count: number; results: CircleMember[] }> => {
    const response = await api.get(`/api/circles/${circleId}/members/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // Generate invite link
  generateInviteLink: async (circleId: number): Promise<InviteLink> => {
    const response = await api.post(`/api/circles/${circleId}/invite/`);
    return response.data;
  },

  // Accept invite link (public endpoint)
  acceptInvite: async (token: string): Promise<{ circle: Circle; message: string }> => {
    const response = await api.post(`/api/invite/${token}/accept/`);
    return response.data;
  },

  // Get circle image URL
  getCircleImageUrl: (circleImage: string | undefined): string | undefined => {
    if (!circleImage) return undefined;

    if (circleImage.startsWith('http://') || circleImage.startsWith('https://')) {
      return circleImage;
    }

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://circlapp.online';
    return `${baseURL}${circleImage}`;
  },
};
