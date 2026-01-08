import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useAuth } from '../../hooks/useAuth';
import { useCircleView } from '../../context/CircleViewContext';
import CreateCircleModal from '../circles/CreateCircleModal';
import { CreateCircleData } from '../../types/circle';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isPanelMode, setIsPanelMode } = useCircleView();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showCreateCirclePopup, setShowCreateCirclePopup] = useState(false);
  const [showCircleCreationModal, setShowCircleCreationModal] = useState(false);

  // Calculate profile completion
  const calculateCompletionPercentage = (): number => {
    if (!user) return 0;
    
    // Calculate based on multiple profile fields
    const fields = [
      user.fullname,
      user.email,
      // These fields would come from a more complete user profile
      false, // bio
      false, // profile_image
      false, // birthday
      false, // personality_type
      false, // institution
      false, // years_of_experience
      false, // locations
      false, // skills
      false, // hobbies
    ];
    
    const completed = fields.filter(f => f).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  // Temporary: Show indicator even when user is null for testing
  const shouldShowIndicator = true;
  const displayPercentage = user ? completionPercentage : 18; // fallback to 18% when user is null

  // Handle circle creation
  const handleCreateCircle = async (data: CreateCircleData) => {
    if (!user?.user_id) return;

    try {
      // Mock circle creation (no API call)
      // Generate a mock circle ID
      const mockCircleId = Math.floor(Math.random() * 10000) + 100;
      
      console.log('Mock circle created:', {
        id: mockCircleId,
        name: data.name,
        industry: data.industry,
        description: data.description,
        channels: data.channels,
        joinType: data.join_type,
        isPrivate: data.is_private
      });

      // Close the modal
      setShowCircleCreationModal(false);

      // Navigate to the newly created circle's homepage
      navigate(`/circles/${mockCircleId}`);
      
    } catch (error) {
      console.error('Failed to create circle:', error);
      alert('Failed to create circle. Please try again.');
      throw error;
    }
  };

  // Check if we're on a circle view page
  const isOnCircleView = /^\/circles\/\d+/.test(location.pathname);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: COLORS.primary }}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/forum')}
        >
          <span className="text-2xl font-bold text-white hidden sm:block">
            Circl.
          </span>
        </div>

        {/* Right side indicators */}
        <div className="flex items-center gap-2">
          {/* Circle View Mode Toggle - Only show on circle pages */}
          {isOnCircleView && (
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-1">
              <button
                onClick={() => setIsPanelMode(false)}
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
          )}

          {/* Create Circle Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowCreateCirclePopup(!showCreateCirclePopup)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-white text-sm font-medium hidden lg:inline">
                Create Your First Circle
              </span>
              <span className="text-white text-sm font-medium lg:hidden">
                Create Circle
              </span>
            </button>

            {/* Choose Circle Type Popup */}
            {showCreateCirclePopup && (
              <div className="absolute top-full right-0 mt-2 w-[680px] bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50">
                <button
                  onClick={() => setShowCreateCirclePopup(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="mb-5">
                  <h3 className="text-gray-900 font-bold text-xl mb-2">
                    Create Your First Circle
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Choose the type of Circle that best fits your needs
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Community Option */}
                  <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}15` }}>
                        <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">
                          Community Circle
                        </h4>
                        <p className="text-xs text-gray-500">
                          For groups and communities
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Grow Your Network</p>
                          <p className="text-xs text-gray-500">Connect with like-minded individuals</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Host Events</p>
                          <p className="text-xs text-gray-500">Create and manage gatherings</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Share & Engage</p>
                          <p className="text-xs text-gray-500">Foster discussions and connections</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Build Together</p>
                          <p className="text-xs text-gray-500">Collaborate on shared interests</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        console.log('Community Circle clicked');
                        setShowCreateCirclePopup(false);
                        setShowCircleCreationModal(true);
                      }}
                      className="w-full py-2.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      Create Community Circle
                    </button>
                  </div>

                  {/* Company Option */}
                  <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}15` }}>
                        <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">
                          Company Circle
                        </h4>
                        <p className="text-xs text-gray-500">
                          For businesses and teams
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Project Management</p>
                          <p className="text-xs text-gray-500">Track tasks and deliverables</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Team Collaboration</p>
                          <p className="text-xs text-gray-500">Work together seamlessly</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Business Growth</p>
                          <p className="text-xs text-gray-500">Scale with premium tools</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Revenue Tools</p>
                          <p className="text-xs text-gray-500">Monetize and manage finances</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        console.log('Company Circle clicked');
                        setShowCreateCirclePopup(false);
                        setShowCircleCreationModal(true);
                      }}
                      className="w-full py-2.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      Create Company Circle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Completion Indicator */}
          {shouldShowIndicator && (
            <div className="relative">
            <button
              onClick={() => setShowCompletionPopup(!showCompletionPopup)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-white text-sm font-medium hidden sm:inline">
                Your Profile is {displayPercentage}% Complete
              </span>
              <span className="text-white text-sm font-medium sm:hidden">
                {displayPercentage}%
              </span>
            </button>

            {/* Popup */}
            {showCompletionPopup && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                <button
                  onClick={() => setShowCompletionPopup(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="mb-3">
                  <h3 className="text-gray-900 font-semibold text-sm mb-1">
                    Complete your profile
                  </h3>
                  <p className="text-gray-600 text-xs">
                    You're <span className="font-semibold" style={{ color: COLORS.primary }}>{displayPercentage}%</span> done
                  </p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${displayPercentage}%`, backgroundColor: COLORS.primary }}
                  />
                </div>

                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowCompletionPopup(false);
                  }}
                  className="w-full py-2 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Complete now
                </button>
              </div>
            )}
          </div>
          )}

          {/* Circle Creation Modal */}
          <CreateCircleModal
            isOpen={showCircleCreationModal}
            onClose={() => setShowCircleCreationModal(false)}
            onCreateCircle={handleCreateCircle}
            userId={user?.user_id || 1}
          />
        </div>
      </div>
    </header>
  );
}
