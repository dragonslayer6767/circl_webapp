import { NetworkUser } from '../../types/network';
import { COLORS } from '../../utils/colors';

interface EnhancedEntrepreneurCardProps {
  user: NetworkUser;
  onConnect: (userId: number) => void;
  onPass: (userId: number) => void;
  onProfileClick?: (user: NetworkUser) => void;
}

export default function EnhancedEntrepreneurCard({ 
  user, 
  onConnect, 
  onPass, 
  onProfileClick 
}: EnhancedEntrepreneurCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onProfileClick?.(user)}
    >
      {/* Header with Gradient Background */}
      <div 
        className="h-24 relative"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
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
              style={{ backgroundColor: COLORS.yellow }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white" />
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-6 pb-6">
        {/* User Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
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
              <div 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: COLORS.primary + '15',
                  color: COLORS.primary 
                }}
              >
                {user.businessStage}
              </div>
            </div>
          )}
        </div>

        {/* Industry */}
        {(user.businessIndustry || user.industry) && (
          <div className="mb-4">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                  Industry
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
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
            {user.connectionsCount !== undefined && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">{user.connectionsCount}</span>
                <span className="text-xs text-gray-500">connections</span>
              </div>
            )}
            {user.yearsExperience !== undefined && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">{user.yearsExperience}</span>
                <span className="text-xs text-gray-500">years exp</span>
              </div>
            )}
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

        {/* Tags */}
        {user.tags && user.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {user.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
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
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Connect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
