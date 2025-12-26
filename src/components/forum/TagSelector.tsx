import { useState, useRef, useEffect } from 'react';
import { COLORS } from '../../utils/colors';

export const AVAILABLE_TAGS = [
  'Funding',
  'Hiring',
  'Partnership',
  'Technology',
  'Marketing',
  'Design',
  'Legal',
  'Operations',
  'Product',
  'Sales',
  'Mentorship',
  'Networking',
];

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export default function TagSelector({
  selectedTags,
  onTagsChange,
  maxTags = 5,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredTags = AVAILABLE_TAGS.filter(
    (tag) =>
      !selectedTags.includes(tag) &&
      tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const handleAddTag = (tag: string) => {
    if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
      setSearchQuery('');
    }
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags ({selectedTags.length}/{maxTags})
      </label>

      {/* Selected Tags Display */}
      <div className="min-h-10 w-full border border-gray-300 rounded-md px-3 py-2 flex flex-wrap gap-2 items-start cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleToggleOpen}>
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: COLORS.primary }}
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(tag);
              }}
              className="ml-1 hover:opacity-70 transition-opacity"
            >
              ✕
            </button>
          </span>
        ))}
        {selectedTags.length === 0 && (
          <span className="text-gray-400">Select tags...</span>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Tag List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredTags.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  {searchQuery ? 'No tags found' : 'All tags selected'}
                </div>
              ) : (
                filteredTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors text-sm flex items-center gap-2"
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS.primary }}
                    />
                    {tag}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
