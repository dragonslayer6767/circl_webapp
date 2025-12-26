import { useState, useRef } from 'react';
import { COLORS } from '../../utils/colors';
import { NetworkUser } from '../../types/network';
import ProfileModal from '../networking/ProfileModal';

interface ChatViewProps {
  user: NetworkUser;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  isRead?: boolean;
}

const ChatView = ({ user, isOpen, onClose }: ChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! Thanks for connecting!`,
      sender: 'other',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true
    },
    {
      id: 2,
      text: `Hey! Great to connect with you. I saw your profile and I'm really interested in learning more about your work.`,
      sender: 'user',
      timestamp: new Date(Date.now() - 3000000),
      isRead: true
    },
    {
      id: 3,
      text: `Absolutely! I'd love to chat more about it. Are you free for a call this week?`,
      sender: 'other',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate send delay and mark as read after 2 seconds
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSending(false);
    
    // Simulate read receipt
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isRead: true } : m));
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReport = () => {
    setShowOptionsMenu(false);
    setShowReportModal(true);
  };

  const handleBlock = () => {
    setShowOptionsMenu(false);
    setShowBlockModal(true);
  };

  const confirmReport = (reason: string) => {
    console.log(`Reported user ${user.name} for: ${reason}`);
    setShowReportModal(false);
    // Show success toast
    alert(`User reported successfully`);
  };

  const confirmBlock = () => {
    console.log(`Blocked user ${user.name}`);
    setShowBlockModal(false);
    onClose();
    // Show success toast
    alert(`User blocked successfully`);
  };

  const filteredMessages = searchText
    ? messages.filter(m => m.text.toLowerCase().includes(searchText.toLowerCase()))
    : messages;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b shadow-sm relative"
        style={{ backgroundColor: COLORS.primary }}
      >
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-3 flex-1 ml-2 hover:bg-white/10 rounded-lg p-2 transition-colors"
        >
          {user.image ? (
            <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: COLORS.yellow }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <h2 className="text-white font-bold text-lg truncate">{user.name}</h2>
            <p className="text-white/80 text-sm truncate">{user.industry || user.businessIndustry}</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Search messages"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Options Menu */}
        {showOptionsMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowOptionsMenu(false)}
            />
            <div className="absolute top-full right-4 mt-2 w-40 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-gray-200">
              <button
                onClick={handleReport}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Report User</span>
              </button>
              <div className="border-t border-gray-200" />
              <button
                onClick={handleBlock}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Block User</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search messages..."
              className="flex-1 outline-none text-sm"
              autoFocus
            />
            {searchText && (
              <button onClick={() => setSearchText('')} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {searchText && (
            <p className="text-xs text-gray-500 mt-2">
              Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {filteredMessages.length === 0 && searchText ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium">No messages found</p>
            <p className="text-sm">Try different search terms</p>
          </div>
        ) : (
          <>
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'rounded-tr-sm text-white'
                        : 'rounded-tl-sm bg-white text-gray-900'
                    }`}
                    style={{
                      backgroundColor: message.sender === 'user' ? COLORS.primary : undefined
                    }}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <p className={`text-xs text-gray-500`}>
                      {formatTime(message.timestamp)}
                    </p>
                    {message.sender === 'user' && (
                      <div className="flex items-center gap-0.5 ml-1">
                        {message.isRead ? (
                          <>
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <svg className="w-3.5 h-3.5 text-blue-500 -ml-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex items-end gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent resize-none outline-none text-gray-900 placeholder-gray-500 max-h-32"
              rows={1}
              style={{ minHeight: '24px' }}
            />
            <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="p-3 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
            style={{ backgroundColor: COLORS.primary }}
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          user={user}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          isInNetwork={true}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50" 
            onClick={() => setShowReportModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 max-w-md mx-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">Report User</h3>
                  <p className="text-sm text-gray-500">Why are you reporting {user.name}?</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {[
                  { value: 'spam', label: 'Spam or misleading' },
                  { value: 'harassment', label: 'Harassment or bullying' },
                  { value: 'inappropriate', label: 'Inappropriate content' },
                  { value: 'fake', label: 'Fake account' },
                  { value: 'other', label: 'Other' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => confirmReport(option.value)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{option.label}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50" 
            onClick={() => setShowBlockModal(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 max-w-md mx-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">Block {user.name}?</h3>
                  <p className="text-sm text-gray-500 mt-1">They won't be able to:</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex items-start gap-2 text-sm text-red-900">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Send you messages</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-red-900">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>View your profile or posts</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-red-900">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Connect with you in any way</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBlock}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Block User
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatView;
