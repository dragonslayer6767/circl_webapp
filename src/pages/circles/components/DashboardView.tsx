import { useState, useEffect } from 'react';
import { COLORS } from '../../../utils/colors';
import {
  DashboardSummary,
  LeaderboardEntry,
  Project,
  TaskItem,
  TaskStatus,
  TaskPriority,
  ProjectColor
} from '../../../types/dashboard';
import KanbanBoard from './KanbanBoard.tsx';
import ProjectGrid from './ProjectGrid.tsx';

interface DashboardViewProps {
  circleId: number;
  circleName: string;
  circleIndustry: string;
  circlePricing: string;
  memberCount: number;
  isModerator: boolean;
  isPanel?: boolean;
}

type ViewMode = 'kanban' | 'projects';
type TimeFrame = 'all' | 'weekly' | 'monthly';

export default function DashboardView({
  circleId,
  circleName,
  circleIndustry,
  circlePricing,
  memberCount,
  isModerator,
  isPanel = false
}: DashboardViewProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [projects, setProjects] = useState<Project[]>([]);
  const [standaloneTasks, setStandaloneTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    loadMockData();
  }, [circleId]);

  const loadMockData = () => {
    // Mock dashboard summary
    const mockSummary: DashboardSummary = {
      total_events: 5,
      total_points: 245,
      total_members: memberCount,
      total_revenue: 0,
      total_projects: 2,
      event_type_distribution: {
        workshop: 5
      }
    };

    // Mock leaderboard
    const mockLeaderboard: LeaderboardEntry[] = [
      { user_id: 1, name: 'Alex Johnson', email: 'alex@example.com', points: 150 },
      { user_id: 2, name: 'Sam Smith', email: 'sam@example.com', points: 120 },
      { user_id: 3, name: 'Jordan Lee', email: 'jordan@example.com', points: 95 }
    ];

    // Mock projects with tasks
    const mockProjects: Project[] = [
      {
        id: 'proj-1',
        name: 'Q1 Marketing Campaign',
        description: 'Launch new marketing initiatives for Q1 2026',
        color: ProjectColor.Blue,
        startDate: new Date('2025-12-15'),
        endDate: new Date('2026-03-31'),
        isCompleted: false,
        createdAt: new Date('2025-12-01'),
        tasks: [
          {
            id: 'task-1',
            title: 'Design social media graphics',
            description: 'Create engaging graphics for Instagram and Facebook',
            status: TaskStatus.InProgress,
            projectId: 'proj-1',
            assignees: ['Sarah', 'Mike'],
            startDate: new Date('2025-12-15'),
            endDate: new Date('2025-12-28'),
            priority: TaskPriority.High,
            createdAt: new Date('2025-12-15')
          },
          {
            id: 'task-2',
            title: 'Write blog posts',
            description: 'Create 5 blog posts about industry trends',
            status: TaskStatus.NotStarted,
            projectId: 'proj-1',
            assignees: ['Emily'],
            startDate: new Date('2025-12-20'),
            endDate: new Date('2026-01-10'),
            priority: TaskPriority.Medium,
            createdAt: new Date('2025-12-15')
          }
        ]
      },
      {
        id: 'proj-2',
        name: 'Website Redesign',
        description: 'Modernize company website with new branding',
        color: ProjectColor.Purple,
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-02-15'),
        isCompleted: false,
        createdAt: new Date('2025-11-25'),
        tasks: [
          {
            id: 'task-3',
            title: 'Wireframe new homepage',
            description: 'Create wireframes for the new homepage design',
            status: TaskStatus.Completed,
            projectId: 'proj-2',
            assignees: ['Alex'],
            startDate: new Date('2025-12-01'),
            endDate: new Date('2025-12-10'),
            priority: TaskPriority.High,
            createdAt: new Date('2025-12-01'),
            completedAt: new Date('2025-12-09')
          }
        ]
      }
    ];

    // Mock standalone tasks
    const mockStandaloneTasks: TaskItem[] = [
      {
        id: 'task-4',
        title: 'Update member directory',
        description: 'Review and update contact information',
        status: TaskStatus.Paused,
        assignees: ['Jordan'],
        startDate: new Date('2025-12-20'),
        endDate: new Date('2025-12-27'),
        priority: TaskPriority.Low,
        createdAt: new Date('2025-12-20')
      },
      {
        id: 'task-5',
        title: 'Prepare monthly newsletter',
        description: 'Draft and schedule December newsletter',
        status: TaskStatus.Blocked,
        assignees: ['Chris', 'Pat'],
        startDate: new Date('2025-12-22'),
        endDate: new Date('2025-12-26'),
        priority: TaskPriority.Critical,
        createdAt: new Date('2025-12-22')
      }
    ];

    setSummary(mockSummary);
    setLeaderboard(mockLeaderboard);
    setProjects(mockProjects);
    setStandaloneTasks(mockStandaloneTasks);
  };

  const allTasks = [
    ...standaloneTasks,
    ...projects.flatMap(p => p.tasks)
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return COLORS.primary;
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      workshop: '#8B5CF6',
      speaker: '#EC4899',
      social: '#10B981',
      meeting: '#F59E0B',
      conference: '#3B82F6'
    };
    return colors[type.toLowerCase()] || COLORS.primary;
  };

  return (
    <div className={isPanel ? "w-full" : "max-w-6xl mx-auto px-5 pb-24 pt-4"}>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">{circleName} Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Overview of circle activity and analytics</p>
      </div>

      {/* Circle Info Card */}
      <div className="bg-white rounded-xl p-5 mb-5 shadow-sm border border-blue-50">
        <h2 className="text-lg font-bold text-gray-900 mb-3">{circleName}</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <svg className="w-3.5 h-3.5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-xs font-medium text-gray-700">{memberCount} members</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-full">
            <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-700">{circleIndustry}</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-orange-50 rounded-full">
            <svg className="w-3.5 h-3.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-700">{circlePricing}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{summary.total_events}</div>
            <div className="text-xs font-medium text-gray-600">Total Events</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{summary.total_members}</div>
            <div className="text-xs font-medium text-gray-600">Total Members</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">${summary.total_revenue}</div>
            <div className="text-xs font-medium text-gray-600">Revenue</div>
          </div>
        </div>
      )}

      {/* Event Types */}
      {summary && Object.keys(summary.event_type_distribution).length > 0 && (
        <div className="bg-white rounded-xl p-4 mb-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Event Types</h3>
          <div className="space-y-3">
            {Object.entries(summary.event_type_distribution).map(([type, count]) => {
              const total = Object.values(summary.event_type_distribution).reduce((a, b) => a + b, 0);
              const percentage = (count / total) * 100;
              return (
                <div key={type}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
                    <span className="text-xs text-gray-600">{count} events</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getEventTypeColor(type)
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Manager Section */}
      <div className="bg-white rounded-xl p-4 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Task Manager</h3>
          <div className="flex items-center space-x-2">
            {/* View Mode Selector */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('projects')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Projects
              </button>
            </div>
            {isModerator && (
              <button
                onClick={() => console.log('Create task/project')}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: COLORS.primary }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <KanbanBoard tasks={allTasks} projects={projects} />
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Circle Leaderboard</h3>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(['all', 'weekly', 'monthly'] as TimeFrame[]).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                  selectedTimeframe === timeframe ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                {timeframe === 'all' ? 'All Time' : timeframe}
              </button>
            ))}
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
            <p className="text-sm text-gray-600">No leaderboard data</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div key={entry.user_id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: getRankColor(index + 1) }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                  <div className="text-xs text-gray-600 truncate">{entry.email}</div>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">{entry.points}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
