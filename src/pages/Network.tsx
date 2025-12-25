import { useState } from 'react';
import { COLORS } from '../utils/colors';
import { NetworkUser } from '../types/network';
import NetworkCard from '../components/networking/NetworkCard';

type NetworkTab = 'connect' | 'mentors' | 'myNetwork';

export default function Network() {
  const [activeTab, setActiveTab] = useState<NetworkTab>('connect');
  const [declinedUsers, setDeclinedUsers] = useState<Set<number>>(new Set());
  const [pendingRequests, setPendingRequests] = useState<NetworkUser[]>([
    {
      user_id: 201,
      email: 'marcus.lee@example.com',
      name: 'Marcus Lee',
      businessStage: 'Growth',
      businessIndustry: 'Technology',
      tags: ['AI', 'SaaS'],
      bio: 'Building the future of enterprise software',
      profileImageURL: 'https://i.pravatar.cc/150?img=20'
    },
    {
      user_id: 202,
      email: 'sophia.martinez@example.com',
      name: 'Sophia Martinez',
      businessStage: 'Startup',
      businessIndustry: 'Healthcare',
      tags: ['Telemedicine', 'Innovation'],
      bio: 'Transforming healthcare with technology',
      profileImageURL: 'https://i.pravatar.cc/150?img=21'
    },
    {
      user_id: 203,
      email: 'david.kumar@example.com',
      name: 'David Kumar',
      businessStage: 'Established',
      businessIndustry: 'E-commerce',
      tags: ['Retail', 'Marketing'],
      bio: 'Experienced e-commerce entrepreneur',
      profileImageURL: 'https://i.pravatar.cc/150?img=22'
    }
  ]);

  // Mock data - replace with actual API calls
  const mockEntrepreneurs: NetworkUser[] = [
    {
      user_id: 1,
      email: 'tony@example.com',
      name: 'Tony Flores',
      businessStage: 'Startup',
      businessIndustry: 'Retail',
      tags: ['Networking'],
      bio: 'Looking to scale innovative solutions and build meaningful partnerships'
    },
    {
      user_id: 2,
      email: 'bhav@example.com',
      name: 'Bha V',
      businessStage: 'Startup',
      businessIndustry: 'Metaverse Technologies',
      tags: ['Networking'],
      bio: 'Looking to scale innovative solutions and build meaningful partnerships'
    },
    {
      user_id: 3,
      email: 'miguel@example.com',
      name: 'Miguel Cano',
      businessStage: 'Startup',
      businessIndustry: 'Accounting & Financial Services',
      tags: ['Networking'],
      bio: 'Looking to scale innovative solutions and build meaningful partnerships'
    },
    {
      user_id: 4,
      email: 'amy@example.com',
      name: 'Amy Tran',
      businessStage: 'Startup',
      businessIndustry: 'Wellness & Self-Care',
      tags: ['Networking'],
      bio: 'Looking to scale innovative solutions and build meaningful partnerships'
    }
  ];

  const mockMentors: NetworkUser[] = [
    {
      user_id: 5,
      email: 'daniel@example.com',
      name: 'Daniel Nebo',
      businessStage: 'Startup',
      businessIndustry: 'Education',
      tags: ['Networking'],
      bio: 'Experienced mentor helping startups navigate their growth journey'
    },
    {
      user_id: 6,
      email: 'miguel.r@example.com',
      name: 'Miguel Ramos',
      businessStage: 'Startup',
      businessIndustry: 'Community Development',
      tags: ['Networking'],
      bio: 'Experienced mentor helping startups navigate their growth journey'
    }
  ];

  const mockConnections: NetworkUser[] = [
    {
      user_id: 100,
      email: 'sarah.chen@example.com',
      name: 'Sarah Chen',
      businessIndustry: 'Technology',
      tags: ['AI', 'SaaS']
    },
    {
      user_id: 101,
      email: 'james.wilson@example.com',
      name: 'James Wilson',
      businessIndustry: 'E-commerce',
      tags: ['Retail', 'Marketing']
    },
    {
      user_id: 102,
      email: 'priya.patel@example.com',
      name: 'Priya Patel',
      businessIndustry: 'Healthcare',
      tags: ['Telemedicine', 'Innovation']
    },
    {
      user_id: 103,
      email: 'alex.rodriguez@example.com',
      name: 'Alex Rodriguez',
      businessIndustry: 'Finance',
      tags: ['Fintech', 'Investment']
    },
    {
      user_id: 104,
      email: 'emma.thompson@example.com',
      name: 'Emma Thompson',
      businessIndustry: 'Education',
      tags: ['EdTech', 'Learning']
    }
  ];

  const handleConnect = (userId: number) => {
    console.log('Connect with user:', userId);
    // Add API call to send connection request
    // For now, just remove from the list
    setDeclinedUsers(prev => new Set(prev).add(userId));
  };

  const handlePass = (userId: number) => {
    console.log('Pass on user:', userId);
    setDeclinedUsers(prev => new Set(prev).add(userId));
  };

  const handleAcceptRequest = (userId: number) => {
    // Find the request
    const request = pendingRequests.find(r => r.user_id === userId);
    if (request) {
      // Add to connections
      mockConnections.push(request);
      // Remove from pending
      setPendingRequests(prev => prev.filter(r => r.user_id !== userId));
    }
  };

  const handleDeclineRequest = (userId: number) => {
    // Remove from pending requests
    setPendingRequests(prev => prev.filter(r => r.user_id !== userId));
  };

  const filteredEntrepreneurs = mockEntrepreneurs.filter(
    user => !declinedUsers.has(user.user_id)
  );

  const filteredMentors = mockMentors.filter(
    user => !declinedUsers.has(user.user_id)
  );

  const tabs = [
    { id: 'connect' as NetworkTab, label: 'Connect' },
    { id: 'mentors' as NetworkTab, label: 'Mentors' },
    { id: 'myNetwork' as NetworkTab, label: 'My Network' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Tab Header */}
      <div 
        className="sticky top-16 z-10"
        style={{ backgroundColor: COLORS.primary }}
      >
        <div className="border-b border-white/20">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-4 text-center transition-all ${
                  activeTab === tab.id
                    ? 'text-white font-bold border-b-3'
                    : 'text-white/70 font-medium'
                }`}
                style={{
                  borderBottomWidth: activeTab === tab.id ? '3px' : '0',
                  borderBottomColor: activeTab === tab.id ? 'white' : 'transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'connect' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntrepreneurs.length > 0 ? (
              filteredEntrepreneurs.map(user => (
                <NetworkCard
                  key={user.user_id}
                  user={user}
                  onConnect={handleConnect}
                  onPass={handlePass}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: COLORS.primary + '20' }}
                >
                  <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No More Connections
                </h3>
                <p className="text-gray-600">
                  Check back later for more entrepreneurs to connect with!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMentors.length > 0 ? (
              filteredMentors.map(user => (
                <NetworkCard
                  key={user.user_id}
                  user={user}
                  onConnect={handleConnect}
                  onPass={handlePass}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: COLORS.primary + '20' }}
                >
                  <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No More Mentors
                </h3>
                <p className="text-gray-600">
                  Check back later for more mentors to connect with!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'myNetwork' && (
          <div>
            {/* Network Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: COLORS.primary + '15' }}
              >
                <div className="text-3xl font-bold mb-1" style={{ color: COLORS.primary }}>
                  {mockConnections.length}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Connections
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-green-50 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {mockConnections.length}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Active
                </div>
              </div>
            </div>

            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Pending Requests</h2>
                <div className="space-y-3">
                  {pendingRequests.map(request => (
                    <div
                      key={request.user_id}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        {request.profileImageURL ? (
                          <img
                            src={request.profileImageURL}
                            alt={request.name}
                            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div 
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                            style={{ backgroundColor: COLORS.yellow }}
                          >
                            {request.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 mb-0.5">{request.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{request.businessIndustry}</p>
                          {request.bio && (
                            <p className="text-xs text-gray-500 truncate">{request.bio}</p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleAcceptRequest(request.user_id)}
                            className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.user_id)}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connections List */}
            {mockConnections.length > 0 ? (
              <div className="space-y-4">
                {mockConnections.map(user => (
                  <div
                    key={user.user_id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      {user.profileImageURL ? (
                        <img
                          src={user.profileImageURL}
                          alt={user.name}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                          style={{ backgroundColor: COLORS.yellow }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                        <div className="flex items-center space-x-1 text-blue-600 mb-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                          <span className="text-sm font-medium">Professional</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500 mb-3">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span className="text-sm">Network</span>
                        </div>
                        
                        {/* Shared Interests */}
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Shared Interests
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {user.tags && user.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                              >
                                {tag}
                              </span>
                            ))}
                            {user.businessIndustry && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                {user.businessIndustry}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mutual Connections */}
                        <div className="flex items-center space-x-1 text-orange-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span className="text-sm font-medium">Mutual</span>
                        </div>
                      </div>
                      
                      {/* Chat Button */}
                      <button
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: COLORS.primary }}
                        title="Chat"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: COLORS.primary + '20' }}
                >
                  <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Connections Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start connecting with entrepreneurs and mentors to build your network!
                </p>
                <button
                  onClick={() => setActiveTab('connect')}
                  className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Discover People
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
