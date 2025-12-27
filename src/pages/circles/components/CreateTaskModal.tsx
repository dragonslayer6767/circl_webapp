import { useState } from 'react';
import { COLORS } from '../../../utils/colors';
import { TaskPriority, TaskStatus, Project } from '../../../types/dashboard';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: TaskFormData) => void;
  projects: Project[];
  circleId: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId?: string;
  assignees: string[];
  startDate: Date;
  endDate: Date;
  team?: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  projects
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NotStarted);
  const [projectId, setProjectId] = useState<string>('');
  const [assigneeInput, setAssigneeInput] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [team, setTeam] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskData: TaskFormData = {
      title: title.trim(),
      description: description.trim(),
      team: team || undefined,
      priority,
      status,
      projectId: projectId || undefined,
      assignees,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };

    onTaskCreated(taskData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.Medium);
    setStatus(TaskStatus.NotStarted);
    setProjectId('');
    setAssignees([]);
    setAssigneeInput('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Priority and Status Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
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

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
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

          {/* Project Assignment */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project (Optional)
            </label>
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

          {/* Team Assignment */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team (Optional)
            </label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assignees
            </label>
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
                  <div
                    key={assignee}
                    className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full"
                  >
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

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
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
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: COLORS.primary }}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
