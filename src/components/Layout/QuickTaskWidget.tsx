import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskItem, TaskStatus } from '../../types/dashboard';
import { getTasks } from '../../utils/taskHelpers';

export default function QuickTaskWidget({ isCollapsed }: { isCollapsed: boolean }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load tasks from localStorage
    const allTasks = getTasks();
    // Filter for incomplete tasks
    const incompleteTasks = allTasks.filter(
      (task: TaskItem) => task.status !== TaskStatus.Completed
    );
    setTasks(incompleteTasks);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : tasks.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < tasks.length - 1 ? prev + 1 : 0));
  };

  const handleTaskClick = () => {
    // Navigate to circles dashboard
    navigate('/circles');
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NotStarted:
        return 'bg-gray-400';
      case TaskStatus.InProgress:
        return 'bg-blue-500';
      case TaskStatus.Paused:
        return 'bg-yellow-500';
      case TaskStatus.Blocked:
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'High' || priority === 'Critical') {
      return (
        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  if (isCollapsed) {
    return null;
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="p-4 border-t border-white/20">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-xs text-white/60 mb-2">No active tasks</p>
          <button
            onClick={handleTaskClick}
            className="text-xs text-white/80 hover:text-white underline"
          >
            View Circles
          </button>
        </div>
      </div>
    );
  }

  const currentTask = tasks[currentIndex];

  return (
    <div className="p-4 border-t border-white/20">
      <div className="bg-white/10 rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wide">
            Quick Tasks
          </h3>
          <span className="text-xs text-white/60">
            {currentIndex + 1} / {tasks.length}
          </span>
        </div>

        {/* Task Card */}
        <div 
          className="bg-white/5 rounded-lg p-3 mb-3 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={handleTaskClick}
        >
          {/* Task Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getPriorityIcon(currentTask.priority)}
              <h4 className="text-sm font-medium text-white truncate">
                {currentTask.title}
              </h4>
            </div>
          </div>

          {/* Task Description */}
          {currentTask.description && (
            <p className="text-xs text-white/60 mb-2 line-clamp-2">
              {currentTask.description}
            </p>
          )}

          {/* Task Meta */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-white text-[10px] ${getStatusColor(currentTask.status)}`}>
                {currentTask.status}
              </span>
              {currentTask.assignees && currentTask.assignees.length > 0 && (
                <div className="flex items-center gap-1 text-white/60">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{currentTask.assignees.length}</span>
                </div>
              )}
            </div>
            {currentTask.endDate && (
              <span className="text-white/50">
                Due {new Date(currentTask.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {tasks.length > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Previous task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-1">
              {tasks.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Next task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
