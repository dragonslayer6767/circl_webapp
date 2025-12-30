import { useState, useEffect } from 'react';
import { forumService, Comment } from '../../services/forumService';
import CommentItem from './CommentItem';
import { useAuth } from '../../hooks/useAuth';

interface CommentSectionProps {
  postId: number;
  onCommentAdded?: () => void;
}

export default function CommentSection({
  postId,
  onCommentAdded,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await forumService.getComments(postId);
      setComments(response.results || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const comment = await forumService.createComment(postId, {
        content: newComment,
      });

      setComments([...comments, comment]);
      setNewComment('');
      onCommentAdded?.();
    } catch (err) {
      console.error('Failed to create comment:', err);
      setError('Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentDelete = (commentId: number) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  return (
    <div className="border-t border-gray-100">
      {/* Toggle Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="w-full px-4 py-3 text-left text-gray-600 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors bg-white"
      >
        <span>
          {showComments ? '✕ Hide' : '💬 Show'} {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
        {showComments && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>

      {showComments && (
        <>
          {/* Comment List */}
          {isFetching ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              Loading comments...
            </div>
          ) : error ? (
            <div className="px-4 py-4 text-center text-red-600 text-sm bg-red-50">
              {error}
              <button
                onClick={fetchComments}
                className="ml-2 text-red-600 font-semibold hover:underline"
              >
                Retry
              </button>
            </div>
          ) : comments.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-0 border-t border-gray-100">
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onDelete={() => handleCommentDelete(comment.id)}
                />
              ))}
            </div>
          )}

          {/* Comment Input */}
          {user && (
            <form
              onSubmit={handleSubmitComment}
              className="border-t border-gray-100 p-4 space-y-3"
            >
              <div className="flex gap-3">
                {/* User Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold bg-gray-300"
                >
                  {user.fullname?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </div>

                {/* Input Area */}
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    disabled={isLoading}
                  />

                  {error && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                  )}

                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isLoading}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Posting...' : 'Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
