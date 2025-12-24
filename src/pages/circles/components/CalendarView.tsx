import { useState } from 'react';
import { COLORS } from '../../../utils/colors';

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  event_type: string;
  date: string;
  start_time: string;
  end_time: string;
  points: number;
  revenue: number;
  circle_id: number;
}

interface CalendarViewProps {
  circleId: number;
  circleName: string;
  isModerator: boolean;
}

export default function CalendarView({ circleId, circleName, isModerator }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAllEvents, setShowAllEvents] = useState(false);

  // Mock event data
  const mockEvents: CalendarEvent[] = [
    {
      id: 1,
      title: 'Monthly Networking Mixer',
      description: 'Join us for our monthly networking event to connect with fellow members and share ideas.',
      event_type: 'social',
      date: '2025-12-23',
      start_time: '18:00:00',
      end_time: '20:00:00',
      points: 10,
      revenue: 0,
      circle_id: circleId
    },
    {
      id: 2,
      title: 'Workshop: Business Growth Strategies',
      description: 'Learn effective strategies to grow your business in 2026.',
      event_type: 'workshop',
      date: '2025-12-24',
      start_time: '14:00:00',
      end_time: '16:00:00',
      points: 15,
      revenue: 50,
      circle_id: circleId
    },
    {
      id: 3,
      title: 'Guest Speaker: Tech Innovation',
      description: 'Hear from industry leaders about the latest in tech innovation.',
      event_type: 'speaker',
      date: '2025-12-28',
      start_time: '10:00:00',
      end_time: '12:00:00',
      points: 20,
      revenue: 75,
      circle_id: circleId
    },
    {
      id: 4,
      title: 'Year End Planning Meeting',
      description: 'Strategic planning session for Q1 2026.',
      event_type: 'meeting',
      date: '2025-12-30',
      start_time: '15:00:00',
      end_time: '17:00:00',
      points: 10,
      revenue: 0,
      circle_id: circleId
    }
  ];

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockEvents.filter(event => event.date === dateStr);
  };

  // Check if date has events
  const hasEvents = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockEvents.some(event => event.date === dateStr);
  };

  // Calendar navigation
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const eventsToShow = showAllEvents ? mockEvents : getEventsForDate(selectedDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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

  const getEventTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'workshop':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      case 'speaker':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        );
      case 'social':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        );
      case 'meeting':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 pb-24 pt-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{circleName} Calendar</h1>
          <p className="text-xs text-gray-600 mt-1">Manage events and check-ins</p>
        </div>
        {isModerator && (
          <button
            onClick={() => console.log('Create event - TODO')}
            className="flex items-center space-x-2 px-3 py-2 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.primary }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <div className="flex items-center space-x-1">
            <button
              onClick={previousMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-9" />;
            }

            const isSelected = isSameDay(day, selectedDate);
            const hasEvent = hasEvents(day);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(day);
                  setShowAllEvents(false);
                }}
                className={`
                  h-9 rounded-lg flex flex-col items-center justify-center text-sm font-medium
                  transition-all relative
                  ${isSelected ? 'text-white shadow-md' : 'text-gray-900 hover:bg-gray-50'}
                  ${isCurrentDay && !isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                `}
                style={isSelected ? { backgroundColor: COLORS.primary } : {}}
              >
                {day.getDate()}
                {hasEvent && (
                  <div 
                    className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-white' : ''}`}
                    style={!isSelected ? { backgroundColor: COLORS.primary } : {}}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">
            {showAllEvents 
              ? 'All Events' 
              : `Events for ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
            }
          </h3>
          <button
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="text-xs font-medium hover:underline"
            style={{ color: COLORS.primary }}
          >
            {showAllEvents ? 'Back to Date' : 'Show All'}
          </button>
        </div>

        {eventsToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${COLORS.primary}10` }}
            >
              <svg 
                className="w-6 h-6"
                style={{ color: COLORS.primary }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-1">No events for this date</h4>
            <p className="text-xs text-gray-500">Tap the + button to create an event</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {eventsToShow.map((event) => (
              <div
                key={event.id}
                className="rounded-lg p-3 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-2.5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                  >
                    {getEventTypeIcon(event.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium ml-2"
                        style={{ 
                          backgroundColor: `${getEventTypeColor(event.event_type)}20`,
                          color: getEventTypeColor(event.event_type)
                        }}
                      >
                        {event.event_type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                      </div>
                      {event.points > 0 && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{event.points} pts</span>
                        </div>
                      )}
                      {event.revenue > 0 && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          <span>${event.revenue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
