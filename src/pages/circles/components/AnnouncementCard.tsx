import { useState } from 'react';
import { COLORS } from '../../../utils/colors';

interface AnnouncementCardProps {
  id: number;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
  onDelete?: (id: number) => void;
  canDelete?: boolean;
}

export default function AnnouncementCard({
  id,
  title,
  content,
  created_by,
  created_at,
  onDelete,
  canDelete = false
}: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Compact Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3.5 text-left focus:outline-none"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Megaphone Icon */}
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>

            {/* Title and Meta */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                {title}
              </h3>
              <div className="flex items-center space-x-2 text-white text-opacity-80">
                <span className="text-xs font-medium">By {created_by}</span>
                <span className="w-1 h-1 rounded-full bg-white bg-opacity-50"></span>
                <span className="text-xs">{created_at}</span>
              </div>
            </div>
          </div>

          {/* Expand/Collapse Indicator */}
          <div className="w-7 h-7 rounded-full bg-white bg-opacity-15 flex items-center justify-center flex-shrink-0 ml-2">
            <svg 
              className={`w-3 h-3 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Elegant Divider */}
        <div className="px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white via-opacity-30 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>

          {/* Delete Button for Moderators */}
          {canDelete && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this announcement?')) {
                  onDelete(id);
                }
              }}
              className="mt-3 flex items-center space-x-2 text-white text-opacity-80 hover:text-opacity-100 text-xs font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Announcement</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
