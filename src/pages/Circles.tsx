import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import { useAuth } from '../hooks/useAuth';

interface Circle {
  id: number;
  name: string;
  industry: string;
  pricing: string;
  description: string;
  join_type: 'Join Now' | 'Apply Now';
  member_count: number;
  is_private: boolean;
  profile_image_url?: string;
}

export default function Circles() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'explore' | 'myCircles'>('explore');
  const [searchText, setSearchText] = useState('');
  const [exploreCircles, setExploreCircles] = useState<Circle[]>([]);
  const [myCircles, setMyCircles] = useState<Circle[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAboutModal, setShowAboutModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  useEffect(() => {
    // TODO: Fetch circles from API
    // Mock data for now
    const mockExploreCircles: Circle[] = [
      {
        id: 1,
        name: 'A',
        industry: '',
        pricing: '',
        description: 'About this circle...',
        join_type: 'Join Now',
        member_count: 2,
        is_private: false
      },
      {
        id: 2,
        name: 'u',
        industry: '',
        pricing: '',
        description: 'About this circle...',
        join_type: 'Join Now',
        member_count: 1,
        is_private: false
      }
    ];

    const mockMyCircles: Circle[] = [
      {
        id: 3,
        name: 'Test',
        industry: '',
        pricing: '',
        description: 'Test circle',
        join_type: 'Join Now',
        member_count: 7,
        is_private: false
      },
      {
        id: 4,
        name: 'Raider Entrepreneurship Club',
        industry: 'Student Org',
        pricing: '',
        description: 'Student organization',
        join_type: 'Join Now',
        member_count: 2,
        is_private: false
      },
      {
        id: 5,
        name: 'Circl',
        industry: 'Private Business',
        pricing: '',
        description: 'Private business circle',
        join_type: 'Join Now',
        member_count: 1,
        is_private: false
      }
    ];

    setExploreCircles(mockExploreCircles);
    setMyCircles(mockMyCircles);
  }, [user]);

  const filteredCircles = activeTab === 'explore' 
    ? exploreCircles.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()))
    : myCircles.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));

  const handleJoinCircle = (circleId: number) => {
    // TODO: API call to join circle
    console.log('Joining circle:', circleId);
  };

  const handleOpenCircle = (circle: Circle) => {
    // TODO: Navigate to circle chat/dashboard
    console.log('Opening circle:', circle.name);
    navigate(`/circles/${circle.id}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Tabs */}
      <div className="sticky top-16 z-20" style={{ backgroundColor: COLORS.primary }}>
        <div className="flex justify-center items-center py-3">
          {/* Explore Tab */}
          <button
            onClick={() => setActiveTab('explore')}
            className="flex flex-col items-center w-24 mx-4"
          >
            <span 
              className={`text-white text-base mb-2 ${activeTab === 'explore' ? 'font-bold' : 'font-medium opacity-70'}`}
            >
              Explore
            </span>
            <div 
              className={`h-0.5 w-full transition-all ${activeTab === 'explore' ? 'bg-white' : 'bg-transparent'}`}
            />
          </button>

          {/* My Circles Tab */}
          <button
            onClick={() => setActiveTab('myCircles')}
            className="flex flex-col items-center w-28 mx-4"
          >
            <span 
              className={`text-white text-base mb-2 ${activeTab === 'myCircles' ? 'font-bold' : 'font-medium opacity-70'}`}
            >
              My Circles
            </span>
            <div 
              className={`h-0.5 w-full transition-all ${activeTab === 'myCircles' ? 'bg-white' : 'bg-transparent'}`}
            />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 pt-4 pb-3" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={activeTab === 'explore' ? 'Search for a Circle (keywords or name)...' : 'Search your circles...'}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full border border-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <svg 
              className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="w-8 h-8 flex items-center justify-center" style={{ color: COLORS.primary }}>
            <svg className="w-8 h-8 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 pb-24">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'explore' ? 'Explore' : 'My Circles'}
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {activeTab === 'explore' 
                ? 'Discover new circles' 
                : `${myCircles.length} joined circles`
              }
            </p>
          </div>
          
          {activeTab === 'explore' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">Create</span>
            </button>
          )}

          {activeTab === 'myCircles' && myCircles.length > 0 && (
            <div className="flex items-center justify-center w-9 h-6 rounded-full text-xs font-semibold" style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}>
              {myCircles.length}
            </div>
          )}
        </div>

        {/* Circle List */}
        <div className="space-y-4">
          {filteredCircles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: activeTab === 'explore' ? '#10b98115' : `${COLORS.primary}15` }}>
              <svg 
                className="w-12 h-12 mx-auto mb-4 opacity-40" 
                style={{ color: activeTab === 'explore' ? '#10b981' : COLORS.primary }}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                {activeTab === 'explore' ? (
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                ) : (
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                )}
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === 'explore' ? 'No circles to explore' : 'No circles joined yet'}
              </h3>
              <p className="text-sm text-gray-500">
                {activeTab === 'explore' 
                  ? 'Create a new circle to get started!' 
                  : 'Explore and join circles to see them here'
                }
              </p>
            </div>
          ) : (
            filteredCircles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                isMember={activeTab === 'myCircles'}
                onJoin={() => handleJoinCircle(circle.id)}
                onOpen={() => handleOpenCircle(circle)}
                onAbout={() => {
                  setSelectedCircle(circle);
                  setShowAboutModal(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Create a Circle</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Circle Name"
                  className="w-full p-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Industry"
                  className="w-full p-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Circle Description"
                  rows={4}
                  className="w-full p-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-semibold">Make Circle Private</span>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-colors"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Create Circle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Circle Card Component
interface CircleCardProps {
  circle: Circle;
  isMember: boolean;
  onJoin: () => void;
  onOpen: () => void;
  onAbout: () => void;
}

function CircleCard({ circle, isMember, onJoin, onOpen, onAbout }: CircleCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {/* Circle Avatar */}
        <div className="flex-shrink-0">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 border-2 shadow-sm"
            style={{ borderColor: `${COLORS.primary}30` }}
          >
            {circle.profile_image_url ? (
              <img 
                src={circle.profile_image_url} 
                alt={circle.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>

        {/* Circle Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">{circle.name}</h3>
            {circle.pricing && (
              <span 
                className="ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap"
                style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
              >
                {circle.pricing}
              </span>
            )}
          </div>

          <div className="space-y-1 mb-3">
            {circle.industry && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-3 h-3" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Industry: {circle.industry}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-3 h-3" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="font-medium">{circle.member_count} Members</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onAbout}
              className="text-sm font-medium underline"
              style={{ color: COLORS.primary }}
            >
              About
            </button>

            {!isMember && (
              <button
                onClick={onJoin}
                className="ml-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                {circle.join_type}
              </button>
            )}
          </div>
        </div>

        {/* Arrow Button for Members */}
        {isMember && (
          <button
            onClick={onOpen}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center"
            style={{ color: COLORS.primary }}
          >
            <svg className="w-7 h-7 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
