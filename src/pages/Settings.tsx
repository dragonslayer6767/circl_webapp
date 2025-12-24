import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import { useAuth } from '../hooks/useAuth';

interface SettingsOption {
  title: string;
  iconName: string;
  path: string;
  isDestructive?: boolean;
  subtitle?: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const accountSettings: SettingsOption[] = [
    { title: 'Become a Mentor', iconName: 'graduationcap.fill', path: '/settings/become-mentor' },
    { title: 'Change Password', iconName: 'lock.fill', path: '/settings/change-password' },
    { title: 'Blocked Users', iconName: 'person.crop.circle.badge.xmark', path: '/settings/blocked-users' },
    { 
      title: 'Delete Account', 
      iconName: 'trash.fill', 
      path: '/settings/delete-account',
      isDestructive: true,
      subtitle: 'This action cannot be undone'
    }
  ];

  const feedbackSettings: SettingsOption[] = [
    { title: 'Suggest a Feature', iconName: 'lightbulb.fill', path: '/settings/suggest-feature' },
    { title: 'Report a Problem', iconName: 'exclamationmark.triangle.fill', path: '/settings/report-problem' }
  ];

  const legalSettings: SettingsOption[] = [
    { title: 'Terms of Service', iconName: 'doc.text.fill', path: '/settings/terms' },
    { title: 'Privacy Policy', iconName: 'hand.raised.fill', path: '/settings/privacy' }
  ];

  const tutorialSettings: SettingsOption[] = [
    { title: 'App Tutorial', iconName: 'questionmark.circle.fill', path: '/settings/tutorial' }
  ];

  const supportSettings: SettingsOption[] = [
    { title: 'Contact Support', iconName: 'headphones', path: '/settings/contact-support' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'graduationcap.fill': 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      'lock.fill': 'M5 13l4 0V9c0-1.1.9-2 2-2s2 .9 2 2v4l4 0c0 0 0 0 0 0l0 6c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V13z M10 9v4h4V9c0-1.1-.9-2-2-2s-2 .9-2 2z',
      'person.crop.circle.badge.xmark': 'M18 8A6 6 0 106 8a6 6 0 0012 0zM3 21a9 9 0 0118 0H3z',
      'trash.fill': 'M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zM7 19V7h10v12H7z',
      'lightbulb.fill': 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z',
      'exclamationmark.triangle.fill': 'M10 2L0 20h20L10 2zm1 14H9v-2h2v2zm0-3H9V7h2v6z',
      'doc.text.fill': 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z',
      'hand.raised.fill': 'M10 2a1 1 0 011 1v5a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1z',
      'questionmark.circle.fill': 'M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm1 16H9v-2h2v2zm0-4H9V6h2v6z',
      'headphones': 'M10 3a7 7 0 00-7 7v4a3 3 0 003 3h1a1 1 0 001-1v-6a1 1 0 00-1-1H6v-1a4 4 0 018 0v1h-1a1 1 0 00-1 1v6a1 1 0 001 1h1a3 3 0 003-3v-4a7 7 0 00-7-7z'
    };
    return iconMap[iconName] || 'M12 2a10 10 0 100 20 10 10 0 000-20z';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-blue-50/10">
      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {/* Account Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          </div>

          <div className="space-y-2">
            {accountSettings.map((option) => (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className="w-full flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div 
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: option.isDestructive 
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgb(239, 68, 68))'
                      : `linear-gradient(135deg, ${COLORS.primary}, #0066ff)`
                  }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d={renderIcon(option.iconName)} />
                  </svg>
                </div>

                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{option.title}</p>
                  {option.subtitle && (
                    <p className="text-sm text-gray-500">{option.subtitle}</p>
                  )}
                </div>

                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback & Suggestions Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Feedback & Suggestions</h2>
          </div>

          <div className="space-y-2">
            {feedbackSettings.map((option) => (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className="w-full flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div 
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0066ff)` }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d={renderIcon(option.iconName)} />
                  </svg>
                </div>

                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{option.title}</p>
                </div>

                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Legal & Policies Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Legal & Policies</h2>
          </div>

          <div className="space-y-2">
            {legalSettings.map((option) => (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className="w-full flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div 
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0066ff)` }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d={renderIcon(option.iconName)} />
                  </svg>
                </div>

                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{option.title}</p>
                </div>

                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Tutorial & Help Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm1 16H9v-2h2v2zm0-4H9V6h2v6z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Tutorial & Help</h2>
          </div>

          <div className="space-y-2">
            {tutorialSettings.map((option) => (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className="w-full flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div 
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0066ff)` }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d={renderIcon(option.iconName)} />
                  </svg>
                </div>

                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{option.title}</p>
                </div>

                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a7 7 0 00-7 7v4a3 3 0 003 3h1a1 1 0 001-1v-6a1 1 0 00-1-1H6v-1a4 4 0 018 0v1h-1a1 1 0 00-1 1v6a1 1 0 001 1h1a3 3 0 003-3v-4a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
          </div>

          <div className="space-y-2">
            {supportSettings.map((option) => (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className="w-full flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <div 
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0066ff)` }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d={renderIcon(option.iconName)} />
                  </svg>
                </div>

                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{option.title}</p>
                </div>

                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutAlert(true)}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-semibold">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Log out of your account?</h3>
            <p className="text-gray-600 mb-6">You'll need to sign in again to access your account.</p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutAlert(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
