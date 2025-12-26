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
  circleId: _circleId, 
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
  const [draggedItem, setDraggedItem] = useState<{ type: 'channel' | 'category'; id: number } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  const fetchChannels = async () => {
    // TODO: Implement API call to fetch channels and categories
    // For now, using mock data
    const mockCategories: ChannelCategory[] = [
      {
        id: 1,
        name: 'General',
        position: 0,
        channels: [
          { id: 1, name: '#welcome', circleId: _circleId, position: 0, isModeratorOnly: false },
          { id: 2, name: '#general', circleId: _circleId, position: 1, isModeratorOnly: false }
        ]
      },
      {
        id: 2,
        name: 'Announcements',
        position: 1,
        channels: [
          { id: 4, name: '#announcements', circleId: _circleId, position: 0, isModeratorOnly: true }
        ]
      }
    ];
    
    const mockUncategorized: Channel[] = [
      { id: 3, name: '#random', circleId: _circleId, position: 0, isModeratorOnly: false }
    ];

    setCategories(mockCategories);
    setUncategorizedChannels(mockUncategorized);
    setHasChanges(false);
  };

  const handleAddChannel = () => {
    if (!newChannelName.trim()) return;

    const newChannel: Channel = {
      id: Date.now(),
      name: newChannelName.startsWith('#') ? newChannelName : `#${newChannelName}`,
      circleId: _circleId,
      position: selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.channels.length || 0 : uncategorizedChannels.length,
      isModeratorOnly: false
    };

    if (selectedCategoryId) {
      setCategories(categories.map(cat => 
        cat.id === selectedCategoryId
          ? { ...cat, channels: [...cat.channels, newChannel] }
          : cat
      ));
    } else {
      setUncategorizedChannels([...uncategorizedChannels, newChannel]);
    }

    setNewChannelName('');
    setShowAddChannel(false);
    setSelectedCategoryId(null);
    setHasChanges(true);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: ChannelCategory = {
      id: Date.now(),
      name: newCategoryName,
      position: categories.length,
      channels: []
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setShowAddCategory(false);
    setHasChanges(true);
  };

  const handleDeleteChannel = (categoryId: number | null, channelId: number) => {
    if (!confirm('Delete this channel?')) return;

    if (categoryId === null) {
      setUncategorizedChannels(uncategorizedChannels.filter(ch => ch.id !== channelId));
    } else {
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, channels: cat.channels.filter(ch => ch.id !== channelId) }
          : cat
      ));
    }
    setHasChanges(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (!confirm('Delete this category and move channels to uncategorized?')) return;

    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setUncategorizedChannels([...uncategorizedChannels, ...category.channels]);
      setCategories(categories.filter(c => c.id !== categoryId));
      setHasChanges(true);
    }
  };

  const handleToggleModeratorOnly = (categoryId: number | null, channelId: number) => {
    if (categoryId === null) {
      setUncategorizedChannels(uncategorizedChannels.map(ch =>
        ch.id === channelId
          ? { ...ch, isModeratorOnly: !ch.isModeratorOnly }
          : ch
      ));
    } else {
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              channels: cat.channels.map(ch =>
                ch.id === channelId
                  ? { ...ch, isModeratorOnly: !ch.isModeratorOnly }
                  : ch
              )
            }
          : cat
      ));
    }
    setHasChanges(true);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: 'channel' | 'category', id: number) => {
    setDraggedItem({ type, id });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnCategory = (e: React.DragEvent<HTMLDivElement>, targetCategoryId: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === 'channel') {
      // Move channel from uncategorized or another category
      let channelToMove: Channel | null = null;

      // Find and remove from uncategorized
      const uncatIndex = uncategorizedChannels.findIndex(ch => ch.id === draggedItem.id);
      if (uncatIndex !== -1) {
        channelToMove = uncategorizedChannels[uncatIndex];
        setUncategorizedChannels(uncategorizedChannels.filter(ch => ch.id !== draggedItem.id));
      }

      // Find and remove from other categories
      if (!channelToMove) {
        let found = false;
        categories.forEach(cat => {
          const chIndex = cat.channels.findIndex(ch => ch.id === draggedItem.id);
          if (chIndex !== -1) {
            channelToMove = cat.channels[chIndex];
            found = true;
          }
        });
        
        if (found) {
          setCategories(categories.map(c =>
            c.channels.some(ch => ch.id === draggedItem.id)
              ? { ...c, channels: c.channels.filter(ch => ch.id !== draggedItem.id) }
              : c
          ));
        }
      }

      // Add to target category
      if (channelToMove) {
        setCategories(categories.map(cat =>
          cat.id === targetCategoryId
            ? { ...cat, channels: [...cat.channels, channelToMove as Channel] }
            : cat
        ));
        setHasChanges(true);
      }
    }

    setDraggedItem(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to save channels and categories
      // const response = await fetch(`${API_BASE}/circles/update_channels/`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     circle_id: _circleId,
      //     categories: categories,
      //     uncategorized_channels: uncategorizedChannels,
      //     user_id: _userId
      //   })
      // });

      console.log('Channels and categories saved');
      setHasChanges(false);
      onChannelsUpdated();
    } catch (error) {
      console.error('Failed to save channels:', error);
      alert('Failed to save changes');
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
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="px-6 py-4 flex items-center justify-between border-b border-gray-200"
            style={{ backgroundColor: COLORS.primary }}
          >
            <h2 className="text-xl font-bold text-white">Manage Channels</h2>
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
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Add Channel Button */}
            <div>
              <button
                onClick={() => setShowAddChannel(!showAddChannel)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Channel
              </button>

              {/* Add Channel Form */}
              {showAddChannel && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Channel Name</label>
                      <input
                        type="text"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="e.g. announcements"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 mt-1"
                        style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Category (Optional)</label>
                      <select
                        value={selectedCategoryId || ''}
                        onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 mt-1"
                        style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                      >
                        <option value="">Uncategorized</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id || ''}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddChannel}
                      disabled={!newChannelName.trim()}
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
            <div>
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </button>

              {/* Add Category Form */}
              {showAddCategory && (
                <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 mb-3"
                    style={{ ['--tw-ring-color' as any]: COLORS.primary }}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim()}
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

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Categories with Channels */}
            <div className="space-y-6">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnCategory(e, category.id as number)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                      {category.name}
                    </h3>
                    <button
                      onClick={() => handleDeleteCategory(category.id as number)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {category.channels.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Drag channels here to organize them</p>
                  ) : (
                    <div className="space-y-2">
                      {category.channels.map((channel) => (
                        <div
                          key={channel.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, 'channel', channel.id)}
                          className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all cursor-move"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 5a1 1 0 100 2H5.414l.293-.293a1 1 0 00-1.414-1.414l-2 2a1 1 0 000 1.414l2 2a1 1 0 001.414-1.414L5.414 9H8a1 1 0 100-2H5.414l.293.293a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414l-2-2a1 1 0 00-1.414 1.414L5.414 5H8zm4 10a1 1 0 100-2h2.586l-.293.293a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414l-2-2a1 1 0 00-1.414 1.414l.293.293H12a1 1 0 100 2h2.586l-.293-.293a1 1 0 001.414-1.414l2 2a1 1 0 000 1.414l-2 2a1 1 0 001.414 1.414l.293-.293H12z" />
                            </svg>
                            <span className="text-gray-700 font-medium">{channel.name}</span>
                            {channel.isModeratorOnly && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                Moderator Only
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleModeratorOnly(category.id, channel.id)}
                              className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                              title={channel.isModeratorOnly ? 'Make public' : 'Make moderator-only'}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteChannel(category.id, channel.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete channel"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Uncategorized Channels */}
              <div 
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!draggedItem || draggedItem.type !== 'channel') return;

                  // Remove from categories
                  let channelToMove: Channel | null = null;
                  const newCategories = categories.map(cat => {
                    const chIndex = cat.channels.findIndex(ch => ch.id === draggedItem.id);
                    if (chIndex !== -1) {
                      channelToMove = cat.channels[chIndex];
                      return { ...cat, channels: cat.channels.filter(ch => ch.id !== draggedItem.id) };
                    }
                    return cat;
                  });

                  if (channelToMove) {
                    setCategories(newCategories);
                    setUncategorizedChannels([...uncategorizedChannels, channelToMove]);
                    setHasChanges(true);
                  }
                  setDraggedItem(null);
                }}
              >
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  Uncategorized
                </h3>

                {uncategorizedChannels.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">Drag channels here or create new ones</p>
                ) : (
                  <div className="space-y-2">
                    {uncategorizedChannels.map((channel) => (
                      <div
                        key={channel.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'channel', channel.id)}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all cursor-move"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 5a1 1 0 100 2H5.414l.293-.293a1 1 0 00-1.414-1.414l-2 2a1 1 0 000 1.414l2 2a1 1 0 001.414-1.414L5.414 9H8a1 1 0 100-2H5.414l.293.293a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414l-2-2a1 1 0 00-1.414 1.414L5.414 5H8zm4 10a1 1 0 100-2h2.586l-.293.293a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414l-2-2a1 1 0 00-1.414 1.414l.293.293H12a1 1 0 100 2h2.586l-.293-.293a1 1 0 001.414-1.414l2 2a1 1 0 000 1.414l-2 2a1 1 0 001.414 1.414l.293-.293H12z" />
                          </svg>
                          <span className="text-gray-700 font-medium">{channel.name}</span>
                          {channel.isModeratorOnly && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                              Moderator Only
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleModeratorOnly(null, channel.id)}
                            className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                            title={channel.isModeratorOnly ? 'Make public' : 'Make moderator-only'}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteChannel(null, channel.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete channel"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
              className="px-6 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: hasChanges ? COLORS.primary : '#9CA3AF' }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
