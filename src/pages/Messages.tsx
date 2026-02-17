import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import { Conversation, NetworkUser } from '../types/messages';
import { useAuth } from '../hooks/useAuth';
import { userService, NetworkContact } from '../services/userServices';

export default function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState<NetworkUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null);
  const [networkContacts, setNetworkContacts] = useState<NetworkContact[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user?.user_id) return;
    userService.getNetwork(user.user_id).then((contacts) => {
      setNetworkContacts(contacts);
      // Map contacts to conversations
      setConversations(
        contacts.map((c) => ({
          userId: c.user_id.toString(),
          userName: c.name,
          userImage: c.profile_image,
          lastMessage: c.last_message || '',
          timestamp: c.last_message_timestamp || '',
          unreadCount: c.unread_count || 0,
        }))
      );
    }).catch((err) => console.error('Failed to load network:', err));
  }, [user?.user_id]);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    if (value.trim() === '') {
      setSuggestedUsers([]);
      setSelectedUser(null);
    } else {
      const filtered = networkContacts
        .filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
        .map((c) => ({ id: c.user_id.toString(), name: c.name, email: c.email, profile_image: c.profile_image }));
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
      navigate(`/chat/${selectedUser.id}`);
      setSearchText('');
      setSuggestedUsers([]);
      setSelectedUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
                    if (searchText) handleSearchChange(searchText);
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
                        className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 group"
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
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {conversations.length === 0 ? (
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
            {conversations.map((conversation) => (
              <button
                key={conversation.userId}
                onClick={() => navigate(`/chat/${conversation.userId}`)}
                className={`w-full rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] p-5 flex items-start space-x-4 group ${
                  conversation.unreadCount > 0 
                    ? 'bg-gray-50 border-2 border-gray-200' 
                    : 'bg-white border border-gray-100'
                }`}
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
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
                    </div>
                  )}
                </div>

                {/* Message Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg ${conversation.unreadCount > 0 ? 'font-extrabold text-gray-900' : 'font-bold text-gray-900'}`}>
                      {conversation.userName}
                    </h3>
                    <span className={`text-sm flex-shrink-0 ml-2 font-medium ${
                      conversation.unreadCount > 0 ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className={`rounded-xl px-4 py-2.5 ${
                    conversation.unreadCount > 0 
                      ? 'bg-gray-100 border-2 border-gray-200' 
                      : 'bg-gray-50 border border-gray-100'
                  }`}>
                    <p className={`text-sm line-clamp-2 ${
                      conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-700'
                    }`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-gray-700">
                        {conversation.unreadCount} new message{conversation.unreadCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
