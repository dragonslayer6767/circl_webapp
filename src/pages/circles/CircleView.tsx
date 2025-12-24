import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';

interface Circle {
  id: number;
  name: string;
  industry: string;
  description: string;
  member_count: number;
  is_moderator: boolean;
  has_dashboard: boolean;
  is_dashboard_public: boolean;
}

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

export default function CircleView() {
  const { circleId } = useParams<{ circleId: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [circle, setCircle] = useState<Circle | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [myCircles, setMyCircles] = useState<Circle[]>([]); // TODO: Use for circle switcher dropdown
  console.log(myCircles); // Suppress unused variable warning
  const [showSettings, setShowSettings] = useState(false);
  const [showCircleSwitcher, setShowCircleSwitcher] = useState(false);

  useEffect(() => {
    if (circleId) {
      // TODO: Fetch circle data from API
      // Mock data for now
      const mockCircle: Circle = {
        id: parseInt(circleId),
        name: 'Test',
        industry: '',
        description: 'Test circle',
        member_count: 7,
        is_moderator: false,
        has_dashboard: true,
        is_dashboard_public: false
      };

      const mockAnnouncements: Announcement[] = [
        {
          id: 1,
          title: 'Test announcement',
          content: 'Test announcement content',
          created_by: 'Harris',
          created_at: 'Recently'
        }
      ];

      const mockThreads: Thread[] = [
        {
          id: 1,
          author: 'Bha',
          content: 'raj is here',
          created_at: '2 hours ago',
          likes: 0,
          comments: 0
        },
        {
          id: 2,
          author: 'Bha',
          content: 'nice',
          created_at: '2 hours ago',
          likes: 0,
          comments: 0
        },
        {
          id: 3,
          author: 'Bha',
          content: 'ok',
          created_at: '2 hours ago',
          likes: 0,
          comments: 0
        },
        {
          id: 4,
          author: 'Bha',
          content: 'test thread',
          created_at: '2 hours ago',
          likes: 0,
          comments: 0
        }
      ];

      const mockChannels: Channel[] = [
        {
          id: 1,
          name: 'Welcome',
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

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="text-lg text-gray-600">Loading circle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Header Tabs */}
      <div className="sticky top-16 z-20" style={{ backgroundColor: COLORS.primary }}>
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
      </div>

      {/* Main Content */}
      {activeTab === 'home' && (
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
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-blue-50 hover:shadow-md transition-shadow"
              style={{ color: COLORS.primary }}
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Announcements Section */}
          <div className="mb-6 px-5">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
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
                onClick={() => console.log('Create thread - TODO')}
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
      )}

      {activeTab === 'dashboard' && (
        <div className="max-w-6xl mx-auto px-5 py-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Coming Soon</h3>
            <p className="text-gray-600">Circle dashboard features are under development</p>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="max-w-6xl mx-auto px-5 py-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Calendar Coming Soon</h3>
            <p className="text-gray-600">Circle event calendar is under development</p>
          </div>
        </div>
      )}
    </div>
  );
}
