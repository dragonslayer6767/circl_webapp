import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { COLORS } from '../utils/colors';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isFromCurrentUser: boolean;
  imageUrl?: string;
}

interface ChatUser {
  id: string;
  name: string;
  profileImage?: string;
  company?: string;
  position?: string;
}

export default function ChatView() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Mock user data - in real app, fetch based on userId
  const chatUser: ChatUser = {
    id: userId || '100',
    name: userId === '100' ? 'Ken B' : 'Sai Darsh Kandukuri',
    company: 'Tech Innovations',
    position: 'CEO'
  };

  // Mock messages
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        text: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 86400000),
        isFromCurrentUser: false
      },
      {
        id: '2',
        text: 'I\'m doing great! Just working on some exciting projects',
        timestamp: new Date(Date.now() - 86340000),
        isFromCurrentUser: true
      },
      {
        id: '3',
        text: userId === '100' ? 'I have games in my pants' : 'Yooo',
        timestamp: new Date(Date.now() - 3600000),
        isFromCurrentUser: false
      }
    ];
    setMessages(mockMessages);
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date(),
      isFromCurrentUser: true
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message!',
        timestamp: new Date(),
        isFromCurrentUser: false
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'TODAY';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'YESTERDAY';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: ChatMessage[] } = {};
    messages.forEach(message => {
      const dateKey = formatDate(message.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex-shrink-0" style={{ backgroundColor: COLORS.primary }}>
        <div className="h-14" /> {/* Status bar spacer */}
        <div className="px-4 py-3 flex items-center space-x-3">
          {/* Back Button */}
          <button
            onClick={() => navigate('/messages')}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Profile Picture */}
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ backgroundColor: COLORS.yellow }}
          >
            {chatUser.name.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-sm truncate">
              {chatUser.name}
            </h2>
            {chatUser.position && (
              <p className="text-white/90 text-xs truncate">
                {chatUser.position}
              </p>
            )}
            {chatUser.company && (
              <p className="text-white/80 text-xs truncate">
                {chatUser.company}
              </p>
            )}
          </div>

          {/* Options Button */}
          <button className="text-white hover:opacity-80 transition-opacity">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        <div className="h-px bg-white/10" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex justify-center my-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                {date}
              </span>
            </div>

            {/* Messages */}
            {msgs.map((message, index) => {
              const showTimestamp = index === msgs.length - 1 || 
                msgs[index + 1]?.isFromCurrentUser !== message.isFromCurrentUser;
              
              return (
                <div
                  key={message.id}
                  className={`flex mb-2 ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[75%] ${message.isFromCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Profile Picture (only for received messages) */}
                    {!message.isFromCurrentUser && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: COLORS.yellow }}
                      >
                        {chatUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div>
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          message.isFromCurrentUser
                            ? 'rounded-br-sm'
                            : 'rounded-bl-sm'
                        }`}
                        style={{
                          backgroundColor: message.isFromCurrentUser ? COLORS.primary : '#F3F4F6',
                          color: message.isFromCurrentUser ? 'white' : '#1F2937'
                        }}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                      </div>
                      
                      {/* Timestamp */}
                      {showTimestamp && (
                        <p className={`text-xs text-gray-500 mt-1 ${message.isFromCurrentUser ? 'text-right' : 'text-left'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-end space-x-2 mb-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: COLORS.yellow }}
            >
              {chatUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="p-4 flex items-end space-x-3">
          {/* Add Media Button */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: COLORS.primary }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Text Input */}
          <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-3 max-h-32 overflow-y-auto">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Write a message..."
              className="w-full bg-transparent outline-none resize-none text-sm"
              rows={1}
              style={{ minHeight: '20px', maxHeight: '100px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-opacity ${
              messageText.trim() ? 'opacity-100' : 'opacity-50'
            }`}
            style={{ backgroundColor: COLORS.primary }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        <div className="h-8" /> {/* Bottom safe area */}
      </div>
    </div>
  );
}
