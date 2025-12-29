import { useState } from 'react';
import { COLORS } from '../../../utils/colors';

interface Comment {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

interface ThreadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  thread: {
    id: number;
    author: string;
    content: string;
    created_at: string;
    likes: number;
    comments: number;
  } | null;
}

export default function ThreadDetailModal({ isOpen, onClose, thread }: ThreadDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Sarah Johnson',
      content: 'Great point! I completely agree with this perspective.',
      created_at: '2 hours ago'
    },
    {
      id: 2,
      author: 'Mike Chen',
      content: 'This is really helpful. Thanks for sharing!',
      created_at: '1 hour ago'
    }
  ]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(thread?.likes || 0);

  if (!isOpen || !thread) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: 'You',
      content: newComment,
      created_at: 'Just now'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: COLORS.primary }}
            >
              {thread.author.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Thread by {thread.author}</h2>
              <p className="text-xs text-gray-500">{thread.created_at}</p>
            </div>
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

        {/* Thread Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Main Thread Content */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap">
                {thread.content}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-medium">{likeCount}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm font-medium">{comments.length}</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span>Comments ({comments.length})</span>
              </h3>

              {/* Comments List */}
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.created_at}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Comment Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: COLORS.primary }}
            >
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={2}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="mt-2 px-4 py-2 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.primary }}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
