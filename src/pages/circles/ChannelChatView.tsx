import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useAuth } from '../../hooks/useAuth';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
}

export default function ChannelChatView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { circleId, channelId } = useParams<{ circleId: string; channelId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channelName, setChannelName] = useState('');
  const [circleName, setCircleName] = useState('');
  const [memberCount, setMemberCount] = useState(7);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
  const [appLinkCopied, setAppLinkCopied] = useState(false);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [showGroupFiles, setShowGroupFiles] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDashboardMemberListModal, setShowDashboardMemberListModal] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [availableChannels, setAvailableChannels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // TODO: Fetch channel and circle details from API
    // Mock data for now
    const mockChannels: { [key: string]: string } = {
      '1': 'General',
      '2': 'Random',
      '3': 'Announcements',
      '4': 'Tech-Talk',
      '5': 'Resources'
    };

    const mockCircleNames: { [key: string]: string } = {
      '1': 'Tech Leaders Council',
      '2': 'Growth Hackers'
    };

    setChannelName(mockChannels[channelId || '1'] || 'General');
    setCircleName(mockCircleNames[circleId || '1'] || 'Test');
    
    // TODO: Fetch from API - for now, circle 1 user is moderator
    setIsModerator(circleId === '1');
    
    // Set available channels for dropdown
    setAvailableChannels([
      { id: '1', name: 'General' },
      { id: '2', name: 'Random' },
      { id: '3', name: 'Announcements' },
      { id: '4', name: 'Tech-Talk' },
      { id: '5', name: 'Resources' }
    ]);

    // Mock online count
    setOnlineCount(Math.floor(Math.random() * memberCount) + 1);

    // Mock messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        text: 'Welcome to the channel!',
        timestamp: new Date(Date.now() - 3600000),
        senderId: 2,
        senderName: 'Sarah Chen',
        senderAvatar: 'https://i.pravatar.cc/150?img=2'
      },
      {
        id: '2',
        text: 'Excited to connect with everyone here!',
        timestamp: new Date(Date.now() - 3000000),
        senderId: 3,
        senderName: 'Mike Johnson',
        senderAvatar: 'https://i.pravatar.cc/150?img=3'
      },
      {
        id: '3',
        text: 'Testing message',
        timestamp: new Date(Date.now() - 1800000),
        senderId: 1,
        senderName: user?.fullname || 'You',
      }
    ];
    setMessages(mockMessages);
  }, [circleId, channelId, memberCount, user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: messageText,
        timestamp: new Date(),
        senderId: 1, // Current user
        senderName: 'You',
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyInviteLink = () => {
    const webLink = 'https://circl.app/signup'; // TODO: Replace with actual signup page URL
    navigator.clipboard.writeText(webLink);
    setInviteLinkCopied(true);
    setTimeout(() => setInviteLinkCopied(false), 2000);
  };

  const handleCopyAppLink = () => {
    const appLink = 'https://apps.apple.com/us/app/circl-co-creation-network/id6741139445';
    navigator.clipboard.writeText(appLink);
    setAppLinkCopied(true);
    setTimeout(() => setAppLinkCopied(false), 2000);
  };

  const handleShareInvite = (platform: string) => {
    const webLink = 'https://circl.app/signup';
    const message = `Join me on Circl - ${circleName}!`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(webLink)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(webLink)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(webLink)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(message)}&body=${encodeURIComponent(`Check out Circl: ${webLink}`)}`;
        break;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div 
        className="sticky top-0 z-10"
        style={{ backgroundColor: COLORS.primary }}
      >
        {/* Top row: Back button, Circle name, User info */}
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(`/circles/${circleId}`)}
            className="flex items-center space-x-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-white font-medium text-sm">Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-white">{circleName}</h1>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>

          <button
            onClick={() => setShowOptionsMenu(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Bottom row: Channel selector, member count, online status */}
        <div className="px-4 pb-3 flex items-center justify-center space-x-4">
          {/* Channel Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowChannelDropdown(!showChannelDropdown)}
              className="flex items-center space-x-1 bg-white rounded-full px-3 py-1 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">{channelName}</span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Channel Dropdown Menu */}
            {showChannelDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowChannelDropdown(false)}
                />
                <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] z-20">
                  {availableChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        navigate(`/circles/${circleId}/channel/${channel.id}`);
                        setShowChannelDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        channel.id === channelId ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      #{channel.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Member Count */}
          <div className="flex items-center space-x-1 text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm font-medium">{memberCount}</span>
          </div>

          {/* Online Status */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm font-medium text-white">Online</span>
          </div>
        </div>
      </div>

      {/* Channel Tag/Topic */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          #Welcome
        </span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === 1;
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar - always show on the side of the bubble */}
                <div className="flex-shrink-0">
                  {message.senderAvatar ? (
                    <img
                      src={message.senderAvatar}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: isCurrentUser ? COLORS.primary : '#6B7280' }}
                    >
                      {message.senderName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      isCurrentUser
                        ? 'text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                    }`}
                    style={isCurrentUser ? { backgroundColor: COLORS.primary } : {}}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 px-1 ${isCurrentUser ? 'text-right' : ''}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white px-4 py-3">
        <div className="flex items-end space-x-2">
          {/* Add Media Button */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
            <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${channelName}...`}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm max-h-32"
              rows={1}
              style={{ minHeight: '24px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="p-2 rounded-full transition-all disabled:opacity-40 flex-shrink-0"
          >
            <svg className="w-6 h-6" style={{ color: messageText.trim() ? COLORS.primary : '#9CA3AF' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Channel Options Menu */}
      {showOptionsMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowOptionsMenu(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl w-80 z-50 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {/* About This Circle */}
              <button
                onClick={() => {
                  setShowAboutModal(true);
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-base font-medium text-gray-900">About This Circle</span>
              </button>

              {/* Invite Network */}
              <button
                onClick={() => {
                  setShowInviteModal(true);
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                <span className="text-base font-medium text-gray-900">Invite Network</span>
              </button>

              {/* Members List */}
              <button
                onClick={() => {
                  if (isModerator) {
                    setShowDashboardMemberListModal(true);
                  } else {
                    setShowMembersModal(true);
                  }
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-base font-medium text-gray-900">Members List</span>
              </button>

              {/* Pinned Messages */}
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  // TODO: Implement pinned messages
                }}
                className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                <span className="text-base font-medium text-gray-900">Pinned Messages</span>
              </button>

              {/* Group Files */}
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  // TODO: Implement group files
                }}
                className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
                <span className="text-base font-medium text-gray-900">Group Files</span>
              </button>

              {/* Notification Settings */}
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  // TODO: Implement notification settings
                }}
                className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="text-base font-medium text-gray-900">Notification Settings</span>
              </button>

              {/* Leave Circle */}
              <button
                onClick={() => {
                  setShowLeaveConfirm(true);
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-red-50 transition-colors text-left"
              >
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                <span className="text-base font-medium text-red-600">Leave Circle</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">About {circleName}</h2>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              This is a channel for general discussions and announcements in {circleName}.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>{memberCount} members</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>{onlineCount} online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Network Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Invite to Circl</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Web Invite Section */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Invite to Web Platform</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Share this link for friends to sign up on the Circl web platform
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value="https://circl.app/signup"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="px-4 py-2.5 rounded-lg font-semibold text-white transition-colors"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {inviteLinkCopied ? (
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Copied!</span>
                      </span>
                    ) : (
                      'Copy Link'
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* App Store Invite Section */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Invite to iOS App</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Share this link for friends to download Circl from the App Store
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value="https://apps.apple.com/us/app/circl-co-creation-network/id6741139445"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700"
                  />
                  <button
                    onClick={handleCopyAppLink}
                    className="px-4 py-2.5 rounded-lg font-semibold text-white transition-colors"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {appLinkCopied ? (
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Copied!</span>
                      </span>
                    ) : (
                      'Copy Link'
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Options */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Share via</h4>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => handleShareInvite('twitter')}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-6 h-6 text-blue-400 mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span className="text-xs text-gray-600">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShareInvite('facebook')}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-6 h-6 text-blue-600 mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-xs text-gray-600">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShareInvite('linkedin')}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-6 h-6 text-blue-700 mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-xs text-gray-600">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShareInvite('email')}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-xs text-gray-600">Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Members ({memberCount})</h2>
              <button
                onClick={() => setShowMembersModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <p className="text-gray-500 text-center py-8">Member list coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Member List Modal (for moderators) */}
      {showDashboardMemberListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Dashboard Members</h2>
              <button
                onClick={() => setShowDashboardMemberListModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Moderator Access</span>
                  <span className="text-xs text-gray-500">Can manage dashboard</span>
                </div>
              </div>
              <p className="text-gray-500 text-center py-8">Dashboard member management coming soon...</p>
            </div>
          </div>
        </div>
      )}

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Leave Circle?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to leave {circleName}? You can rejoin later if needed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLeaveConfirm(false);
                  navigate(`/circles/${circleId}`);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
