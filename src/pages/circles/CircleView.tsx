import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { Circle } from '../../types/circle';
import CalendarView from './components/CalendarView';
import DashboardView from './components/DashboardView';
import CircleSettingsMenu from './components/CircleSettingsMenu.tsx';
import CreateThreadModal from './components/CreateThreadModal';
import ResizablePanels from '../../components/circles/ResizablePanels';

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
}

interface Thread {
  id: number;
  author: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
}

interface Channel {
  id: number;
  name: string;
  category: string;
}

type TabType = 'home' | 'dashboard' | 'calendar';
type PanelType = 'home' | 'dashboard' | 'calendar';

export default function CircleView() {
  const { circleId } = useParams<{ circleId: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activePanels, setActivePanels] = useState<PanelType[]>(['home']);
  const [circle, setCircle] = useState<Circle | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [myCircles, setMyCircles] = useState<Circle[]>([]); // TODO: Use for circle switcher dropdown
  console.log(myCircles); // Suppress unused variable warning
  const [showSettings, setShowSettings] = useState(false);
  const [showCircleSwitcher, setShowCircleSwitcher] = useState(false);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [isPanelMode, setIsPanelMode] = useState(false);

  useEffect(() => {
    if (circleId) {
      // TODO: Fetch circle data from API
      // Mock data for now - different data based on circleId
      const currentUserId = 1; // TODO: Get from auth context
      const id = parseInt(circleId);

      // Circle 1: Tech Leaders Council (User is moderator)
      // Circle 2: Growth Hackers (User is not moderator)
      const mockCircles: { [key: number]: Circle } = {
        1: {
          id: 1,
          name: 'Tech Leaders Council',
          industry: 'Technology',
          pricing: 'Premium',
          description: 'An exclusive circle for technology leaders to discuss innovation, strategy, and industry trends.',
          join_type: 'Join Now',
          member_count: 42,
          is_private: false,
          creator_id: currentUserId,
          is_moderator: true,
          has_dashboard: true,
          is_dashboard_public: false
        },
        2: {
          id: 2,
          name: 'Growth Hackers',
          industry: 'Marketing',
          pricing: '',
          description: 'Connect with growth-focused professionals. Discuss strategies, tactics, and tools for scaling businesses rapidly.',
          join_type: 'Join Now',
          member_count: 156,
          is_private: false,
          creator_id: 5,
          is_moderator: false,
          has_dashboard: true,
          is_dashboard_public: true
        }
      };

      const mockCircle = mockCircles[id] || {
        id: id,
        name: 'Test Circle',
        industry: 'Technology',
        pricing: 'Free',
        description: 'Test circle',
        join_type: 'Join Now',
        member_count: 7,
        is_private: false,
        creator_id: currentUserId,
        is_moderator: false,
        has_dashboard: true,
        is_dashboard_public: false
      };

      const mockAnnouncements: Announcement[] = id === 1 ? [
        {
          id: 1,
          title: 'Welcome to Tech Leaders Council!',
          content: 'We\'re excited to have you here. Share your insights and connect with fellow tech leaders.',
          created_by: 'Admin',
          created_at: '2 days ago'
        }
      ] : [
        {
          id: 1,
          title: 'Monthly Growth Challenge',
          content: 'Join our monthly challenge to grow your user base by 20%!',
          created_by: 'Community Manager',
          created_at: '1 day ago'
        }
      ];

      const mockThreads: Thread[] = id === 1 ? [
        {
          id: 1,
          author: 'Sarah Johnson',
          content: 'What are your thoughts on the latest AI developments? How is everyone integrating AI into their tech stack?',
          created_at: '3 hours ago',
          likes: 12,
          comments: 5
        },
        {
          id: 2,
          author: 'Michael Chen',
          content: 'Looking for recommendations on cloud infrastructure providers. What has been your experience?',
          created_at: '5 hours ago',
          likes: 8,
          comments: 3
        }
      ] : [
        {
          id: 1,
          author: 'Alex Martinez',
          content: 'Just hit 10k users with our product launch! Here are the growth tactics that worked...',
          created_at: '2 hours ago',
          likes: 24,
          comments: 8
        },
        {
          id: 2,
          author: 'Emily Davis',
          content: 'Anyone experimenting with viral loops? Would love to share notes.',
          created_at: '4 hours ago',
          likes: 15,
          comments: 6
        }
      ];

      const mockChannels: Channel[] = id === 1 ? [
        {
          id: 1,
          name: 'General',
          category: 'General'
        },
        {
          id: 2,
          name: 'Innovation',
          category: 'General'
        },
        {
          id: 3,
          name: 'Strategy',
          category: 'General'
        }
      ] : [
        {
          id: 1,
          name: 'General',
          category: 'General'
        },
        {
          id: 2,
          name: 'Growth Tactics',
          category: 'General'
        }
      ];

      setCircle(mockCircle);
      setAnnouncements(mockAnnouncements);
      setThreads(mockThreads);
      setChannels(mockChannels);
      setMyCircles([mockCircle]);
    }
  }, [circleId]);

  // Handle adding/removing panels
  const togglePanel = (panelType: PanelType) => {
    setActivePanels((prev) => {
      if (prev.includes(panelType)) {
        // Remove panel - but keep at least one panel
        if (prev.length > 1) {
          return prev.filter((p) => p !== panelType);
        }
        return prev;
      } else {
        // Add panel (max 3)
        if (prev.length >= 3) {
          return [...prev.slice(1), panelType];
        }
        return [...prev, panelType];
      }
    });
  };

  const removePanel = (panelId: string) => {
    setActivePanels((prev) => {
      // Keep at least one panel
      if (prev.length > 1) {
        return prev.filter((p) => p !== panelId);
      }
      return prev;
    });
  };

  // Render panel content based on type (simplified for panel view)
  const renderPanelContent = (panelType: PanelType) => {
    if (!circle) return null;
    
    switch (panelType) {
      case 'home':
        return renderHomePanelContent();
      case 'dashboard':
        return (
          <DashboardView
            circleId={circle.id}
            circleName={circle.name}
            circleIndustry={circle.industry}
            circlePricing="Free"
            memberCount={circle.member_count}
            isModerator={circle.is_moderator}
          />
        );
      case 'calendar':
        return (
          <CalendarView 
            circleId={circle.id}
            circleName={circle.name}
            isModerator={circle.is_moderator}
          />
        );
      default:
        return null;
    }
  };

  // Simplified home content for panel view (no circle switcher/settings)
  const renderHomePanelContent = () => {
    if (!circle) return null;
    
    return (
      <div className="w-full">
        {/* Announcements Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.88 8.61c.1.51.12 1.02.12 1.53 0 .51-.02 1.02-.12 1.53-.98 5.19-5.69 9.08-11.17 9.08-1.08 0-2.13-.14-3.15-.42l-2.88 2.88c-.24.24-.64.24-.88 0-.24-.24-.24-.64 0-.88l2.88-2.88c-2.78-1.93-4.65-5.05-4.65-8.63 0-.51.02-1.02.12-1.53.98-5.19 5.69-9.08 11.17-9.08 1.08 0 2.13.14 3.15.42l2.88-2.88c.24-.24.64-.24.88 0 .24.24.24.64 0 .88l-2.88 2.88c2.78 1.93 4.65 5.05 4.65 8.63zm-11.88-6.46c-4.27 0-8.02 3.15-8.66 7.35-.07.41-.11.83-.11 1.25 0 .42.04.84.11 1.25.64 4.2 4.39 7.35 8.66 7.35s8.02-3.15 8.66-7.35c.07-.41.11-.83.11-1.25 0-.42-.04-.84-.11-1.25-.64-4.2-4.39-7.35-8.66-7.35zm0 4.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
            </svg>
            <h2 className="text-base font-bold text-gray-900">Announcements</h2>
          </div>

          {announcements.map((announcement) => (
            <div 
              key={announcement.id}
              className="rounded-2xl px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity mb-3 w-full"
              style={{ backgroundColor: COLORS.primary }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate">{announcement.title}</h3>
                  <p className="text-white text-xs mt-1 opacity-90 truncate">By {announcement.created_by} · {announcement.created_at}</p>
                </div>
                <svg className="w-4 h-4 text-white flex-shrink-0 ml-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Circle Threads Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-900">Circle Threads</h2>
              <p className="text-xs text-gray-500 mt-0.5">Share ideas and discussions</p>
            </div>
            <button
              onClick={() => setShowCreateThread(true)}
              className="flex items-center space-x-1.5 text-white font-semibold px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all text-xs flex-shrink-0 ml-2"
              style={{ backgroundColor: COLORS.primary }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>New</span>
            </button>
          </div>

          {/* Threads Grid (not horizontal scroll in panels) */}
          <div className="space-y-3 w-full">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <div 
                  key={thread.id}
                  className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full"
                >
                  <div className="flex items-center space-x-2.5 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {thread.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-gray-900 truncate">{thread.author}</div>
                      <div className="text-xs text-gray-500">{thread.created_at}</div>
                    </div>
                  </div>
                  <p className="text-gray-800 text-xs mb-3 line-clamp-3">{thread.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xs">{thread.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xs">{thread.comments}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div 
                className="h-32 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed w-full"
                style={{ borderColor: `${COLORS.primary}20`, backgroundColor: `${COLORS.primary}05` }}
              >
                <svg className="w-7 h-7 mb-2 opacity-40" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-gray-600">No threads yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Channels Section */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-900">Channels</h2>
              <p className="text-xs text-gray-500 mt-0.5">Join conversations by topic</p>
            </div>
            <div 
              className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2"
              style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
            >
              {channels.length}
            </div>
          </div>

          <div className="space-y-2 w-full">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => navigate(`/circles/${circleId}/channel/${channel.id}`)}
                className="w-full flex items-center justify-between bg-white rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: `${COLORS.primary}`, color: 'white' }}
                  >
                    #
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-semibold text-xs text-gray-900 truncate">#{channel.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">Tap to join</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getPanelTitle = (panelType: PanelType): string => {
    switch (panelType) {
      case 'home':
        return 'Home';
      case 'dashboard':
        return 'Dashboard';
      case 'calendar':
        return 'Calendar';
      default:
        return panelType;
    }
  };

  const renderHomeContent = () => {
    if (!circle) return null;
    
    return (
    <div className="max-w-6xl mx-auto px-5 pb-24">
      {/* Circle Switcher & Settings */}
      <div className="flex items-center space-x-3 pt-4 mb-4">
            {/* Circle Switcher Button */}
            <button
              onClick={() => setShowCircleSwitcher(!showCircleSwitcher)}
              className="flex-1 flex items-center space-x-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-blue-50 hover:shadow-md transition-shadow"
            >
              {/* Circle Avatar */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0066ff)` }}
              >
                {circle.name.charAt(0).toUpperCase()}
              </div>

              {/* Circle Info */}
              <div className="flex-1 text-left">
                <div className="text-lg font-semibold text-gray-900">{circle.name}</div>
                <div className="text-xs font-medium text-gray-500">Tap to switch circles</div>
              </div>

              {/* Chevron */}
              <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg"
              style={{
                color: 'white',
                backgroundColor: COLORS.primary,
                boxShadow: '0 4px 12px rgba(0, 74, 173, 0.3)'
              }}
              title="Settings"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94 0 .33.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.1-.62l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </button>
          </div>

          {/* Settings Menu */}
          {showSettings && circle && (
            <CircleSettingsMenu
              circleId={circle.id}
              circleName={circle.name}
              circle={circle}
              isModerator={circle.is_moderator}
              currentUserId={1} // TODO: Get from auth context
              onClose={() => setShowSettings(false)}
            />
          )}

          {/* Announcements Section */}
          <div className="mb-6 px-5">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.88 8.61c.1.51.12 1.02.12 1.53 0 .51-.02 1.02-.12 1.53-.98 5.19-5.69 9.08-11.17 9.08-1.08 0-2.13-.14-3.15-.42l-2.88 2.88c-.24.24-.64.24-.88 0-.24-.24-.24-.64 0-.88l2.88-2.88c-2.78-1.93-4.65-5.05-4.65-8.63 0-.51.02-1.02.12-1.53.98-5.19 5.69-9.08 11.17-9.08 1.08 0 2.13.14 3.15.42l2.88-2.88c.24-.24.64-.24.88 0 .24.24.24.64 0 .88l-2.88 2.88c2.78 1.93 4.65 5.05 4.65 8.63zm-11.88-6.46c-4.27 0-8.02 3.15-8.66 7.35-.07.41-.11.83-.11 1.25 0 .42.04.84.11 1.25.64 4.2 4.39 7.35 8.66 7.35s8.02-3.15 8.66-7.35c.07-.41.11-.83.11-1.25 0-.42-.04-.84-.11-1.25-.64-4.2-4.39-7.35-8.66-7.35zm0 4.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
              </svg>
              <h2 className="text-base font-bold text-gray-900">Announcements</h2>
            </div>

            {announcements.map((announcement) => (
              <div 
                key={announcement.id}
                className="rounded-2xl px-5 py-4 cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.primary }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base">{announcement.title}</h3>
                    <p className="text-white text-sm mt-1 opacity-90">By {announcement.created_by} · {announcement.created_at}</p>
                  </div>
                  <svg className="w-5 h-5 text-white flex-shrink-0 ml-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Circle Threads Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-5 mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Circle Threads</h2>
                <p className="text-xs text-gray-500 mt-0.5">Share ideas and discussions</p>
              </div>
              <button
                onClick={() => setShowCreateThread(true)}
                className="flex items-center space-x-1.5 text-white font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
                style={{ backgroundColor: COLORS.primary }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm">New</span>
              </button>
            </div>

            {/* Threads Horizontal Scroll */}
            <div className="overflow-x-auto pb-4 -mx-5 px-5">
              <div className="flex space-x-3">
                {threads.length > 0 ? (
                  threads.map((thread) => (
                    <div 
                      key={thread.id}
                      className="flex-shrink-0 w-64 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5 mb-3">
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: COLORS.primary }}
                        >
                          {thread.author.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900">{thread.author}</div>
                          <div className="text-xs text-gray-500">{thread.created_at}</div>
                        </div>
                      </div>
                      <p className="text-gray-800 text-sm mb-4">{thread.content}</p>
                      <div className="flex items-center space-x-5 text-sm text-gray-500">
                        <button className="flex items-center space-x-1.5 hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-xs">{thread.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-xs">{thread.comments}</span>
                        </button>
                        <button className="ml-auto hover:text-blue-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div 
                    className="flex-shrink-0 w-64 h-32 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed"
                    style={{ borderColor: `${COLORS.primary}20`, backgroundColor: `${COLORS.primary}05` }}
                  >
                    <svg className="w-7 h-7 mb-2 opacity-40" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">No threads yet</p>
                    <p className="text-xs text-gray-500 text-center px-4 mt-1">Be the first to start a discussion!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div 
            className="h-px my-4 mx-5"
            style={{ background: `linear-gradient(90deg, transparent, ${COLORS.primary}20, transparent)` }}
          />

          {/* Channels Section */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Channels</h2>
                <p className="text-xs text-gray-500 mt-0.5">Join conversations by topic</p>
              </div>
              <div 
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
              >
                {channels.length} channels
              </div>
            </div>

            {/* Channel Categories */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2.5">General</h3>
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => navigate(`/circles/${circleId}/channel/${channel.id}`)}
                    className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 mb-2 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: `${COLORS.primary}`, color: 'white' }}
                      >
                        #
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm text-gray-900">#{channel.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Tap to join conversation</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
    );
  };

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="text-lg text-gray-600">Loading circle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Floating View Mode Toggle */}
      <div className="fixed top-20 left-4 z-30 flex items-center space-x-2 bg-white rounded-lg shadow-lg p-1">
        <button
          onClick={() => {
            setIsPanelMode(false);
            setActivePanels([activeTab]);
          }}
          className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
            !isPanelMode 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Single View
        </button>
        <button
          onClick={() => setIsPanelMode(true)}
          className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
            isPanelMode 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Multi-Panel
        </button>
      </div>

      {/* Header with Tabs and Panel Controls */}
      <div className="sticky top-16 z-20" style={{ backgroundColor: COLORS.primary }}>
        {!isPanelMode ? (
          // Single view mode - show tabs
          <div className="flex justify-center items-center">
            {/* Dashboard Tab (if enabled) */}
            {circle.has_dashboard && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex flex-col items-center flex-1 py-3"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                  </svg>
                  <span className={`text-white text-sm ${activeTab === 'dashboard' ? 'font-semibold' : 'font-normal opacity-70'}`}>
                    Dashboard
                  </span>
                </div>
                <div className={`h-0.5 w-16 mt-2 transition-all ${activeTab === 'dashboard' ? 'bg-white' : 'bg-transparent'}`} />
              </button>
            )}

            {/* Home Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex flex-col items-center flex-1 py-3"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className={`text-white text-sm ${activeTab === 'home' ? 'font-semibold' : 'font-normal opacity-70'}`}>
                  Home
                </span>
              </div>
              <div className={`h-0.5 w-12 mt-2 transition-all ${activeTab === 'home' ? 'bg-white' : 'bg-transparent'}`} />
            </button>

            {/* Calendar Tab */}
            <button
              onClick={() => setActiveTab('calendar')}
              className="flex flex-col items-center flex-1 py-3"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className={`text-white text-sm ${activeTab === 'calendar' ? 'font-semibold' : 'font-normal opacity-70'}`}>
                  Calendar
                </span>
              </div>
              <div className={`h-0.5 w-16 mt-2 transition-all ${activeTab === 'calendar' ? 'bg-white' : 'bg-transparent'}`} />
            </button>
          </div>
        ) : (
          // Multi-panel mode - show panel controls
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-medium">Panels:</span>
                {(['home', 'dashboard', 'calendar'] as PanelType[]).map((panelType) => {
                  if (panelType === 'dashboard' && !circle.has_dashboard) return null;
                  const isActive = activePanels.includes(panelType);
                  return (
                    <button
                      key={panelType}
                      onClick={() => togglePanel(panelType)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-white text-blue-600'
                          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                      }`}
                      disabled={activePanels.length === 1 && isActive}
                    >
                      {getPanelTitle(panelType)}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => {
                  setIsPanelMode(false);
                  setActivePanels([activeTab]);
                }}
                className="text-white text-opacity-70 hover:text-opacity-100 text-xs font-medium"
              >
                Exit Multi-Panel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      {!isPanelMode ? (
        // Single view mode
        <>
          {activeTab === 'home' && renderHomeContent()}

          {activeTab === 'dashboard' && circle && (
            <DashboardView
              circleId={circle.id}
              circleName={circle.name}
              circleIndustry={circle.industry}
              circlePricing="Free"
              memberCount={circle.member_count}
              isModerator={circle.is_moderator}
            />
          )}

          {activeTab === 'calendar' && circle && (
            <CalendarView 
              circleId={circle.id}
              circleName={circle.name}
              isModerator={circle.is_moderator}
            />
          )}
        </>
      ) : (
        // Multi-panel mode
        <div className="h-[calc(100vh-8rem)] px-5" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="max-w-7xl mx-auto h-full">
            <ResizablePanels
              panels={activePanels.map((panelType) => ({
                id: panelType,
                title: getPanelTitle(panelType),
                content: renderPanelContent(panelType),
              }))}
              onClose={removePanel}
            />
          </div>
        </div>
      )}

      {/* Create Thread Modal */}
      {showCreateThread && channels.length > 0 && (
        <CreateThreadModal
          isOpen={showCreateThread}
          onClose={() => setShowCreateThread(false)}
          circleId={circle?.id || 0}
          circleName={circle?.name || ''}
          channelId={channels[0].id}
          channelName={channels[0].name}
          onThreadCreated={() => {
            // TODO: Refresh threads
            console.log('Thread created');
          }}
        />
      )}
    </div>
  );
}
