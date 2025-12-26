import { useState, useEffect } from 'react';
import { COLORS } from '../../../utils/colors';

interface Member {
  id: number;
  full_name: string;
  profile_image: string | null;
  user_id: number;
  is_moderator: boolean;
  email: string;
  has_paid: boolean;
}

interface MemberListModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
  circleName: string;
  currentUserId: number;
  isModerator: boolean;
}

export default function MemberListModal({ 
  isOpen, 
  onClose, 
  circleId: _circleId, 
  circleName, 
  currentUserId,
  isModerator
}: MemberListModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen]);

  const fetchMembers = () => {
    // Mock data
    setMembers([
      {
        id: 1,
        full_name: 'Sarah Johnson',
        profile_image: null,
        user_id: 101,
        is_moderator: false,
        email: 'sarah.j@example.com',
        has_paid: true
      },
      {
        id: 2,
        full_name: 'Mike Chen',
        profile_image: null,
        user_id: 102,
        is_moderator: true,
        email: 'mike.chen@example.com',
        has_paid: true
      },
      {
        id: 3,
        full_name: 'Emma Davis',
        profile_image: null,
        user_id: 103,
        is_moderator: false,
        email: 'emma.d@example.com',
        has_paid: false
      }
    ]);
  };

  const promoteToModerator = (userId: number) => {
    console.log('Promoting user to moderator:', userId);
    // TODO: Implement API call
    fetchMembers();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div 
          className="px-6 py-4 border-b border-white/20 flex items-center justify-between"
          style={{ backgroundColor: COLORS.primary }}
        >
          <div>
            <h2 className="text-2xl font-bold text-white">Members</h2>
            <p className="text-sm text-white/80">Members in {circleName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="p-4 space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <button
                  onClick={() => setSelectedMember(member)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    {member.profile_image ? (
                      <img src={member.profile_image} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">{member.full_name}</p>
                      {member.is_moderator && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">
                          Mod
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={`text-sm font-medium ${member.has_paid ? 'text-green-600' : 'text-red-600'}`}>
                        {member.has_paid ? 'Paid ✓' : 'Not Paid ✗'}
                      </p>
                      <span className="text-xs text-gray-500">•</span>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                    </div>
                  </div>
                </button>

                {isModerator && member.user_id !== currentUserId && !member.is_moderator && (
                  <div className="relative group">
                    <button
                      onClick={() => {
                        if (confirm(`Promote ${member.full_name} to moderator?`)) {
                          promoteToModerator(member.user_id);
                        }
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                    <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Make Moderator
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Member Profile Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedMember(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  {selectedMember.profile_image ? (
                    <img src={selectedMember.profile_image} alt={selectedMember.full_name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMember.full_name}</h3>
                  <p className="text-sm text-gray-600">{selectedMember.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className={`text-sm font-bold ${selectedMember.is_moderator ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {selectedMember.is_moderator ? 'Moderator' : 'Member'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Payment</span>
                  <span className={`text-sm font-bold ${selectedMember.has_paid ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedMember.has_paid ? 'Paid ✓' : 'Not Paid ✗'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="w-full mt-6 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}