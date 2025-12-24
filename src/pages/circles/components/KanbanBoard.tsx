import { TaskItem, TaskStatus, TaskPriority, Project } from '../../../types/dashboard';

interface KanbanBoardProps {
  tasks: TaskItem[];
  projects: Project[];
}

export default function KanbanBoard({ tasks, projects }: KanbanBoardProps) {
  const statusColumns = [
    TaskStatus.NotStarted,
    TaskStatus.InProgress,
    TaskStatus.Paused,
    TaskStatus.Blocked,
    TaskStatus.Completed
  ];

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NotStarted: return '#9CA3AF';
      case TaskStatus.InProgress: return '#3B82F6';
      case TaskStatus.Paused: return '#F59E0B';
      case TaskStatus.Blocked: return '#EF4444';
      case TaskStatus.Completed: return '#10B981';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.Low: return '#10B981';
      case TaskPriority.Medium: return '#F59E0B';
      case TaskPriority.High: return '#F97316';
      case TaskPriority.Critical: return '#EF4444';
    }
  };

  const getProjectColor = (projectId: string | undefined) => {
    if (!projectId) return null;
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    const colorMap: { [key: string]: string } = {
      Blue: '#3B82F6',
      Green: '#10B981',
      Purple: '#8B5CF6',
      Orange: '#F97316',
      Red: '#EF4444',
      Teal: '#14B8A6'
    };
    return { color: colorMap[project.color] || '#3B82F6', name: project.name };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="flex space-x-3 min-w-max pb-2">
        {statusColumns.map((status) => {
          const columnTasks = tasks.filter(t => t.status === status);
          return (
            <div
              key={status}
              className="w-72 flex-shrink-0 bg-gray-50 rounded-lg p-3"
            >
              {/* Column Header */}
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: getStatusColor(status) }}
                />
                <span className="text-sm font-semibold text-gray-900">{status}</span>
                <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-2">
                {columnTasks.map((task) => {
                  const projectInfo = getProjectColor(task.projectId);
                  return (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                    >
                      {/* Priority & Title */}
                      <div className="flex items-start space-x-2 mb-2">
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        />
                        <h4 className="text-sm font-semibold text-gray-900 flex-1 leading-tight">
                          {task.title}
                        </h4>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Project Tag or Standalone */}
                      {projectInfo ? (
                        <div
                          className="inline-flex items-center space-x-1 px-2 py-1 rounded mb-2"
                          style={{ backgroundColor: `${projectInfo.color}20` }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: projectInfo.color }}
                          />
                          <span
                            className="text-xs font-medium"
                            style={{ color: projectInfo.color }}
                          >
                            {projectInfo.name}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-gray-100 mb-2">
                          <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium text-gray-600">Standalone</span>
                        </div>
                      )}

                      {/* Assignees & Due Date */}
                      <div className="flex items-center justify-between">
                        {/* Assignees */}
                        {task.assignees.length > 0 && (
                          <div className="flex -space-x-1">
                            {task.assignees.slice(0, 3).map((assignee, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700 border-2 border-white"
                              >
                                {assignee.charAt(0)}
                              </div>
                            ))}
                            {task.assignees.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 border-2 border-white">
                                +{task.assignees.length - 3}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Due Date */}
                        <div className={`text-xs ${new Date(task.endDate) < new Date() ? 'text-red-600' : 'text-gray-500'}`}>
                          {formatDate(task.endDate)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
