import { useState, useEffect } from 'react';
import { COLORS } from '../../../utils/colors';
import { TaskItem, TaskPriority, TaskStatus, Project } from '../../../types/dashboard';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  projects: Project[];
  onTaskUpdated: (taskId: string, updates: Partial<TaskItem>) => void;
  onTaskDeleted: (taskId: string) => void;
  isModerator: boolean;
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  projects,
  onTaskUpdated,
  onTaskDeleted,
  isModerator
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NotStarted);
  const [projectId, setProjectId] = useState<string>('');
  const [team, setTeam] = useState<string>('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [assigneeInput, setAssigneeInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setProjectId(task.projectId || '');
      setTeam(task.team || '');
      setAssignees(task.assignees);
      setStartDate(new Date(task.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(task.endDate).toISOString().split('T')[0]);
      setIsEditing(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.Low: return '#10B981';
      case TaskPriority.Medium: return '#F59E0B';
      case TaskPriority.High: return '#F97316';
      case TaskPriority.Critical: return '#EF4444';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NotStarted: return '#9CA3AF';
      case TaskStatus.InProgress: return '#3B82F6';
      case TaskStatus.Paused: return '#F59E0B';
      case TaskStatus.Blocked: return '#EF4444';
      case TaskStatus.Completed: return '#10B981';
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    onTaskUpdated(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      projectId: projectId || undefined,
      team: team || undefined,
      assignees,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onTaskDeleted(task.id);
      onClose();
    }
  };

  const addAssignee = () => {
    if (assigneeInput.trim() && !assignees.includes(assigneeInput.trim())) {
      setAssignees([...assignees, assigneeInput.trim()]);
      setAssigneeInput('');
    }
  };

  const removeAssignee = (name: string) => {
    setAssignees(assignees.filter(a => a !== name));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Task' : 'Task Details'}
          </h2>
          <div className="flex items-center space-x-2">
            {isModerator && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {!isEditing ? (
            // View Mode
            <>
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{task.title}</h3>

              {/* Status & Priority Badges */}
              <div className="flex items-center space-x-2 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {task.status}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority} Priority
                </span>
              </div>

              {/* Project */}
              {project && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-50">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span className="text-sm font-medium text-purple-900">{project.name}</span>
                  </div>
                </div>
              )}

              {/* Team */}
              {task.team && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Team</label>
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-900">{task.team}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              {task.description && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <p className="text-gray-800">{task.description}</p>
                </div>
              )}

              {/* Assignees */}
              {task.assignees.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assignees</label>
                  <div className="flex flex-wrap gap-2">
                    {task.assignees.map((assignee) => (
                      <div key={assignee} className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {assignee.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{assignee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <p className="text-gray-800">{new Date(task.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <p className={`font-medium ${new Date(task.endDate) < new Date() ? 'text-red-600' : 'text-gray-800'}`}>
                    {new Date(task.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                {task.completedAt && (
                  <p>Completed: {new Date(task.completedAt).toLocaleString()}</p>
                )}
              </div>

              {/* Delete Button */}
              {isModerator && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete Task
                  </button>
                </div>
              )}
            </>
          ) : (
            // Edit Mode
            <>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={TaskPriority.Low}>Low</option>
                    <option value={TaskPriority.Medium}>Medium</option>
                    <option value={TaskPriority.High}>High</option>
                    <option value={TaskPriority.Critical}>Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={TaskStatus.NotStarted}>Not Started</option>
                    <option value={TaskStatus.InProgress}>In Progress</option>
                    <option value={TaskStatus.Paused}>Paused</option>
                    <option value={TaskStatus.Blocked}>Blocked</option>
                    <option value={TaskStatus.Completed}>Completed</option>
                  </select>
                </div>
              </div>

              {/* Project */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Standalone Task</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team</label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No Team</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Product">Product</option>
                  <option value="Operations">Operations</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              {/* Assignees */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assignees</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={assigneeInput}
                    onChange={(e) => setAssigneeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAssignee())}
                    placeholder="Enter member name"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addAssignee}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {assignees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {assignees.map((assignee) => (
                      <div key={assignee} className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                        <span className="text-sm font-medium text-gray-700">{assignee}</span>
                        <button
                          type="button"
                          onClick={() => removeAssignee(assignee)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
