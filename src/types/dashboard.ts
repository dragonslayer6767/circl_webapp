export interface DashboardSummary {
  total_events: number;
  total_points: number;
  total_members: number;
  total_revenue: number;
  total_projects?: number;
  event_type_distribution: { [key: string]: number };
}

export interface LeaderboardEntry {
  user_id: number;
  name: string;
  email: string;
  points: number;
}

export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Paused = 'Paused',
  Blocked = 'Blocked',
  Completed = 'Completed'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum ProjectColor {
  Blue = 'Blue',
  Green = 'Green',
  Purple = 'Purple',
  Orange = 'Orange',
  Red = 'Red',
  Teal = 'Teal'
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId?: string;
  assignees: string[];
  startDate: Date;
  endDate: Date;
  priority: TaskPriority;
  createdAt: Date;
  completedAt?: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: ProjectColor;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  tasks: TaskItem[];
  createdAt: Date;
}
