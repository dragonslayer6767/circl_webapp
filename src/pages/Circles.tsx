import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import { useAuth } from '../hooks/useAuth';
import { Circle, CreateCircleData } from '../types/circle';
import CreateCircleModal from '../components/circles/CreateCircleModal';
import { circleService } from '../services/circleServices';

export default function Circles() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'explore' | 'myCircles'>('explore');
  const [searchText, setSearchText] = useState('');
  const [exploreCircles, setExploreCircles] = useState<any[]>([]);
  const [myCircles, setMyCircles] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<any | null>(null);
  const [showAccessCodePrompt, setShowAccessCodePrompt] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [circlePendingJoin, setCirclePendingJoin] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_id) {
      loadCircles();
    }
  }, [user?.user_id]);

  const loadCircles = async () => {
    if (!user?.user_id) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [myCirclesData, exploreData] = await Promise.all([
        circleService.getMyCircles(user.user_id),
        circleService.exploreCircles(user.user_id),
      ]);
      setMyCircles(Array.isArray(myCirclesData) ? myCirclesData : []);
      setExploreCircles(Array.isArray(exploreData) ? exploreData : []);
    } catch (error) {
      console.error('Failed to load circles:', error);
      setErrorMessage('Failed to load circles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCircle = async (data: CreateCircleData) => {
    if (!user?.user_id) return;

    try {
      await circleService.createCircle({
        user_id: user.user_id,
        name: data.name,
        description: data.description,
        industry: data.industry,
        join_type: data.join_type,
        channels: data.channels,
        is_private: data.is_private,
        access_code: data.access_code,
      });
      await loadCircles();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create circle:', error);
      setErrorMessage('Failed to create circle. Please try again.');
      throw error;
    }
  };

  const handleJoinCircle = async (circle: any) => {
    if (!user?.user_id) return;

    // Check if private circle (is_private field from API)
    const isPrivate = circle.is_private || !circle.is_public;
    if (isPrivate) {
      setCirclePendingJoin(circle);
      setShowAccessCodePrompt(true);
      return;
    }

    try {
      await circleService.joinCircle(circle.id, user.user_id);
      await loadCircles();
      navigate(`/circles/${circle.id}`, { state: { circle } });
    } catch (error) {
      console.error('Failed to join circle:', error);
      setErrorMessage('Failed to join circle. Please try again.');
      alert('Failed to join circle. Please try again.');
    }
  };

  const handleJoinWithAccessCode = async () => {
    if (!user?.user_id || !circlePendingJoin || !accessCodeInput.trim()) return;

    try {
      await circleService.joinCircle(circlePendingJoin.id, user.user_id);
      
      // Reload circles after joining
      await loadCircles();
      
      setShowAccessCodePrompt(false);
      setAccessCodeInput('');
      const circleToNavigate = circlePendingJoin;
      setCirclePendingJoin(null);
      
      // Navigate to circle after joining
      navigate(`/circles/${circleToNavigate.id}`, { state: { circle: circleToNavigate } });
    } catch (error) {
      console.error('Failed to join circle:', error);
      if ((error as any).response?.status === 403) {
        setErrorMessage('Invalid access code');
        alert('Invalid access code');
      } else {
        setErrorMessage('Failed to join circle. Please try again.');
        alert('Failed to join circle. Please try again.');
      }
    }
  };

  const handleOpenCircle = (circle: Circle) => {
    navigate(`/circles/${circle.id}`, { state: { circle } });
  };

  const filteredCircles = activeTab === 'explore' 
    ? exploreCircles.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()))
    : myCircles.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <svg className="animate-spin h-10 w-10 mx-auto" style={{ color: COLORS.primary }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      )}

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
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <span className="text-red-700 text-sm font-medium">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

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
                onJoin={() => handleJoinCircle(circle)}
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
      <CreateCircleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateCircle={handleCreateCircle}
        userId={user?.user_id || 0}
      />

      {/* Access Code Prompt Modal */}
      {showAccessCodePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary + '20' }}
              >
                <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Enter Access Code</h3>
                <p className="text-sm text-gray-500">This circle is private</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Ask a moderator for the access code to join this circle.
            </p>

            <input
              type="text"
              value={accessCodeInput}
              onChange={(e) => setAccessCodeInput(e.target.value)}
              placeholder="Access code"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 mb-4"
              style={{ ['--focus-ring-color' as any]: COLORS.primary }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleJoinWithAccessCode();
                }
              }}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAccessCodePrompt(false);
                  setAccessCodeInput('');
                  setCirclePendingJoin(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinWithAccessCode}
                disabled={!accessCodeInput.trim()}
                className="flex-1 px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.primary }}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Circle Modal */}
      {showAboutModal && selectedCircle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAboutModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div 
              className="px-6 py-4 border-b border-white/20 flex items-center justify-between"
              style={{ backgroundColor: COLORS.primary }}
            >
              <h2 className="text-2xl font-bold text-white">{selectedCircle.name}</h2>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-white hover:opacity-80 transition-opacity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">About This Circle</h3>
                <p className="text-gray-700 leading-relaxed">{selectedCircle.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">Industry</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedCircle.industry || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">Members</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedCircle.member_count}</p>
                </div>

                {selectedCircle.pricing && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-500">Pricing</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedCircle.pricing}</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500">Privacy</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedCircle.is_private ? 'Private' : 'Public'}</p>
                </div>
              </div>

              {!myCircles.some(c => c.id === selectedCircle.id) && (
                <button
                  onClick={() => {
                    setShowAboutModal(false);
                    handleJoinCircle(selectedCircle);
                  }}
                  className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  {selectedCircle.join_type}
                </button>
              )}
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
  const { user } = useAuth();
  const isCreator = user?.user_id === circle.creator_id;
  const isModerator = circle.is_moderator || isCreator;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {/* Circle Avatar */}
        <div className="flex-shrink-0 relative">
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
          {/* Private Indicator */}
          {circle.is_private && (
            <div 
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: COLORS.primary }}
              title="Private Circle"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Circle Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">{circle.name}</h3>
              {isMember && isModerator && (
                <span 
                  className="px-2 py-0.5 text-xs font-bold rounded-full whitespace-nowrap flex-shrink-0"
                  style={{ backgroundColor: '#fbbf24', color: '#78350f' }}
                  title={isCreator ? 'Creator' : 'Moderator'}
                >
                  {isCreator ? '👑' : ''}
                </span>
              )}
            </div>
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