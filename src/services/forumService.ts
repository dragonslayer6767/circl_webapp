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

// ============ Forum Service ============

export const forumService = {
  // Get all forum posts
  getPosts: async (category?: string, privacy?: string): Promise<ForumPost[]> => {
    const response = await api.get('/forum/get_posts/', {
      params: { category, privacy },
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

    const response = await api.post('/forum/create_post/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete forum post
  deletePost: async (postId: number): Promise<void> => {
    await api.delete(`/forum/delete_post/${postId}/`);
  },

  // Like a forum post
  likePost: async (postId: number): Promise<{ message: string }> => {
    const response = await api.post(`/forum/posts/${postId}/like/`);
    return response.data;
  },

  // Unlike a forum post — POST not DELETE
  unlikePost: async (postId: number): Promise<{ message: string }> => {
    const response = await api.post(`/forum/posts/${postId}/unlike/`);
    return response.data;
  },

  // Get comments on a post
  getComments: async (postId: number): Promise<Comment[]> => {
    const response = await api.get(`/forum/comments/${postId}/`);
    return response.data;
  },

  // Add a comment to a post
  createComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await api.post('/forum/comments/add/', { post_id: postId, content });
    return response.data;
  },

  // Like a comment
  likeComment: async (commentId: number): Promise<{ message: string }> => {
    const response = await api.post(`/forum/comments/${commentId}/like/`);
    return response.data;
  },

  // Unlike a comment — POST not DELETE
  unlikeComment: async (commentId: number): Promise<{ message: string }> => {
    const response = await api.post(`/forum/comments/${commentId}/unlike/`);
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
