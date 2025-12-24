import { NetworkUser } from '../../types/network';
import { COLORS } from '../../utils/colors';

interface NetworkCardProps {
  user: NetworkUser;
  onConnect: (userId: number) => void;
  onPass: (userId: number) => void;
}

export default function NetworkCard({ user, onConnect, onPass }: NetworkCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4 mb-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {user.profileImageURL ? (
            <img
              src={user.profileImageURL}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: COLORS.yellow }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {user.name}
          </h3>
          {user.businessStage && (
            <div className="flex items-center space-x-1 mt-1">
              <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: COLORS.primary }}>
                {user.businessStage}
              </span>
            </div>
          )}
          {user.businessName && (
            <div className="flex items-center space-x-1 mt-1">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600 truncate">
                {user.businessName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Industry Section */}
      {user.businessIndustry && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Industry
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {user.businessIndustry}
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
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bio */}
      {user.bio && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {user.bio}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-4">
        <button
          onClick={() => onPass(user.user_id)}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Pass</span>
        </button>
        <button
          onClick={() => onConnect(user.user_id)}
          className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>Connect</span>
        </button>
      </div>
    </div>
  );
}
