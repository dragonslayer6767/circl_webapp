import { NetworkUser } from '../../types/network';

interface EnhancedMentorCardProps {
  user: NetworkUser;
  onConnect: (userId: number) => void;
  onPass: (userId: number) => void;
  onProfileClick?: (user: NetworkUser) => void;
}

export default function EnhancedMentorCard({ 
  user, 
  onConnect, 
  onPass, 
  onProfileClick 
}: EnhancedMentorCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onProfileClick?.(user)}
    >
      {/* Header with Gradient Background - Orange theme for mentors */}
      <div 
        className="h-24 relative"
        style={{
          backgroundColor: '#f97316'
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        {/* Mentor Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <span className="text-xs font-bold text-orange-600">MENTOR</span>
          </div>
        </div>
        {/* Profile Image positioned to overlap */}
        <div className="absolute left-6 -bottom-12">
          {user.image || user.profileImageURL ? (
            <img
              src={user.image || user.profileImageURL}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg"
              style={{ backgroundColor: '#f97316' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Verified badge */}
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-blue-500 rounded-full border-3 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-6 pb-6">
        {/* User Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
            {user.name}
          </h3>
          
          {user.location && (
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{user.location}</span>
            </div>
          )}

          {user.businessStage && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                {user.businessStage}
              </div>
            </div>
          )}
        </div>

        {/* Industry/Expertise */}
        {(user.businessIndustry || user.industry) && (
          <div className="mb-4">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                  Expertise
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {user.industry || user.businessIndustry}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        {(user.connectionsCount !== undefined || user.yearsExperience !== undefined) && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              {user.connectionsCount !== undefined && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-xs text-gray-600">Connections</span>
                  </div>
                  <span className="text-lg font-bold text-orange-700">{user.connectionsCount}</span>
                </div>
              )}
              {user.yearsExperience !== undefined && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-600">Experience</span>
                  </div>
                  <span className="text-lg font-bold text-orange-700">{user.yearsExperience}y</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {user.bio}
            </p>
          </div>
        )}

        {/* Skills/Tags */}
        {user.tags && user.tags.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Areas of Mentorship
            </p>
            <div className="flex flex-wrap gap-2">
              {user.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-100"
                >
                  {tag}
                </span>
              ))}
              {user.tags.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{user.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPass(user.user_id);
            }}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center space-x-2 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Pass</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect(user.user_id);
            }}
            className="flex-1 px-4 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
            style={{ 
              backgroundColor: '#f97316'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Book Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
