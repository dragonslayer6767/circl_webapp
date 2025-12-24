import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import { Conversation, NetworkUser } from '../types/messages';

export default function Messages() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState<NetworkUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null);

  // Mock data for network users (for search)
  const mockNetworkUsers: NetworkUser[] = [
    { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', company: 'Tech Innovations' },
    { id: '2', name: 'James Wilson', email: 'james@example.com', company: 'E-commerce Co' },
    { id: '3', name: 'Priya Patel', email: 'priya@example.com', company: 'Healthcare Plus' },
    { id: '4', name: 'Alex Rodriguez', email: 'alex@example.com', company: 'Finance Group' },
    { id: '5', name: 'Emma Thompson', email: 'emma@example.com', company: 'EdTech Solutions' },
  ];

  // Mock conversations data
  const mockConversations: Conversation[] = [
    {
      userId: '100',
      userName: 'Ken B',
      lastMessage: 'I have games in my pants',
      timestamp: 'Oct 27',
      unreadCount: 0
    },
    {
      userId: '101',
      userName: 'Sai Darsh Kandukuri',
      lastMessage: 'Yooo',
      timestamp: 'Sep 6',
      unreadCount: 0
    }
  ];

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    if (value.trim() === '') {
      setSuggestedUsers([]);
      setSelectedUser(null);
    } else {
      const filtered = mockNetworkUsers.filter(user =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedUsers(filtered);
    }
  };

  const handleUserSelect = (user: NetworkUser) => {
    setSelectedUser(user);
    setSearchText(user.name);
    setTimeout(() => {
      setSuggestedUsers([]);
    }, 50);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setSuggestedUsers([]);
    setSelectedUser(null);
  };

  const handleOpenChat = () => {
    if (selectedUser) {
      // Navigate to chat view with selected user
      console.log('Opening chat with:', selectedUser);
      // TODO: Implement navigation to chat view
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-blue-50/10">
      {/* Search Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-3.5 transition-all hover:bg-gray-200">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (searchText) {
                      const filtered = mockNetworkUsers.filter(user =>
                        user.name.toLowerCase().includes(searchText.toLowerCase())
                      );
                      setSuggestedUsers(filtered);
                    }
                  }}
                  placeholder="Search for users in your network..."
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                />
                {searchText && (
                  <button onClick={handleClearSearch} className="ml-2 hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Suggested Users Dropdown */}
              {suggestedUsers.length > 0 && searchText && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-20 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  {suggestedUsers.slice(0, 5).map((user, index) => (
                    <div key={user.id}>
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="w-full px-4 py-3 hover:bg-blue-50 transition-colors flex items-center space-x-3 group"
                      >
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: COLORS.yellow }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.company || 'Network Connection'}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {index < suggestedUsers.length - 1 && <div className="border-t border-gray-100 mx-4" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleOpenChat}
              disabled={!selectedUser}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${
                selectedUser 
                  ? 'opacity-100 scale-100 hover:scale-110' 
                  : 'opacity-50 scale-75 cursor-not-allowed'
              }`}
              style={{ 
                backgroundColor: COLORS.primary,
                boxShadow: selectedUser ? `0 4px 12px ${COLORS.primary}40` : 'none'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {mockConversations.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
              style={{ backgroundColor: COLORS.primary + '15' }}
            >
              <svg className="w-12 h-12" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Messages Yet</h2>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              Start a conversation with someone in your network
            </p>
            <button
              onClick={() => navigate('/network')}
              className="px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all hover:scale-105 flex items-center space-x-2 shadow-lg"
              style={{ backgroundColor: COLORS.primary }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Discover People</span>
            </button>
          </div>
        ) : (
          /* Conversation List */
          <div className="space-y-3">
            {mockConversations.map((conversation) => (
              <button
                key={conversation.userId}
                onClick={() => navigate(`/chat/${conversation.userId}`)}
                className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border border-gray-100 p-5 flex items-start space-x-4 group"
              >
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: COLORS.yellow }}
                  >
                    {conversation.userName.charAt(0).toUpperCase()}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
                    </div>
                  )}
                </div>

                {/* Message Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {conversation.userName}
                    </h3>
                    <span className="text-sm text-gray-500 font-medium flex-shrink-0 ml-2">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
