export interface ForumPost {
  id: number;
  user: string;
  user_id: number;
  profileImage?: string;
  content: string;
  category: string;
  privacy: string;
  image?: string;
  created_at: string;
  comment_count?: number;
  like_count: number;
  liked_by_user: boolean;
  is_mentor?: boolean;
}

export interface Comment {
  id: number;
  user: string;
  text: string;
  created_at: string;
  like_count: number;
  liked_by_user: boolean;
  profile_image?: string;
}
