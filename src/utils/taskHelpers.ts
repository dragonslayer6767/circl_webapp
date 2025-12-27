import { TaskItem, TaskStatus, TaskPriority } from '../types/dashboard';

// Sample tasks for demonstration
export const sampleTasks: TaskItem[] = [
  {
    id: '1',
    title: 'Review marketing strategy',
    description: 'Analyze current marketing approach and identify improvement opportunities',
    status: TaskStatus.InProgress,
    projectId: 'proj-1',
    assignees: ['user-1', 'user-2'],
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-01'),
    priority: TaskPriority.High,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    title: 'Update financial projections',
    description: 'Revise Q1 and Q2 financial forecasts based on recent performance',
    status: TaskStatus.NotStarted,
    projectId: 'proj-1',
    assignees: ['user-3'],
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-28'),
    priority: TaskPriority.Critical,
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    title: 'Schedule team meeting',
    description: 'Coordinate with all team members for monthly sync',
    status: TaskStatus.InProgress,
    projectId: 'proj-2',
    assignees: ['user-1'],
    startDate: new Date('2024-01-16'),
    endDate: new Date('2024-01-22'),
    priority: TaskPriority.Medium,
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '4',
    title: 'Prepare pitch deck',
    description: 'Create comprehensive presentation for investor meeting',
    status: TaskStatus.NotStarted,
    projectId: 'proj-3',
    assignees: ['user-1', 'user-2', 'user-4'],
    startDate: new Date('2024-01-18'),
    endDate: new Date('2024-02-05'),
    priority: TaskPriority.High,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    title: 'User feedback analysis',
    description: 'Compile and analyze feedback from beta testers',
    status: TaskStatus.Paused,
    projectId: 'proj-2',
    assignees: ['user-2', 'user-3'],
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-25'),
    priority: TaskPriority.Medium,
    createdAt: new Date('2024-01-08'),
  },
];

// Initialize tasks in localStorage for demo purposes
export function initializeSampleTasks() {
  const existing = localStorage.getItem('userCircleTasks');
  if (!existing) {
    localStorage.setItem('userCircleTasks', JSON.stringify(sampleTasks));
  }
}

// Get tasks from localStorage
export function getTasks(): TaskItem[] {
  const stored = localStorage.getItem('userCircleTasks');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse tasks:', e);
      return [];
    }
  }
  return [];
}

// Save tasks to localStorage
export function saveTasks(tasks: TaskItem[]) {
  localStorage.setItem('userCircleTasks', JSON.stringify(tasks));
}

// Add a new task
export function addTask(task: TaskItem) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

// Update a task
export function updateTask(taskId: string, updates: Partial<TaskItem>) {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
  }
}

// Delete a task
export function deleteTask(taskId: string) {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== taskId);
  saveTasks(filtered);
}

// Clear all tasks (for testing)
export function clearTasks() {
  localStorage.removeItem('userCircleTasks');
}
