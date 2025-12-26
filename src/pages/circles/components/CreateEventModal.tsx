import { useState } from 'react';
import { COLORS } from '../../../utils/colors';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
  circleName: string;
  onEventCreated: () => void;
}

const EVENT_TYPES = ['Workshop', 'Speaker', 'Social', 'Meeting', 'Conference'];

export default function CreateEventModal({
  isOpen,
  onClose,
  circleId: _circleId,
  circleName,
  onEventCreated
}: CreateEventModalProps) {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Workshop');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [points, setPoints] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!eventName.trim()) return;

    setIsSubmitting(true);

    // TODO: Replace with actual API call
    // const response = await fetch('https://circlapp.online/api/circles/create_event/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     circle_id: circleId,
    //     title: eventName.trim(),
    //     event_type: eventType,
    //     description: description.trim(),
    //     date: selectedDate,
    //     start_time: startTime + ':00',
    //     end_time: endTime + ':00',
    //     points: parseInt(points) || 10
    //   })
    // });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      resetForm();
      onEventCreated();
      onClose();
    }, 500);
  };

  const resetForm = () => {
    setEventName('');
    setEventType('Workshop');
    setDescription('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setStartTime('10:00');
    setEndTime('11:00');
    setPoints('10');
  };

  const eventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'workshop': return COLORS.primary;
      case 'speaker': return '#9333EA';
      case 'social': return '#F97316';
      case 'meeting': return '#3B82F6';
      case 'conference': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-2xl z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Event</h2>
              <p className="text-sm text-gray-500 mt-1">
                Add a new event to {circleName} calendar
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                maxLength={100}
                autoFocus
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Event Type
              </label>
              <div className="flex flex-wrap gap-3">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setEventType(type)}
                    className="px-4 py-2 rounded-xl font-medium text-sm transition-all"
                    style={{
                      backgroundColor: eventType === type ? eventTypeColor(type) : '#F3F4F6',
                      color: eventType === type ? 'white' : '#374151'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 resize-none"
                style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                maxLength={500}
              />
              <div className="text-xs text-gray-400 mt-1">
                {description.length}/500 characters
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                  style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                  style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                />
              </div>
            </div>

            {/* Points */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Points Awarded
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="10"
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                style={{ ['--tw-ring-color' as any]: COLORS.primary }}
              />
              <div className="text-xs text-gray-500 mt-1">
                Members will earn these points when they check in
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 flex items-center justify-end space-x-3 px-6 py-4 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!eventName.trim() || isSubmitting}
              className="px-6 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: eventName.trim() && !isSubmitting ? COLORS.primary : '#9CA3AF' }}
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
