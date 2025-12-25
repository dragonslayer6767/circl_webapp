import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import ForumPost from '../components/forum/ForumPost';
import CommentsModal from '../components/forum/CommentsModal';
import { ForumPost as ForumPostType } from '../types/forum';
import { COLORS } from '../utils/colors';

// Dummy data matching the screenshot
const DUMMY_POSTS: ForumPostType[] = [
  {
    id: 1,
    user: 'Harris Harris',
    user_id: 1,
    profileImage: 'https://i.pravatar.cc/150?img=1',
    content: '',
    category: 'Public',
    privacy: 'public',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    comment_count: 1,
    like_count: 0,
    liked_by_user: false,
  },
  {
    id: 2,
    user: 'Bha V',
    user_id: 2,
    profileImage: 'https://i.pravatar.cc/150?img=2',
    content: 'Hi',
    category: 'Public',
    privacy: 'public',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    comment_count: 0,
    like_count: 0,
    liked_by_user: false,
  },
  {
    id: 3,
    user: 'Harris Harris',
    user_id: 1,
    profileImage: 'https://i.pravatar.cc/150?img=1',
    content: 'Sga',
    category: 'Public',
    privacy: 'public',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    comment_count: 0,
    like_count: 0,
    liked_by_user: false,
  },
  {
    id: 4,
    user: 'Ken B',
    user_id: 3,
    profileImage: 'https://i.pravatar.cc/150?img=3',
    content: 'Is this what it felt like to be Edwardo when Facebook came out',
    category: 'Public',
    privacy: 'public',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
    comment_count: 1,
    like_count: 3,
    liked_by_user: false,
  },
  {
    id: 5,
    user: 'Harris Harris',
    user_id: 1,
    profileImage: 'https://i.pravatar.cc/150?img=1',
    content: 'Hi',
    category: 'Public',
    privacy: 'public',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 4 months ago
    comment_count: 1,
    like_count: 1,
    liked_by_user: false,
  },
  {
    id: 6,
    user: 'Fragne Delgado',
    user_id: 4,
    profileImage: 'https://i.pravatar.cc/150?img=4',
    content: 'Hello',
    category: 'Public',
    privacy: 'public',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 4 months ago
    comment_count: 0,
    like_count: 2,
    liked_by_user: false,
    is_mentor: true,
  },
];

export default function Forum() {
  const [posts, setPosts] = useState<ForumPostType[]>(DUMMY_POSTS);
  const [selectedTab, setSelectedTab] = useState<'for_you' | 'following'>('for_you');
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPostType | null>(null);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const handleLike = (post: ForumPostType) => {
    // Optimistic local update only - no API calls
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              liked_by_user: !p.liked_by_user,
              like_count: p.liked_by_user ? p.like_count - 1 : p.like_count + 1,
            }
          : p
      )
    );
  };

  const handleComment = (post: ForumPostType) => {
    setSelectedPost(post);
    setCommentsModalOpen(true);
  };

  const handleCloseComments = () => {
    setCommentsModalOpen(false);
    setSelectedPost(null);
  };

  const handleDelete = (postId: number) => {
    // Local delete only - no API calls
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    addNotification('Post deleted', 'success');
  };

  const handleProfileClick = (_userId: number) => {
    addNotification('Profile page coming soon!', 'info');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Tabs - Sticky under header with blue background */}
      <div className="sticky top-16 z-10" style={{ backgroundColor: COLORS.primary }}>
        <div className="flex">
          <button
            onClick={() => setSelectedTab('for_you')}
            className={`flex-1 py-4 text-[15px] font-semibold transition-colors relative text-white ${
              selectedTab === 'for_you'
                ? ''
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            For you
            {selectedTab === 'for_you' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"
              />
            )}
          </button>
          
          <button
            onClick={() => setSelectedTab('following')}
            className={`flex-1 py-4 text-[15px] font-semibold transition-colors relative text-white ${
              selectedTab === 'following'
                ? ''
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Following
            {selectedTab === 'following' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"
              />
            )}
          </button>
        </div>
      </div>

      {/* Compose Post Area */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: '#004aad' }}
            >
              {user?.fullname?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <button
            onClick={() => addNotification('Post creation coming soon!', 'info')}
            className="flex-1 text-left text-gray-500 text-[17px] py-2"
          >
            What's happening?
          </button>
        </div>
        
        <div className="flex items-center gap-4 mt-3 ml-13">
          <button
            className="flex items-center gap-1 text-blue-600 text-sm font-medium"
            onClick={() => addNotification('Tags feature coming soon!', 'info')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Tags
          </button>
          
          <button
            className="flex items-center gap-1 text-blue-600 text-sm font-medium"
            onClick={() => addNotification('Privacy settings coming soon!', 'info')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Public
          </button>

          <button
            className="ml-auto px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors"
            onClick={() => addNotification('Post creation coming soon!', 'info')}
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div>
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm">Be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <ForumPost
              key={post.id}
              post={post}
              isCurrentUser={post.user_id === user?.user_id}
              onComment={() => handleComment(post)}
              onLike={() => handleLike(post)}
              onDelete={() => handleDelete(post.id)}
              onProfileClick={() => handleProfileClick(post.user_id)}
            />
          ))
        )}
      </div>

      {/* Comments Modal */}
      {selectedPost && (
        <CommentsModal
          postId={selectedPost.id}
          isOpen={commentsModalOpen}
          onClose={handleCloseComments}
          postAuthor={selectedPost.user}
          postContent={selectedPost.content}
          postTimestamp={selectedPost.created_at}
        />
      )}
    </div>
  );
}
