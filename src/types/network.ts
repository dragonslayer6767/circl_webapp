export interface NetworkUser {
  user_id: number;
  email: string;
  name: string;
  profileImageURL?: string;
  image?: string; // Alias for profileImageURL
  businessStage?: string;
  businessName?: string;
  businessIndustry?: string;
  industry?: string; // Alias for businessIndustry
  tags?: string[];
  bio?: string;
  isStartup?: boolean;
  location?: string;
  connectionsCount?: number;
  circs?: number;
  personalityType?: string;
  birthday?: string;
  educationLevel?: string;
  institution?: string;
  skills?: string[];
  certificates?: string[];
  yearsExperience?: number;
  clubs?: string[];
  hobbies?: string[];
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
