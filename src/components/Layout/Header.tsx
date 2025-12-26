import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showCreateCirclePopup, setShowCreateCirclePopup] = useState(false);
  const [showCommunityDetails, setShowCommunityDetails] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

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
                        navigate('/circles');
                        setShowCreateCirclePopup(false);
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
                        navigate('/circles');
                        setShowCreateCirclePopup(false);
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

          {/* Community Details Modal */}
          {showCommunityDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                  onClick={() => setShowCommunityDetails(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: `${COLORS.primary}15` }}>
                    <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2">
                    Create and Manage Your Community
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Build a thriving community Circle to connect with like-minded individuals who share your passions and interests.
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}15` }}>
                      <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Grow Your Network</p>
                      <p className="text-xs text-gray-500">Connect with members who share your vision</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}15` }}>
                      <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Host Events</p>
                      <p className="text-xs text-gray-500">Create and manage community gatherings</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}15` }}>
                      <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Share & Engage</p>
                      <p className="text-xs text-gray-500">Foster discussions and connections</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate('/circles');
                    setShowCommunityDetails(false);
                  }}
                  className="w-full py-2.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Create Community Circle
                </button>
              </div>
            </div>
          )}

          {/* Company Details Modal */}
          {showCompanyDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                  onClick={() => setShowCompanyDetails(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: `${COLORS.primary}15` }}>
                    <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2">
                    Manage Your Company
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Create a professional Circle to run your business, manage your team, and scale your operations.
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}15` }}>
                      <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Project Management</p>
                      <p className="text-xs text-gray-500">Track tasks, deadlines, and deliverables</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}15` }}>
                      <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Team Collaboration</p>
                      <p className="text-xs text-gray-500">Communicate and work together seamlessly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COLORS.primary}15` }}>
                      <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Business Growth</p>
                      <p className="text-xs text-gray-500">Scale with premium tools and analytics</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate('/circles');
                    setShowCompanyDetails(false);
                  }}
                  className="w-full py-2.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Create Company Circle
                </button>
              </div>
            </div>
          )}

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
        </div>
      </div>
    </header>
  );
}
