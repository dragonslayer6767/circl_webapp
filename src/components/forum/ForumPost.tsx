import { useState } from 'react';
import { ForumPost as ForumPostType } from '../../types/forum';
import { timeAgo } from '../../utils/formatters';
import { COLORS } from '../../utils/colors';

interface ForumPostProps {
  post: ForumPostType;
  isCurrentUser?: boolean;
  onComment?: () => void;
  onLike?: () => void;
  onDelete?: () => void;
  onProfileClick?: () => void;
}

export default function ForumPost({
  post,
  isCurrentUser = false,
  onComment,
  onLike,
  onDelete,
  onProfileClick,
}: ForumPostProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    setShowMenu(false);
    onDelete?.();
  };

  return (
    <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="px-4 py-3">
        <div className="flex gap-3">
          {/* Profile Image */}
          <button
            onClick={onProfileClick}
            className="flex-shrink-0 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
              {post.profileImage ? (
                <img
                  src={post.profileImage}
                  alt={post.user}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {post.user.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-1 mb-1">
              <span className="font-semibold text-gray-900 text-[15px]">
                {post.user}
              </span>
              
              {post.is_mentor && (
                <svg
                  className="w-4 h-4"
                  style={{ color: COLORS.primary }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              <span className="text-gray-500 text-[15px]">·</span>
              
              <span className="text-gray-500 text-[15px]">
                {timeAgo(post.created_at)}
              </span>

              <div className="ml-auto relative">
                <button
                  onClick={handleMenuClick}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      {isCurrentUser ? (
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setShowDeleteConfirm(true);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete Post
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowMenu(false)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Report Post
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-900 text-[15px] leading-5 mb-2 whitespace-pre-wrap break-words">
              {post.content}
            </p>

            {/* Category Tag */}
            {post.category && post.category.trim() !== '' && post.category !== 'Category' && (
              <div className="mb-2">
                <span
                  className="inline-block px-2 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: `${COLORS.primary}1A`,
                    color: COLORS.primary,
                  }}
                >
                  {post.category}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-8 mt-2">
              {/* Comment Button */}
              <button
                onClick={onComment}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-[13px]">{post.comment_count || 0}</span>
              </button>

              {/* Like Button */}
              <button
                onClick={onLike}
                className={`flex items-center gap-1 transition-colors group ${
                  post.liked_by_user ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={post.liked_by_user ? 'currentColor' : 'none'}
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
                <span className="text-[13px]">{post.like_count}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Delete Post?</h3>
            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
