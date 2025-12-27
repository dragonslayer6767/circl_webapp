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

  const [birthday, setBirthday] = useState(data.birthday);
  const [location, setLocation] = useState(data.location);
  const [gender, setGender] = useState(data.gender);
  const [availability, setAvailability] = useState(data.availability);
  const [personalityType, setPersonalityType] = useState(data.personalityType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormComplete = () => {
    return birthday !== '' && location !== '' && gender !== '' && availability !== '';
    // Personality type is optional
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
      addNotification('Please fill out all required fields', 'error');
      return;
    }

    // Validate age (must be 18+)
    const age = validateAge(birthday);
    if (age < 18) {
      addNotification('You must be 18 years or older to sign up', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit personal details to backend
      const response = await fetch(`https://circlapp.online/api/users/${data.userId}/personal-details/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthday,
          location,
          gender,
          availability,
          personality_type: personalityType
        }),
      });

      if (response.ok) {
        updateData({
          birthday,
          location,
          gender,
          availability,
          personalityType
        });

        addNotification('Personal information saved!', 'success');
        nextStep();
        navigate('/onboarding/notifications');
      } else {
        addNotification('Failed to save personal information', 'error');
      }
    } catch (error) {
      addNotification('Network error. Please try again.', 'error');
      console.error('Personal info error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen py-12 px-6 relative overflow-y-auto"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Decorative Clouds */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ top: '10px', right: '10px' }}></div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-48 h-24">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ bottom: '10px', right: '10px' }}></div>
        </div>
      </div>

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
              onChange={(e) => setBirthday(e.target.value)}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-white text-sm mb-2">Location (City, State) *</label>
            <input
              type="text"
              placeholder="e.g., Austin, TX"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
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
              onChange={(e) => setPersonalityType(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
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
