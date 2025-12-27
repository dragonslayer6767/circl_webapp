import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useOnboarding } from '../../context/OnboardingContext';
import { useNotification } from '../../context/NotificationContext';

const genderOptions = ["Male", "Female", "Prefer not to say"];

const availabilityOptions = [
  "Full-time (40+ hrs/week)",
  "Part-time (20-40 hrs/week)",
  "Side project (<20 hrs/week)",
  "Weekends only",
  "Flexible hours",
  "Currently employed - exploring options"
];

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const { data, updateData, nextStep } = useOnboarding();
  const { addNotification } = useNotification();

  const [birthday, setBirthday] = useState(data?.birthday || '');
  const [location, setLocation] = useState(data?.location || '');
  const [gender, setGender] = useState(data?.gender || '');
  const [availability, setAvailability] = useState(data?.availability || '');
  const [personalityType, setPersonalityType] = useState(data?.personalityType || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [personalityError, setPersonalityError] = useState('');
  const [ageError, setAgeError] = useState('');

  // List of valid US state abbreviations
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const validateLocation = (loc: string): boolean => {
    // Format: "City, ST" (e.g., "Austin, TX")
    const locationRegex = /^[A-Za-z\s]+,\s[A-Z]{2}$/;
    if (!locationRegex.test(loc)) {
      return false;
    }
    
    // Extract state abbreviation and validate
    const parts = loc.split(',');
    const state = parts[1].trim();
    return validStates.includes(state);
  };

  const formatLocation = (value: string): string => {
    // Auto-capitalize city and state
    if (!value.includes(',')) {
      // Just city name - capitalize first letter of each word
      return value.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    
    const parts = value.split(',');
    const city = parts[0].trim().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    const state = parts[1]?.trim().toUpperCase() || '';
    
    return `${city}, ${state}`;
  };

  const validatePersonalityType = (type: string): boolean => {
    if (!type) return true; // Optional field
    // Format: "XXXX-Y" (e.g., "INTJ-A")
    const personalityRegex = /^[A-Z]{4}-[A-Z]$/;
    return personalityRegex.test(type);
  };

  const formatPersonalityType = (value: string): string => {
    return value.toUpperCase();
  };

  const handleLocationChange = (value: string) => {
    const formatted = formatLocation(value);
    setLocation(formatted);
    
    if (formatted && !validateLocation(formatted)) {
      setLocationError('Format: City, ST (e.g., Austin, TX)');
    } else {
      setLocationError('');
    }
  };

  const handlePersonalityChange = (value: string) => {
    const formatted = formatPersonalityType(value);
    setPersonalityType(formatted);
    
    if (formatted && !validatePersonalityType(formatted)) {
      setPersonalityError('Format: XXXX-Y (e.g., INTJ-A)');
    } else {
      setPersonalityError('');
    }
  };

  const handleBirthdayChange = (value: string) => {
    setBirthday(value);
    
    if (value) {
      const age = validateAge(value);
      if (age < 18) {
        setAgeError('You must be 18 years or older to sign up');
      } else {
        setAgeError('');
      }
    } else {
      setAgeError('');
    }
  };

  const isFormComplete = () => {
    return (
      birthday !== '' && 
      location !== '' && 
      gender !== '' && 
      availability !== '' &&
      !locationError &&
      !personalityError &&
      !ageError &&
      validateLocation(location) &&
      (personalityType === '' || validatePersonalityType(personalityType))
    );
  };

  const validateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormComplete()) {
      addNotification('Please fill out all required fields correctly', 'error');
      return;
    }

    setIsSubmitting(true);

    // Mock save - no API call for testing
    setTimeout(() => {
      updateData({
        birthday,
        location,
        gender,
        availability,
        personalityType
      });

      addNotification('Personal information saved!', 'success');
      setIsSubmitting(false);
      nextStep();
      navigate('/onboarding/notifications');
    }, 500);
  };

  return (
    <div 
      className="min-h-screen py-12 px-6 relative overflow-y-auto"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <div className="h-2 bg-white/20">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: '66.67%',
              backgroundColor: COLORS.yellow 
            }}
          />
        </div>
        <div className="text-center py-2" style={{ backgroundColor: COLORS.primary }}>
          <span className="text-white text-sm font-medium">Step 4 of 6</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ top: '10px', right: '10px' }}></div>
        </div>
      </div>

      {/* Decorative Clouds - Bottom Right */}
      <div className="absolute bottom-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-48 h-24">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ bottom: '10px', right: '10px' }}></div>
        </div>
      </div>

      {/* Decorative Clouds - Top Left */}
      <div className="absolute top-10 left-5 pointer-events-none opacity-80">
        <div className="relative w-32 h-32">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ top: '20px', left: '10px' }}></div>
        </div>
      </div>

      <div className="max-w-lg mx-auto z-10 relative">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.yellow }}>
            Create Your Account
          </h1>
          <div className="w-48 h-0.5 bg-white mx-auto"></div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Birthday */}
          <div>
            <label className="block text-white text-sm mb-2">Birthday *</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => handleBirthdayChange(e.target.value)}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            {ageError && (
              <p className="text-red-300 text-sm mt-1">{ageError}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-white text-sm mb-2">Location (City, State) *</label>
            <input
              type="text"
              placeholder="e.g., Austin, TX"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            {locationError && (
              <p className="text-red-300 text-sm mt-1">{locationError}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-white text-sm mb-2">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="">Select Gender</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-white text-sm mb-2 flex items-center gap-2">
              Availability *
              <span className="text-xs text-gray-300">(Time to work on projects)</span>
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="">Select Availability</option>
              {availabilityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Personality Type */}
          <div>
            <label className="block text-white text-sm mb-2 flex items-center gap-2">
              Personality Type (Optional)
              <span className="text-xs text-gray-300">(e.g., INTJ-A)</span>
            </label>
            <input
              type="text"
              placeholder="XXXX-Y"
              value={personalityType}
              onChange={(e) => handlePersonalityChange(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {personalityError && (
              <p className="text-red-300 text-sm mt-1">{personalityError}</p>
            )}
            <a
              href="https://www.16personalities.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline mt-2 inline-block"
              style={{ color: COLORS.yellow }}
            >
              Take the 16 personalities test
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormComplete() || isSubmitting}
            className={`w-full py-4 rounded-2xl text-xl font-bold shadow-lg transition-all ${
              isFormComplete() && !isSubmitting
                ? 'hover:scale-105' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ 
              backgroundColor: isSubmitting ? '#888' : COLORS.yellow,
              color: COLORS.primary
            }}
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/onboarding/profile-picture')}
            className="w-full mt-4 py-3 text-white text-base underline hover:text-yellow-300 transition-colors"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
