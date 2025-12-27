import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ForumPost from '../components/forum/ForumPost';
import CommentsModal from '../components/forum/CommentsModal';
import NotificationTester from '../components/common/NotificationTester';
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
    content: 'H',
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
    content: 'Y',
    category: 'Public',
    privacy: 'public',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 4 months ago
    comment_count: 0,
    like_count: 2,
    liked_by_user: false,
    is_mentor: true,
  },
];

const CATEGORIES = [
  'Growth & Marketing',
  'Networking & Collaboration',
  'Funding & Finance',
  'Skills & Development',
  'Challenges & Insights',
  'Trends & Technology',
];

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Anyone can see this post' },
  { value: 'connections', label: 'Connections Only', description: 'Only your connections can see this' },
];

export default function Forum() {
  const [posts, setPosts] = useState<ForumPostType[]>(DUMMY_POSTS);
  const [selectedTab, setSelectedTab] = useState<'for_you' | 'following'>('for_you');
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPostType | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPrivacy, setSelectedPrivacy] = useState<string>('public');
  const { user } = useAuth();

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
  };

  const handleProfileClick = (_userId: number) => {
    addNotification('Profile page coming soon!', 'info');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const handlePrivacySelect = (privacy: string) => {
    setSelectedPrivacy(privacy);
    setShowPrivacyModal(false);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: ForumPostType = {
      id: posts.length + 1,
      user: user?.fullname || 'Anonymous User',
      user_id: user?.user_id || 999,
      profileImage: user?.profile_image || `https://i.pravatar.cc/150?img=${posts.length + 1}`,
      content: newPostContent,
      category: selectedCategory || 'Public',
      privacy: selectedPrivacy as 'public' | 'private' | 'connections',
      created_at: new Date().toISOString(),
      comment_count: 0,
      like_count: 0,
      liked_by_user: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedCategory('');
    setSelectedPrivacy('public');
    addNotification('Post created successfully!', 'success');
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
              style={{ backgroundColor: COLORS.primary }}
            >
              {user?.fullname?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full text-[17px] resize-none border-none outline-none"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedCategory ? COLORS.primary : '#f0f0f0',
                    color: selectedCategory ? 'white' : '#666',
                  }}
                >
                  {selectedCategory || 'Tags'}
                </button>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedPrivacy !== 'public' ? COLORS.primary : '#f0f0f0',
                    color: selectedPrivacy !== 'public' ? 'white' : '#666',
                  }}
                >
                  {PRIVACY_OPTIONS.find(p => p.value === selectedPrivacy)?.label}
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="px-6 py-1.5 rounded-full text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: newPostContent.trim() ? COLORS.primary : '#ccc' }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCategoryModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[400px] z-50">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-center mb-4">
                Select a category for your post
              </h3>
              <div className="divide-y divide-gray-200">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full px-4 py-3 text-left text-[15px] font-medium transition-all duration-200"
                    style={{
                      backgroundColor: selectedCategory === category ? '#e3f2ff' : 'transparent',
                      color: selectedCategory === category ? COLORS.primary : '#333',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = '#e3f2ff';
                        e.currentTarget.style.color = COLORS.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#333';
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-full mt-4 px-4 py-3 text-center rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Privacy Selection Modal */}
      {showPrivacyModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowPrivacyModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[400px] z-50">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-center mb-4">
                Who can see this post?
              </h3>
              <div className="divide-y divide-gray-200">
                {PRIVACY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePrivacySelect(option.value)}
                    className="w-full px-4 py-3 text-left transition-all duration-200"
                    style={{
                      backgroundColor: selectedPrivacy === option.value ? '#e3f2ff' : 'transparent',
                      color: selectedPrivacy === option.value ? COLORS.primary : '#333',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedPrivacy !== option.value) {
                        e.currentTarget.style.backgroundColor = '#e3f2ff';
                        e.currentTarget.style.color = COLORS.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedPrivacy !== option.value) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#333';
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {option.value === 'public' && (
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {option.value === 'connections' && (
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                      {option.value === 'private' && (
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      <div>
                        <div className="font-medium text-[15px]">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full mt-4 px-4 py-3 text-center rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Posts Feed */}
      <div>
        {DUMMY_POSTS.length === 0 ? (
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
            <p className="text-sm">Be the first to share something!</p>
          </div>
        ) : (
          DUMMY_POSTS.map((post) => (
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

      {/* Notification Tester */}
      <NotificationTester />
    </div>
  );
}
