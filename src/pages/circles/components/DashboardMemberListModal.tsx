import { useState, useEffect } from 'react';
import { COLORS } from '../../../utils/colors';

interface DashboardMember {
  id: number;
  full_name: string;
  profile_image: string | null;
  user_id: number;
  is_moderator: boolean;
  has_paid: boolean;
  payment_date: string | null;
  payment_amount: number | null;
  email: string;
  phone_number: string | null;
}

type MemberTab = 'paid' | 'free';

interface DashboardMemberListModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
  circleName: string;
  currentUserId: number;
}

export default function DashboardMemberListModal({ 
  isOpen, 
  onClose, 
  circleId: _circleId, 
  circleName, 
  currentUserId
}: DashboardMemberListModalProps) {
  const [members, setMembers] = useState<DashboardMember[]>([]);
  const [selectedTab, setSelectedTab] = useState<MemberTab>('paid');
  const [paidMembersCount, setPaidMembersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchDashboardMembers();
    }
  }, [isOpen]);

  const fetchDashboardMembers = () => {
    // Mock data
    const mockMembers: DashboardMember[] = [
      {
        id: 1,
        full_name: 'Sarah Johnson',
        profile_image: null,
        user_id: 101,
        is_moderator: false,
        has_paid: true,
        payment_date: '2025-01-15',
        payment_amount: 75.00,
        email: 'sarah.j@example.com',
        phone_number: '+1-555-123-4567'
      },
      {
        id: 2,
        full_name: 'Mike Chen',
        profile_image: null,
        user_id: 102,
        is_moderator: true,
        has_paid: true,
        payment_date: '2025-01-10',
        payment_amount: 75.00,
        email: 'mike.chen@example.com',
        phone_number: '+1-555-234-5678'
      },
      {
        id: 3,
        full_name: 'Emma Davis',
        profile_image: null,
        user_id: 103,
        is_moderator: false,
        has_paid: false,
        payment_date: null,
        payment_amount: null,
        email: 'emma.d@example.com',
        phone_number: '+1-555-345-6789'
      },
      {
        id: 4,
        full_name: 'Alex Rodriguez',
        profile_image: null,
        user_id: 104,
        is_moderator: false,
        has_paid: false,
        payment_date: null,
        payment_amount: null,
        email: 'alex.r@example.com',
        phone_number: null
      }
    ];

    setMembers(mockMembers);
    setPaidMembersCount(mockMembers.filter(m => m.has_paid).length);
    setTotalRevenue(mockMembers.reduce((sum, m) => sum + (m.payment_amount || 0), 0));
  };

  const paidMembers = members.filter(m => m.has_paid);
  const freeMembers = members.filter(m => !m.has_paid);

  const promoteToModerator = (userId: number) => {
    console.log('Promoting user to moderator:', userId);
    // TODO: Implement API call
    fetchDashboardMembers();
  };

  const markAsPaid = (userId: number) => {
    console.log('Marking user as paid:', userId);
    // TODO: Implement API call
    fetchDashboardMembers();
  };

  const sendPaymentReminder = (member: DashboardMember) => {
    console.log('Sending payment reminder to:', member.email);
    // TODO: Implement API call
    alert(`Payment reminder sent to ${member.full_name}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div 
          className="px-6 py-4 border-b border-white/20 flex items-center justify-between"
          style={{ backgroundColor: COLORS.primary }}
        >
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard Members</h2>
            <p className="text-sm text-white/80">{circleName}</p>
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

        <div className="p-6 bg-gray-50">
          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{paidMembersCount}</p>
                <p className="text-sm text-gray-600 mt-1">Paid Members</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">{freeMembers.length}</p>
                <p className="text-sm text-gray-600 mt-1">Free Members</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold" style={{ color: COLORS.primary }}>${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-gray-200 rounded-xl p-1 mb-6">
            <button
              onClick={() => setSelectedTab('paid')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                selectedTab === 'paid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Paid Members
            </button>
            <button
              onClick={() => setSelectedTab('free')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                selectedTab === 'free' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Free Members
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="overflow-y-auto max-h-[calc(85vh-350px)] px-6 pb-6">
          <div className="space-y-3">
            {(selectedTab === 'paid' ? paidMembers : freeMembers).map((member) => (
              <div key={member.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    {member.profile_image ? (
                      <img src={member.profile_image} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{member.full_name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    {member.payment_date && (
                      <p className="text-xs text-gray-500 mt-1">Paid on {new Date(member.payment_date).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div className="text-right">
                    {member.has_paid ? (
                      <div>
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Paid
                        </div>
                        {member.payment_amount && (
                          <p className="text-sm text-green-600 mt-1">${member.payment_amount.toFixed(2)}</p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => sendPaymentReminder(member)}
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold hover:bg-orange-200 transition-colors"
                      >
                        Send Reminder
                      </button>
                    )}
                  </div>

                  {member.user_id !== currentUserId && !member.is_moderator && (
                    <div className="relative group">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
                        <button
                          onClick={() => {
                            if (confirm(`Promote ${member.full_name} to moderator?`)) {
                              promoteToModerator(member.user_id);
                            }
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                        >
                          Make Moderator
                        </button>
                        {!member.has_paid && (
                          <button
                            onClick={() => {
                              if (confirm(`Mark ${member.full_name} as paid?`)) {
                                markAsPaid(member.user_id);
                              }
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}