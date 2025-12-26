import { useState, useRef, useEffect } from 'react';
import { COLORS } from '../../utils/colors';

export type PrivacySetting = 'public' | 'private' | 'connections';

export const PRIVACY_OPTIONS: { value: PrivacySetting; label: string; description: string }[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can see this post',
  },
  {
    value: 'connections',
    label: 'Connections Only',
    description: 'Only your connections can see this post',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see this post',
  },
];

interface PrivacySelectorProps {
  selectedPrivacy: PrivacySetting;
  onPrivacyChange: (privacy: PrivacySetting) => void;
}

export default function PrivacySelector({
  selectedPrivacy,
  onPrivacyChange,
}: PrivacySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = PRIVACY_OPTIONS.find((opt) => opt.value === selectedPrivacy);

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
        Privacy
      </label>

      {/* Privacy Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-gray-400 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.value === 'public' && (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12c0 1.657-.895 3.1-2.229 3.876M9 12a3 3 0 110-6 3 3 0 010 6zm-9 9a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          )}
          {selectedOption?.value === 'connections' && (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          {selectedOption?.value === 'private' && (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {selectedOption?.label}
            </span>
            <span className="text-xs text-gray-500">
              {selectedOption?.description}
            </span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
            {PRIVACY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onPrivacyChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                  selectedPrivacy === option.value
                    ? 'bg-blue-50 border-l-4'
                    : ''
                }`}
                style={
                  selectedPrivacy === option.value
                    ? { borderLeftColor: COLORS.primary }
                    : {}
                }
              >
                <div className="flex items-start gap-3">
                  {option.value === 'public' && (
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selectedPrivacy === option.value ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12c0 1.657-.895 3.1-2.229 3.876M9 12a3 3 0 110-6 3 3 0 010 6zm-9 9a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                  )}
                  {option.value === 'connections' && (
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selectedPrivacy === option.value ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {option.value === 'private' && (
                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selectedPrivacy === option.value ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                  {selectedPrivacy === option.value && (
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
