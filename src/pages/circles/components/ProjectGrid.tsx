import { Project, TaskStatus } from '../../../types/dashboard';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const getProjectColor = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      Blue: '#3B82F6',
      Green: '#10B981',
      Purple: '#8B5CF6',
      Orange: '#F97316',
      Red: '#EF4444',
      Teal: '#14B8A6'
    };
    return colorMap[colorName] || '#3B82F6';
  };

  const calculateCompletionPercentage = (project: Project) => {
    if (project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(t => t.status === TaskStatus.Completed).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (date: Date) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.length === 0 ? (
        <div className="col-span-2 text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <p className="text-sm text-gray-500">No projects yet</p>
        </div>
      ) : (
        projects.map((project) => {
          const completionPercentage = calculateCompletionPercentage(project);
          const projectColor = getProjectColor(project.color);

          return (
            <div
              key={project.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              {/* Project Header */}
              <div className="flex items-start space-x-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: projectColor }}
                />
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900">{project.name}</h4>
                  {project.isCompleted && (
                    <div className="inline-flex items-center space-x-1 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-green-600">Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: projectColor }}
                  >
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all rounded-full"
                    style={{
                      width: `${completionPercentage}%`,
                      backgroundColor: projectColor
                    }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <div className="text-lg font-bold text-gray-900">{project.tasks.length}</div>
                  <div className="text-xs text-gray-600">Tasks</div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xs font-medium ${
                      isOverdue(project.endDate) ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    {formatDate(project.endDate)}
                  </div>
                  <div className="text-xs text-gray-500">Due Date</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
