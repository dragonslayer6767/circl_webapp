import { useState, useEffect } from 'react';
import { COLORS } from '../../utils/colors';
import { Channel, ChannelCategory } from '../../types/circle';

interface ManageChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
  userId: number;
  onChannelsUpdated: () => void;
}

export default function ManageChannelsModal({ 
  isOpen, 
  onClose, 
  circleId, 
  userId: _userId,
  onChannelsUpdated 
}: ManageChannelsModalProps) {
  const [categories, setCategories] = useState<ChannelCategory[]>([]);
  const [uncategorizedChannels, setUncategorizedChannels] = useState<Channel[]>([]);
  const [newChannelName, setNewChannelName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen, circleId]);

  const fetchChannels = async () => {
    // TODO: Implement API call to fetch channels and categories
    // For now, using mock data
    const mockCategories: ChannelCategory[] = [
      {
        id: 1,
        name: 'General',
        position: 0,
        channels: [
          { id: 1, name: '#welcome', circleId, position: 0, isModeratorOnly: false },
          { id: 2, name: '#general', circleId, position: 1, isModeratorOnly: false }
        ]
      }
    ];
    
    const mockUncategorized: Channel[] = [
      { id: 3, name: '#random', circleId, position: 0, isModeratorOnly: false }
    ];

    setCategories(mockCategories);
    setUncategorizedChannels(mockUncategorized);
  };

  const handleAddChannel = async () => {
    if (!newChannelName.trim()) return;

    setIsLoading(true);
    try {
      // TODO: API call to create channel
      // const response = await fetch(`${API_BASE}/circles/channels/create/`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     circle_id: circleId,
      //     name: newChannelName,
      //     category_id: selectedCategoryId,
      //     user_id: userId
      //   })
      // });

      setNewChannelName('');
      setShowAddChannel(false);
      setSelectedCategoryId(null);
      await fetchChannels();
      onChannelsUpdated();
    } catch (error) {
      console.error('Failed to add channel:', error);
      alert('Failed to add channel');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsLoading(true);
    try {
      // TODO: API call to create category
      setNewCategoryName('');
      setShowAddCategory(false);
      await fetchChannels();
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChannel = async (_channelId: number) => {
    if (!confirm('Are you sure you want to delete this channel?')) return;

    setIsLoading(true);
    try {
      // TODO: API call to delete channel
      await fetchChannels();
      onChannelsUpdated();
    } catch (error) {
      console.error('Failed to delete channel:', error);
      alert('Failed to delete channel');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleModeratorOnly = async (_channel: Channel) => {
    setIsLoading(true);
    try {
      // TODO: API call to toggle moderator-only status
      await fetchChannels();
    } catch (error) {
      console.error('Failed to update channel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="px-6 py-4 flex items-center justify-between border-b border-white/20"
            style={{ backgroundColor: COLORS.primary }}
          >
            <h2 className="text-2xl font-bold text-white">Manage Channels</h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Add Channel Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddChannel(!showAddChannel)}
                className="flex items-center gap-2 px-4 py-2 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.primary }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Channel
              </button>

              {/* Add Channel Form */}
              {showAddChannel && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="Channel name (e.g., #announcements)"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 mb-3"
                  />
                  
                  <select
                    value={selectedCategoryId || ''}
                    onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 mb-3"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id!}>{cat.name}</option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddChannel}
                      disabled={isLoading || !newChannelName.trim()}
                      className="flex-1 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowAddChannel(false);
                        setNewChannelName('');
                        setSelectedCategoryId(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Add Category Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </button>

              {/* Add Category Form */}
              {showAddCategory && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 mb-3"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCategory}
                      disabled={isLoading || !newCategoryName.trim()}
                      className="flex-1 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Categories and Channels */}
            <div className="space-y-6">
              {/* Categorized Channels */}
              {categories.map((category) => (
                <div key={category.id} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    {category.name}
                  </h3>
                  
                  <div className="space-y-2">
                    {category.channels.map((channel) => (
                      <div
                        key={channel.id}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-700 font-medium">{channel.name}</span>
                          {channel.isModeratorOnly && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                              Moderator Only
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleModeratorOnly(channel)}
                            className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                            title={channel.isModeratorOnly ? 'Make public' : 'Make moderator-only'}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDeleteChannel(channel.id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete channel"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Uncategorized Channels */}
              {uncategorizedChannels.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Uncategorized</h3>
                  
                  <div className="space-y-2">
                    {uncategorizedChannels.map((channel) => (
                      <div
                        key={channel.id}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-700 font-medium">{channel.name}</span>
                          {channel.isModeratorOnly && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                              Moderator Only
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleModeratorOnly(channel)}
                            className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                            title={channel.isModeratorOnly ? 'Make public' : 'Make moderator-only'}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDeleteChannel(channel.id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete channel"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COLORS.primary }}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <svg className="animate-spin h-10 w-10 mx-auto" style={{ color: COLORS.primary }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
