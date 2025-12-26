import { NetworkUser } from '../../types/network';

interface ProfileModalProps {
  user: NetworkUser;
  isOpen: boolean;
  onClose: () => void;
  isInNetwork?: boolean;
  onConnect?: () => void;
  onMessage?: () => void;
}

const ProfileModal = ({ user, isOpen, onClose, isInNetwork = false, onConnect, onMessage }: ProfileModalProps) => {
  if (!isOpen) return null;

  // Calculate age from birthday if available
  const calculateAge = (birthday?: string): string => {
    if (!birthday) return 'N/A';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years old`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl shadow-2xl m-4">
        {/* Close Button */}
        <div className="sticky top-0 right-0 z-10 flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 bg-gray-300/80 rounded-full shadow-md hover:bg-gray-400/80 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header Card with Gradient */}
        <div className="mx-5 mt-[-50px] mb-8 rounded-3xl bg-gradient-to-br from-[#001a3d] via-[#004aad] to-[#0066ff] shadow-xl overflow-hidden">
          <div className="p-8 pb-10">
            {/* Profile Image with Premium Border */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-radial from-[#0066ff]/30 via-[#004aad]/40 to-transparent rounded-full blur-xl scale-110" />
                
                {/* Main image */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-300 to-gray-100 shadow-2xl ring-4 ring-[#0066ff]/90 ring-offset-4 ring-offset-[#004aad]">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-light text-gray-400">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Name and Location */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {user.name}
              </h2>
              {user.location && (
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium">{user.location}</span>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="flex justify-center gap-4">
              {/* Connections */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[70px] h-[70px] rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 shadow-lg flex flex-col items-center justify-center ring-1 ring-white/20">
                  <svg className="w-5 h-5 text-white mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-base font-bold text-white">{user.connectionsCount || 0}</span>
                </div>
                <span className="text-xs font-medium text-white/90">Connections</span>
              </div>

              {/* Circles */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[70px] h-[70px] rounded-2xl bg-gradient-to-br from-purple-700 via-purple-600 to-purple-500 shadow-lg flex flex-col items-center justify-center ring-1 ring-white/20">
                  <svg className="w-5 h-5 text-white mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-base font-bold text-white">0</span>
                </div>
                <span className="text-xs font-medium text-white/90">Circles</span>
              </div>

              {/* Circs */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[70px] h-[70px] rounded-2xl bg-gradient-to-br from-green-700 via-green-600 to-green-500 shadow-lg flex flex-col items-center justify-center ring-1 ring-white/20">
                  <svg className="w-5 h-5 text-white mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-base font-bold text-white">{user.circs || 0}</span>
                </div>
                <span className="text-xs font-medium text-white/90">Circs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mx-5 mb-6 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Bio</h3>
          <p className="text-gray-700 leading-relaxed">
            {user.bio || "This entrepreneur prefers to keep their story mysterious for now..."}
          </p>
          {user.personalityType && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-500 mb-2">Personality Type</p>
              <p className="text-gray-900">{user.personalityType}</p>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mx-5 mb-6 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            About {user.name.split(' ')[0]}
          </h3>
          <div className="space-y-4">
            {user.birthday && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Age</p>
                <p className="text-gray-900">{calculateAge(user.birthday)}</p>
              </div>
            )}
            {user.educationLevel && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Education Level</p>
                <p className="text-gray-900">{user.educationLevel}</p>
              </div>
            )}
            {user.institution && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Institution</p>
                <p className="text-gray-900">{user.institution}</p>
              </div>
            )}
            {user.location && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Location</p>
                <p className="text-gray-900">{user.location}</p>
              </div>
            )}
            {!user.educationLevel && !user.institution && !user.birthday && (
              <p className="text-gray-500 italic">No additional information listed yet.</p>
            )}
          </div>
        </div>

        {/* Technical Side Section */}
        <div className="mx-5 mb-6 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Side</h3>
          <div className="space-y-4">
            {user.skills && user.skills.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Skills</p>
                <p className="text-gray-900">{user.skills.join(', ')}</p>
              </div>
            )}
            {user.certificates && user.certificates.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Certificates</p>
                <p className="text-gray-900">{user.certificates.join(', ')}</p>
              </div>
            )}
            {user.yearsExperience !== undefined && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Experience</p>
                <p className="text-gray-900">{user.yearsExperience} years</p>
              </div>
            )}
            {(!user.skills || user.skills.length === 0) && 
             (!user.certificates || user.certificates.length === 0) && 
             user.yearsExperience === undefined && (
              <p className="text-gray-500 italic">No technical information listed yet.</p>
            )}
          </div>
        </div>

        {/* Interests Section */}
        <div className="mx-5 mb-6 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Interests</h3>
          <div className="space-y-4">
            {user.clubs && user.clubs.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Clubs</p>
                <p className="text-gray-900">{user.clubs.join(', ')}</p>
              </div>
            )}
            {user.hobbies && user.hobbies.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500">Hobbies</p>
                <p className="text-gray-900">{user.hobbies.join(', ')}</p>
              </div>
            )}
            {(!user.clubs || user.clubs.length === 0) && 
             (!user.hobbies || user.hobbies.length === 0) && (
              <p className="text-gray-500 italic">No interests listed yet.</p>
            )}
          </div>
        </div>

        {/* Business Venture Section (if available) */}
        {user.industry && (
          <div className="mx-5 mb-6 p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Venture</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Industry</p>
                <p className="text-gray-900">{user.industry}</p>
              </div>
              {user.tags && user.tags.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-500">Focus Areas</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isInNetwork && (
          <div className="mx-5 mb-8 flex gap-4">
            {onMessage && (
              <button
                onClick={onMessage}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-gray-300 hover:shadow-xl hover:scale-105 transition-all"
              >
                Pass
              </button>
            )}
            {onConnect && (
              <button
                onClick={onConnect}
                className="flex-1 bg-gradient-to-r from-[#004aad] to-[#0066ff] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Connect
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
