import { useState } from 'react';
import { COLORS } from '../../../utils/colors';

interface CircleSettingsMenuProps {
  circleId: number;
  circleName: string;
  isModerator: boolean;
  onClose: () => void;
}

export default function CircleSettingsMenu({
  circleId,
  circleName,
  isModerator,
  onClose
}: CircleSettingsMenuProps) {
  const [isDashboardEnabled, setIsDashboardEnabled] = useState(false);
  const [isDashboardPrivate, setIsDashboardPrivate] = useState(true);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleLeaveCircle = () => {
    console.log('Leave circle:', circleName);
    setShowLeaveConfirmation(false);
    onClose();
  };

  const handleDeleteCircle = () => {
    console.log('Delete circle:', circleName);
    setShowDeleteConfirmation(false);
    onClose();
  };

  const toggleDashboard = () => {
    setIsDashboardEnabled(!isDashboardEnabled);
    if (!isDashboardEnabled) {
      setIsDashboardPrivate(true);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black opacity-30"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed top-24 right-5 z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-64 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {/* General Options */}
          <div className="py-2">
            <button
              onClick={() => {
                console.log('About This Circle');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-900">About This Circle</span>
            </button>

            <button
              onClick={() => {
                console.log('Members List');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Members List</span>
            </button>

            <button
              onClick={() => {
                console.log('Dues');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Dues</span>
            </button>
          </div>

          {/* Leave Circle */}
          <div className="py-2">
            <button
              onClick={() => setShowLeaveConfirmation(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-600">Leave Circle</span>
            </button>
          </div>

          {/* Moderator Options */}
          {isModerator && (
            <div className="py-2">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Moderator Options
                </h3>
              </div>

              {/* Dashboard Settings */}
              <div className="px-4 py-3 space-y-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer flex-1">
                    <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Enable Dashboard</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={isDashboardEnabled}
                    onChange={toggleDashboard}
                    className="w-5 h-5 rounded cursor-pointer"
                    style={{ accentColor: COLORS.primary }}
                  />
                </div>

                {/* Dashboard Privacy Toggle */}
                {isDashboardEnabled && (
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          style={{ color: COLORS.primary }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          {isDashboardPrivate ? (
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zM7 10a3 3 0 106 0 3 3 0 00-6 0z" clipRule="evenodd" />
                          )}
                        </svg>
                        <span className="text-sm font-medium text-gray-900">Dashboard Privacy</span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isDashboardPrivate
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {isDashboardPrivate ? 'Private' : 'Public'}
                      </span>
                    </div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDashboardPrivate}
                        onChange={(e) => setIsDashboardPrivate(e.target.checked)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: COLORS.primary }}
                      />
                      <span className="text-xs text-gray-600">
                        {isDashboardPrivate
                          ? 'Only admins can see dashboard'
                          : 'All members can see dashboard'}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Manage Channels */}
              <button
                onClick={() => {
                  console.log('Manage Channels');
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
              >
                <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Manage Channels</span>
              </button>

              {/* Delete Circle */}
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
              >
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-red-600">Delete Circle</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Leave Circle Confirmation Modal */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Leave Circle?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to leave <strong>{circleName}</strong>? You can join again later.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLeaveConfirmation(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveCircle}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Circle Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Circle?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete <strong>{circleName}</strong>? This action cannot be undone and all members will be removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCircle}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
