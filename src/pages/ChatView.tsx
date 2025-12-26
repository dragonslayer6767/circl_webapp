import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import ProfileModal from '../components/networking/ProfileModal';
import { NetworkUser } from '../types/network';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isFromCurrentUser: boolean;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead?: boolean;
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
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user data - in real app, fetch based on userId
  const chatUser: ChatUser = {
    id: userId || '100',
    name: userId === '100' ? 'Ken B' : 'Sai Darsh Kandukuri',
    company: 'Tech Innovations',
    position: 'CEO'
  };

  // Convert ChatUser to NetworkUser for ProfileModal
  const networkUser: NetworkUser = {
    user_id: parseInt(chatUser.id),
    email: '',
    name: chatUser.name,
    businessIndustry: chatUser.company || 'Technology',
    location: 'San Francisco, CA',
    connectionsCount: 250,
    circs: 1200,
    bio: 'Passionate entrepreneur building the future of technology.',
    skills: ['Leadership', 'Product Development', 'Team Building']
  };

  // Handler functions
  const handleReport = () => {
    setShowOptionsMenu(false);
    setShowReportModal(true);
  };

  const handleBlock = () => {
    setShowOptionsMenu(false);
    setShowBlockModal(true);
  };

  const confirmReport = (reason: string) => {
    console.log(`Reported user ${chatUser.name} for: ${reason}`);
    setShowReportModal(false);
    alert(`User reported successfully`);
  };

  const confirmBlock = () => {
    console.log(`Blocked user ${chatUser.name}`);
    setShowBlockModal(false);
    alert(`User blocked successfully`);
    navigate('/messages');
  };

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleAddMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return '🖼️';
    } else if (['pdf'].includes(ext || '')) {
      return '📄';
    } else if (['doc', 'docx'].includes(ext || '')) {
      return '📝';
    } else if (['xls', 'xlsx'].includes(ext || '')) {
      return '📊';
    } else if (['zip', 'rar'].includes(ext || '')) {
      return '🗜️';
    }
    return '📎';
  };

  // Mock messages
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        text: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 86400000),
        isFromCurrentUser: false,
        isRead: true
      },
      {
        id: '2',
        text: 'I\'m doing great! Just working on some exciting projects',
        timestamp: new Date(Date.now() - 86340000),
        isFromCurrentUser: true,
        isRead: true
      },
      {
        id: '3',
        text: userId === '100' ? 'I have games in my pants' : 'Yooo',
        timestamp: new Date(Date.now() - 3600000),
        isFromCurrentUser: false,
        isRead: true
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
    if (!messageText.trim() && selectedFiles.length === 0) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date(),
      isFromCurrentUser: true,
      isRead: false
    };

    // Handle file attachments
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0]; // For now, send one file at a time
      const isImage = file.type.startsWith('image/');
      
      if (isImage) {
        // Create preview URL for images
        newMessage.imageUrl = URL.createObjectURL(file);
      } else {
        // For other files, store metadata
        newMessage.fileUrl = URL.createObjectURL(file);
        newMessage.fileName = file.name;
        newMessage.fileSize = file.size;
      }
    }

    setMessages([...messages, newMessage]);
    setMessageText('');
    setSelectedFiles([]);

    // Simulate read receipt after 2 seconds
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, isRead: true } : msg
      ));
    }, 2000);

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message!',
        timestamp: new Date(),
        isFromCurrentUser: false,
        isRead: true
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

  // Filter messages for search
  const filteredMessages = searchText
    ? messages.filter(msg => msg.text.toLowerCase().includes(searchText.toLowerCase()))
    : messages;

  const filteredGroupedMessages = () => {
    const grouped: { [key: string]: ChatMessage[] } = {};
    filteredMessages.forEach(message => {
      const dateKey = formatDate(message.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });
    return grouped;
  };

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

          {/* Profile Section - Clickable */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center space-x-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          >
            {/* Profile Picture */}
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ backgroundColor: COLORS.yellow }}
            >
              {chatUser.name.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 text-left">
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
          </button>

          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-white hover:opacity-80 transition-opacity"
            title="Search messages"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Options Button */}
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="text-white hover:opacity-80 transition-opacity relative"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* Options Menu Dropdown */}
        {showOptionsMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowOptionsMenu(false)}
            />
            <div className="absolute top-24 right-4 w-48 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200">
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

        {/* Search Bar */}
        {showSearch && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search messages..."
                className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-sm"
                autoFocus
              />
              {searchText && (
                <button onClick={() => setSearchText('')} className="text-white/80 hover:text-white">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            {searchText && (
              <p className="text-white/70 text-xs mt-2">
                Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        <div className="h-px bg-white/10" />
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 relative"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag and Drop Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-blue-500 rounded-lg">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-semibold text-blue-600">Drop files here to send</p>
              <p className="text-sm text-gray-500">Images and documents supported</p>
            </div>
          </div>
        )}

        {searchText && filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium">No messages found</p>
            <p className="text-sm">Try different search terms</p>
          </div>
        ) : (
          Object.entries(searchText ? filteredGroupedMessages() : groupedMessages).map(([date, msgs]) => (
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
                          className={`rounded-2xl ${
                            message.isFromCurrentUser
                              ? 'rounded-br-sm'
                              : 'rounded-bl-sm'
                          } overflow-hidden`}
                          style={{
                            backgroundColor: message.isFromCurrentUser ? COLORS.primary : '#f3f4f6',
                            color: message.isFromCurrentUser ? 'white' : '#1f2937'
                          }}
                        >
                          {/* Image attachment */}
                          {message.imageUrl && (
                            <div className="max-w-sm">
                              <img 
                                src={message.imageUrl} 
                                alt="Shared image" 
                                className="w-full h-auto rounded-t-2xl cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(message.imageUrl, '_blank')}
                              />
                            </div>
                          )}
                          
                          {/* File attachment */}
                          {message.fileUrl && message.fileName && (
                            <div className="px-4 py-3 flex items-center gap-3 min-w-[200px]">
                              <div className="text-3xl">{getFileIcon(message.fileName)}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{message.fileName}</p>
                                {message.fileSize && (
                                  <p className="text-xs opacity-70">{formatFileSize(message.fileSize)}</p>
                                )}
                              </div>
                              <button
                                onClick={() => window.open(message.fileUrl, '_blank')}
                                className="flex-shrink-0 p-1 hover:bg-black/10 rounded"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          )}
                          
                          {/* Text message */}
                          {message.text && (
                            <p className={`text-sm leading-relaxed break-words ${message.imageUrl || message.fileUrl ? 'px-4 py-2.5' : 'px-4 py-2.5'}`}>
                              {message.text}
                            </p>
                          )}
                        </div>
                        
                        {/* Timestamp and Read Receipts */}
                        {showTimestamp && (
                          <div className={`flex items-center gap-1 mt-1 ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <p className="text-xs text-gray-500">
                              {formatTime(message.timestamp)}
                            </p>
                            {message.isFromCurrentUser && (
                              <div className="flex items-center gap-0.5">
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
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

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
        {/* File Preview Area */}
        {selectedFiles.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative bg-white border border-gray-300 rounded-lg p-2 flex items-center gap-2 max-w-xs">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded text-2xl">
                      {getFileIcon(file.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="flex-shrink-0 p-1 hover:bg-red-100 rounded text-red-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 flex items-end space-x-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Add Media Button */}
          <button
            onClick={handleAddMediaClick}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: COLORS.primary }}
            title="Add files or images"
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
            disabled={!messageText.trim() && selectedFiles.length === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-opacity ${
              messageText.trim() || selectedFiles.length > 0 ? 'opacity-100' : 'opacity-50'
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

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          user={networkUser}
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
                  <p className="text-sm text-gray-500">Why are you reporting {chatUser.name}?</p>
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
                  <h3 className="text-lg font-bold text-gray-900">Block {chatUser.name}?</h3>
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
}
