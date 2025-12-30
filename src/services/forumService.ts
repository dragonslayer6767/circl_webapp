import api from './authService';

// ============ TypeScript Interfaces ============

export interface ForumPost {
  id: number;
  user_id: number;
  user: string;
  content: string;
  category: string;
  privacy: string;
  image?: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  liked_by_user: boolean;
  comment_count: number;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  user: string;
  content: string;
  created_at: string;
  like_count: number;
  liked_by_user: boolean;
}

export interface CreatePostPayload {
  content: string;
  category: string;
  privacy: string;
  image?: File;
}

export interface CreateCommentPayload {
  content: string;
}

// ============ Forum Service ============

export const forumService = {
  // Get all forum posts
  getPosts: async (category?: string, privacy?: string): Promise<ForumPost[]> => {
    const response = await api.get('/api/forum/posts', {
      params: { category, privacy },
    });
    return response.data;
  },

  // Get paginated forum posts
  getPostsPaginated: async (
    page: number = 1,
    pageSize: number = 20,
    category?: string,
    privacy?: string
  ): Promise<{ count: number; results: ForumPost[] }> => {
    const response = await api.get('/api/forum/posts', {
      params: { page, page_size: pageSize, category, privacy },
    });
    return response.data;
  },

  // Create a new forum post
  createPost: async (payload: CreatePostPayload): Promise<ForumPost> => {
    const formData = new FormData();
    formData.append('content', payload.content);
    formData.append('category', payload.category);
    formData.append('privacy', payload.privacy);

    if (payload.image) {
      formData.append('image', payload.image);
    }

    const response = await api.post('/api/forum/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get single post details
  getPost: async (postId: number): Promise<ForumPost> => {
    const response = await api.get(`/api/forum/posts/${postId}/`);
    return response.data;
  },

  // Update forum post
  updatePost: async (postId: number, payload: Partial<CreatePostPayload>): Promise<ForumPost> => {
    const formData = new FormData();

    if (payload.content) formData.append('content', payload.content);
    if (payload.category) formData.append('category', payload.category);
    if (payload.privacy) formData.append('privacy', payload.privacy);
    if (payload.image) formData.append('image', payload.image);

    const response = await api.put(`/api/forum/posts/${postId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete forum post
  deletePost: async (postId: number): Promise<void> => {
    await api.delete(`/api/forum/posts/${postId}/`);
  },

  // Like a forum post
  likePost: async (postId: number): Promise<{ message: string }> => {
    const response = await api.post(`/api/forum/posts/${postId}/like/`);
    return response.data;
  },

  // Unlike a forum post
  unlikePost: async (postId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/forum/posts/${postId}/like/`);
    return response.data;
  },

  // Get comments on a post
  getComments: async (postId: number, page: number = 1, pageSize: number = 50): Promise<{ count: number; results: Comment[] }> => {
    const response = await api.get(`/api/forum/posts/${postId}/comments/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // Create a comment on a post
  createComment: async (postId: number, payload: CreateCommentPayload): Promise<Comment> => {
    const response = await api.post(`/api/forum/posts/${postId}/comments/`, {
      content: payload.content,
    });
    return response.data;
  },

  // Update a comment
  updateComment: async (postId: number, commentId: number, payload: CreateCommentPayload): Promise<Comment> => {
    const response = await api.put(`/api/forum/posts/${postId}/comments/${commentId}/`, {
      content: payload.content,
    });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (postId: number, commentId: number): Promise<void> => {
    await api.delete(`/api/forum/posts/${postId}/comments/${commentId}/`);
  },

  // Like a comment
  likeComment: async (postId: number, commentId: number): Promise<{ message: string }> => {
    const response = await api.post(`/api/forum/posts/${postId}/comments/${commentId}/like/`);
    return response.data;
  },

  // Unlike a comment
  unlikeComment: async (postId: number, commentId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/forum/posts/${postId}/comments/${commentId}/like/`);
    return response.data;
  },

  // Get post image URL
  getPostImageUrl: (postImage: string | undefined): string | undefined => {
    if (!postImage) return undefined;

    if (postImage.startsWith('http://') || postImage.startsWith('https://')) {
      return postImage;
    }

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://circlapp.online';
    return `${baseURL}${postImage}`;
  },
};
