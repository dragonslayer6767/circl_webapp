import { useState } from 'react';
import { COLORS } from '../../utils/colors';
import { CreateCircleData, JoinType } from '../../types/circle';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCircle: (data: CreateCircleData) => Promise<void>;
  userId: number;
}

const allChannelOptions = ['#Welcome', '#Chats', '#Moderators', '#News', '#Announcements', '#General'];
const joinTypeOptions: JoinType[] = ['Join Now', 'Apply Now', 'Request to Join'];

export default function CreateCircleModal({ isOpen, onClose, onCreateCircle, userId }: CreateCircleModalProps) {
  const [circleName, setCircleName] = useState('');
  const [circleIndustry, setCircleIndustry] = useState('');
  const [circleDescription, setCircleDescription] = useState('');
  const [circleCategory, setCircleCategory] = useState('');
  const [selectedJoinType, setSelectedJoinType] = useState<JoinType>('Join Now');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['#Welcome', '#Chats']);
  const [isPrivate, setIsPrivate] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!circleName.trim() || !circleIndustry.trim() || !circleDescription.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (isPrivate && !accessCode.trim()) {
      alert('Please provide an access code for private circles');
      return;
    }

    setIsLoading(true);

    try {
      const createData: CreateCircleData = {
        user_id: userId,
        name: circleName.trim(),
        industry: circleIndustry.trim(),
        description: circleDescription.trim(),
        join_type: selectedJoinType.toLowerCase().replace(/ /g, '_'),
        channels: selectedChannels,
        category: circleCategory.trim(),
        is_private: isPrivate,
        access_code: isPrivate ? accessCode.trim() : undefined
      };

      await onCreateCircle(createData);
      
      // Reset form
      setCircleName('');
      setCircleIndustry('');
      setCircleDescription('');
      setCircleCategory('');
      setSelectedJoinType('Join Now');
      setSelectedChannels(['#Welcome', '#Chats']);
      setIsPrivate(false);
      setAccessCode('');
      
      onClose();
    } catch (error) {
      console.error('Failed to create circle:', error);
      alert('Failed to create circle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChannel = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
            style={{ backgroundColor: COLORS.primary }}
          >
            <h2 className="text-2xl font-bold text-white">Create a Circle</h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 transition-opacity"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Circle Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Circle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={circleName}
                onChange={(e) => setCircleName(e.target.value)}
                placeholder="Enter circle name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                required
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={circleIndustry}
                onChange={(e) => setCircleIndustry(e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                required
              />
            </div>

            {/* Category (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                value={circleCategory}
                onChange={(e) => setCircleCategory(e.target.value)}
                placeholder="e.g., Student Org, Professional Network"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={circleDescription}
                onChange={(e) => setCircleDescription(e.target.value)}
                placeholder="Describe your circle's purpose and goals..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Join Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Join Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {joinTypeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedJoinType(type)}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                      selectedJoinType === type
                        ? 'text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: selectedJoinType === type ? COLORS.primary : undefined
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Default Channels
              </label>
              <div className="grid grid-cols-2 gap-3">
                {allChannelOptions.map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => toggleChannel(channel)}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all text-left ${
                      selectedChannels.includes(channel)
                        ? 'text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: selectedChannels.includes(channel) ? COLORS.primary : undefined
                    }}
                  >
                    {channel}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selected: {selectedChannels.length} channel{selectedChannels.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Private Circle Toggle */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Make Circle Private</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Members will need an access code to join
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="sr-only"
                  />
                  <div 
                    className={`w-14 h-8 rounded-full transition-colors ${
                      isPrivate ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    onClick={() => setIsPrivate(!isPrivate)}
                  >
                    <div 
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform mt-1 ${
                        isPrivate ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              </label>

              {/* Access Code Field */}
              {isPrivate && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Access Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter a secure access code"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                    required={isPrivate}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Share this code with people you want to invite to your circle
                  </p>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.primary }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </div>
                ) : (
                  'Create Circle'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
