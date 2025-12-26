// Circle Type Definitions

export interface Channel {
  id: number;
  name: string;
  circleId: number;
  position: number;
  isModeratorOnly?: boolean;
}

export interface ChannelCategory {
  id: number | null; // null for Uncategorized
  name: string;
  position: number;
  channels: Channel[];
}

export interface Announcement {
  id: number;
  user: string;
  title: string;
  content: string;
  announced_at: string;
}

export type JoinType = 'Join Now' | 'Apply Now' | 'Request to Join';

export interface Circle {
  id: number;
  name: string;
  industry: string;
  pricing: string;
  description: string;
  join_type: JoinType;
  member_count: number;
  is_private: boolean;
  profile_image_url?: string;
  creator_id: number;
  is_moderator: boolean;
  has_dashboard?: boolean;
  is_dashboard_public?: boolean;
  dues_amount?: number;
  has_stripe_account?: boolean;
  access_code?: string;
  channels?: string[];
}

export interface CircleMember {
  id: number;
  user_id: number;
  full_name: string;
  profile_image?: string;
  is_moderator?: boolean;
}

export interface CreateCircleData {
  user_id: number;
  name: string;
  industry: string;
  description: string;
  join_type: string;
  channels: string[];
  category?: string;
  is_private: boolean;
  access_code?: string;
}
