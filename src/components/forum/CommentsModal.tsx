import { useState, useEffect } from 'react';
import { COLORS } from '../../utils/colors';
import { timeAgo } from '../../utils/formatters';

export interface Comment {
  id: number;
  user: string;
  text: string;
  created_at: string;
  like_count: number;
  liked_by_user: boolean;
  profile_image?: string;
}

interface CommentsModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
  postAuthor: string;
  postContent: string;
  postTimestamp: string;
}

export default function CommentsModal({
  postId,
  isOpen,
  onClose,
  postAuthor,
  postContent,
  postTimestamp,
}: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockComments: Comment[] = [
    {
      id: 1,
      user: 'John Doe',
      text: 'Great post! Really insightful.',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      like_count: 3,
      liked_by_user: false,
      profile_image: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: 2,
      user: 'Jane Smith',
      text: 'Thanks for sharing this!',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      like_count: 1,
      liked_by_user: true,
      profile_image: 'https://i.pravatar.cc/150?img=11',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setComments(mockComments);
      setIsLoading(false);
    }, 500);
  };

  const submitComment = () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: comments.length + 1,
        user: 'You',
        text: newComment,
        created_at: new Date().toISOString(),
        like_count: 0,
        liked_by_user: false,
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
      setIsSubmitting(false);
    }, 300);
  };

  const toggleCommentLike = (comment: Comment) => {
    // Optimistic update
    setComments(prev =>
      prev.map(c =>
        c.id === comment.id
          ? {
              ...c,
              liked_by_user: !c.liked_by_user,
              like_count: c.liked_by_user ? c.like_count - 1 : c.like_count + 1,
            }
          : c
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Original Post */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full" style={{ backgroundColor: COLORS.primary }}>
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {postAuthor.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{postAuthor}</span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm">{timeAgo(postTimestamp)}</span>
                </div>
                <p className="text-gray-900 text-sm">{postContent}</p>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.primary }} />
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">No comments yet</p>
                <p className="text-xs mt-1">Be the first to comment!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {comments.map((comment) => (
                  <div key={comment.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {comment.profile_image ? (
                          <img
                            src={comment.profile_image}
                            alt={comment.user}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            {comment.user.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{comment.user}</span>
                          <span className="text-gray-500 text-xs">{timeAgo(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-900 text-sm mb-2 whitespace-pre-wrap break-words">
                          {comment.text}
                        </p>

                        {/* Like Button */}
                        <button
                          onClick={() => toggleCommentLike(comment)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            comment.liked_by_user ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill={comment.liked_by_user ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {comment.like_count > 0 && <span>{comment.like_count}</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Post your reply"
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <button
                onClick={submitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: newComment.trim() ? COLORS.primary : '#9CA3AF',
                }}
              >
                {isSubmitting ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
