import { useState } from 'react';
import { COLORS } from '../utils/colors';
import { NetworkUser } from '../types/network';
import NetworkCard from '../components/networking/NetworkCard';

type NetworkTab = 'connect' | 'mentors' | 'myNetwork';

export default function Network() {
  const [activeTab, setActiveTab] = useState<NetworkTab>('connect');
  const [declinedUsers, setDeclinedUsers] = useState<Set<number>>(new Set());

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

  const mockConnections: NetworkUser[] = [];

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
      <div className="max-w-4xl mx-auto p-6">
        {activeTab === 'connect' && (
          <div className="space-y-6">
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
          <div className="space-y-6">
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

            {/* Connections List */}
            {mockConnections.length > 0 ? (
              <div className="space-y-4">
                {mockConnections.map(user => (
                  <div
                    key={user.user_id}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                  >
                    {user.profileImageURL ? (
                      <img
                        src={user.profileImageURL}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: COLORS.yellow }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      {user.businessIndustry && (
                        <p className="text-sm text-gray-600">{user.businessIndustry}</p>
                      )}
                    </div>
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                      title="Message"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </button>
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
