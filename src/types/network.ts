export interface NetworkUser {
  user_id: number;
  email: string;
  name: string;
  profileImageURL?: string;
  businessStage?: string;
  businessName?: string;
  businessIndustry?: string;
  tags?: string[];
  bio?: string;
  isStartup?: boolean;
}

export interface Entrepreneur extends NetworkUser {
  businessStage: string;
  businessIndustry: string;
}

export interface Mentor extends NetworkUser {
  expertise?: string[];
  yearsOfExperience?: number;
}

export interface Connection extends NetworkUser {
  connectionDate?: string;
  lastInteraction?: string;
}

export type NetworkTab = 'connect' | 'mentors' | 'myNetwork';
