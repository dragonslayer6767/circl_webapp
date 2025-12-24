import { useState, useEffect } from 'react';
import { COLORS } from '../../utils/colors';

interface BlockedUser {
  id: number;
  name: string;
  company?: string;
}

export default function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // TODO: Fetch blocked users from API
    // Mock data for now
    setBlockedUsers([]);
  }, []);

  const handleUnblock = (userId: number) => {
    // TODO: Implement API call
    console.log('Unblocking user:', userId);
    setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
    setMessage('User unblocked successfully');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary + '20' }}
          >
            <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blocked Users</h1>
          <p className="text-gray-600">Manage users you've blocked</p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-xl flex items-center space-x-2 animate-in fade-in duration-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Content */}
        {blockedUsers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">You haven't blocked anyone</p>
            <p className="text-sm text-gray-500 mt-2">Blocked users will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {blockedUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: COLORS.yellow }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    {user.company && (
                      <p className="text-sm text-gray-500">{user.company}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleUnblock(user.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
