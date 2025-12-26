import { useState } from 'react';
import { COLORS } from '../../utils/colors';
import { Announcement, Circle } from '../../types/circle';
import { formatDistanceToNow } from 'date-fns';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  circle: Circle;
  userId: number;
  onCreateAnnouncement: () => void;
  onRefresh: () => void;
}

export default function AnnouncementsSection({
  announcements,
  circle,
  userId,
  onCreateAnnouncement,
  onRefresh
}: AnnouncementsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isModeratorOrCreator = userId === circle.creator_id || circle.is_moderator;
  const displayedAnnouncements = showAll ? announcements : announcements.slice(0, 3);

  const handleDeleteAnnouncement = async (announcementId: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    setDeletingId(announcementId);
    try {
      // TODO: API call to delete announcement
      // await fetch(`${API_BASE}/circles/announcements/delete/${announcementId}/`, {
      //   method: 'DELETE',
      //   body: JSON.stringify({ circle_id: circle.id, user_id: userId })
      // });
      onRefresh();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      alert('Failed to delete announcement');
    } finally {
      setDeletingId(null);
    }
  };

  const formatAnnouncementDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (announcements.length === 0) {
    return (
      <div className="px-5 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + '20' }}
            >
              <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Announcements Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Stay tuned for important updates from circle moderators
            </p>

            {isModeratorOrCreator && (
              <button
                onClick={onCreateAnnouncement}
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.primary }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Announcement
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary + '20' }}
            >
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
              <p className="text-sm text-gray-500">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {isModeratorOrCreator && (
            <button
              onClick={onCreateAnnouncement}
              className="flex items-center gap-2 px-4 py-2 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COLORS.primary }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>
          )}
        </div>

        {/* Announcements List */}
        <div className="divide-y divide-gray-100">
          {displayedAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {announcement.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{announcement.user}</span>
                    <span className="text-gray-400">•</span>
                    <span>{formatAnnouncementDate(announcement.announced_at)}</span>
                  </div>
                </div>

                {isModeratorOrCreator && (
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    disabled={deletingId === announcement.id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete announcement"
                  >
                    {deletingId === announcement.id ? (
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>

        {/* Show All Button */}
        {announcements.length > 3 && !showAll && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setShowAll(true)}
              className="w-full text-center text-sm font-semibold hover:underline"
              style={{ color: COLORS.primary }}
            >
              Show All Announcements ({announcements.length})
            </button>
          </div>
        )}

        {/* Show Less Button */}
        {showAll && announcements.length > 3 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setShowAll(false)}
              className="w-full text-center text-sm font-semibold hover:underline"
              style={{ color: COLORS.primary }}
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Create Announcement Modal Component
interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
  userId: number;
  onSuccess: () => void;
}

export function CreateAnnouncementModal({
  isOpen,
  onClose,
  circleId,
  userId,
  onSuccess
}: CreateAnnouncementModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: API call to create announcement
      // await fetch(`${API_BASE}/circles/announcements/create/`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     circle_id: circleId,
      //     user_id: userId,
      //     title: title.trim(),
      //     content: content.trim()
      //   })
      // });

      setTitle('');
      setContent('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="px-6 py-4 border-b border-white/20 flex items-center justify-between"
            style={{ backgroundColor: COLORS.primary }}
          >
            <h2 className="text-2xl font-bold text-white">Create Announcement</h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: COLORS.primary }}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
