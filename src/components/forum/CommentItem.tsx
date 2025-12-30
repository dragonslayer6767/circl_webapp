import { useState } from 'react';
import { timeAgo } from '../../utils/formatters';
import { forumService, Comment } from '../../services/forumService';

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onDelete?: (commentId: number) => void;
}

export default function CommentItem({
  comment,
  postId,
  onDelete,
}: CommentItemProps) {
  const [liked, setLiked] = useState(comment.liked_by_user);
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    try {
      setIsLiking(true);
      
      if (liked) {
        await forumService.unlikeComment(postId, comment.id);
        setLiked(false);
        setLikeCount(count => count - 1);
      } else {
        await forumService.likeComment(postId, comment.id);
        setLiked(true);
        setLikeCount(count => count + 1);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert on error
      setLiked(!liked);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await forumService.deleteComment(postId, comment.id);
      onDelete?.(comment.id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex gap-3">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gray-300">
            {comment.user.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm">{comment.user}</span>
            <span className="text-gray-500 text-xs">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-gray-900 text-sm mb-2 whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* Like Button */}
          <div className="flex gap-4 text-xs">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1 transition-colors ${
                liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              } disabled:opacity-50`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill={liked ? 'currentColor' : 'none'}
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
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
