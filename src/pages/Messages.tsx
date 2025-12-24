import { useState } from 'react';
import { COLORS } from '../utils/colors';
import { Conversation, NetworkUser } from '../types/messages';

export default function Messages() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-white border-b border-gray-200 p-6 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-3.5">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search for users in your network..."
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                />
                {searchText && (
                  <button onClick={handleClearSearch} className="ml-2">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Suggested Users Dropdown */}
              {suggestedUsers.length > 0 && searchText && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg overflow-hidden z-20 border border-gray-200">
                  {suggestedUsers.slice(0, 5).map((user, index) => (
                    <div key={user.id}>
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                      >
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ backgroundColor: COLORS.yellow }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.company || 'Network Connection'}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              disabled={!selectedUser}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
                selectedUser ? 'opacity-100 scale-100' : 'opacity-50 scale-75'
              }`}
              style={{ backgroundColor: COLORS.primary }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {mockConversations.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
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
              onClick={() => window.location.href = '/network'}
              className="px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
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
          <div className="py-4">
            {mockConversations.map((conversation) => (
              <button
                key={conversation.userId}
                className="w-full px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center space-x-4"
              >
                {/* Profile Image */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 relative"
                  style={{ backgroundColor: COLORS.yellow }}
                >
                  {conversation.userName.charAt(0).toUpperCase()}
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
                    </div>
                  )}
                </div>

                {/* Message Info */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {conversation.userName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="text-sm text-gray-500 flex-shrink-0">
                  {conversation.timestamp}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
