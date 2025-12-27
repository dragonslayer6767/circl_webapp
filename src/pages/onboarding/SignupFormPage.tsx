import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/colors';
import { useOnboarding } from '../../context/OnboardingContext';
import { useNotification } from '../../context/NotificationContext';

const usageInterestOptions = [
  "Sell a Skill", "Make Investments", "Share Knowledge", "Be Part of the Community",
  "Find Investors", "Find Mentors", "Find Co-Founder/s", "Network with Entrepreneurs",
  "Scale Your Business", "Start Your Business", "Student"
];

const industryCategories: [string, string[]][] = [
  ["Technology & Digital", [
    "Artificial Intelligence", "Blockchain & Web3", "Cloud Computing", "Cybersecurity",
    "Data Science & Analytics", "Internet of Things (IoT)", "Metaverse Technologies",
    "Robotics & Automation", "Software Development", "Virtual/Augmented Reality"
  ]],
  ["Business & Finance", [
    "Accounting & Financial Services", "Consulting & Professional Services",
    "E-Commerce & Marketplaces", "FinTech (Financial Technology)", "Franchising",
    "Investment & Venture Capital", "Real Estate & Property Tech", "Startups & Entrepreneurship"
  ]],
  ["Consumer Goods & Services", [
    "Beauty & Personal Care", "Consumer Electronics", "Fashion & Apparel", "Food & Beverage",
    "Home Goods & Furniture", "Luxury Goods", "Retail & Merchandising"
  ]],
  ["Creative & Media", [
    "Advertising & Marketing", "Architecture & Design", "Arts & Culture", "Entertainment & Media",
    "Gaming & Esports", "Music & Audio Production", "Publishing & Journalism"
  ]],
  ["Education & Knowledge", [
    "Corporate Training", "EdTech (Education Technology)", "Higher Education", "K-12 Education",
    "Online Learning Platforms", "Professional Development"
  ]],
  ["Energy & Environment", [
    "Clean Energy", "Environmental Services", "Green Technology", "Recycling & Waste Management",
    "Sustainability Solutions"
  ]],
  ["Food & Agriculture", [
    "AgTech (Agriculture Technology)", "Beverage Production", "Food Production",
    "Food Service & Hospitality", "Organic Farming", "Restaurant & Dining"
  ]],
  ["Health & Wellness", [
    "Biotechnology", "Fitness & Sports", "HealthTech", "Medical Devices", "Mental Health Services",
    "Pharmaceuticals", "Wellness & Self-Care"
  ]],
  ["Industrial & Manufacturing", [
    "3D Printing", "Advanced Manufacturing", "Aerospace & Defense", "Automotive",
    "Chemical Production", "Construction", "Industrial Equipment"
  ]],
  ["Services", [
    "Childcare & Education", "Cleaning Services", "Event Planning", "Home Services",
    "Legal Services", "Logistics & Delivery", "Staffing & Recruiting"
  ]],
  ["Social Impact", [
    "Community Development", "Nonprofit Organizations", "Social Enterprises",
    "Urban Development", "Women-Led Businesses"
  ]]
];

export default function SignupFormPage() {
  const navigate = useNavigate();
  const { data, updateData, nextStep } = useOnboarding();
  const { addNotification } = useNotification();

  const [firstName, setFirstName] = useState(data?.firstName || '');
  const [lastName, setLastName] = useState(data?.lastName || '');
  const [email, setEmail] = useState(data?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(data?.phoneNumber || '');
  const [password, setPassword] = useState(data?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(data?.confirmPassword || '');
  const [selectedUsageInterest, setSelectedUsageInterest] = useState(data?.selectedUsageInterest || '');
  const [selectedIndustryInterest, setSelectedIndustryInterest] = useState(data?.selectedIndustryInterest || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const filtered = value.replace(/\D/g, '');
    const limited = filtered.substring(0, 10);
    
    // Format as xxx-xxx-xxxx
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i === 3 || i === 6) {
        formatted += '-';
      }
      formatted += limited[i];
    }
    
    return formatted;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Check for xxx-xxx-xxxx format
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const isFormValid = () => {
    return firstName.trim() !== '' &&
           lastName.trim() !== '' &&
           validateEmail(email) &&
           validatePhoneNumber(phoneNumber) &&
           validatePassword(password) &&
           password === confirmPassword &&
           selectedUsageInterest !== '' &&
           selectedIndustryInterest !== '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value.toLowerCase());
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
    if (formatted && !validatePhoneNumber(formatted)) {
      setPhoneError('Phone must be in format: xxx-xxx-xxxx');
    } else {
      setPhoneError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value && !validatePassword(value)) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  };

  const capitalizeFirstLetter = (value: string): string => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(capitalizeFirstLetter(value));
  };

  const handleLastNameChange = (value: string) => {
    setLastName(capitalizeFirstLetter(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      addNotification('Please fill out all fields correctly before continuing.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Mock registration - no API call for testing
    setTimeout(() => {
      const mockUserId = Date.now(); // Generate mock user ID

      // Store user_id for subsequent requests
      updateData({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        selectedUsageInterest,
        selectedIndustryInterest,
        userId: mockUserId
      });

      // Store for tutorial system
      localStorage.setItem('selected_usage_interest', selectedUsageInterest);
      localStorage.setItem('selected_industry_interest', selectedIndustryInterest);
      localStorage.setItem('user_id', mockUserId.toString());

      addNotification('Account created successfully!', 'success');
      setIsSubmitting(false);
      nextStep();
      navigate('/onboarding/profile-picture');
    }, 500);
  };

  const allIndustries = industryCategories.flatMap(([_, industries]) => industries).sort();

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
              width: '33.33%',
              backgroundColor: COLORS.yellow 
            }}
          />
        </div>
        <div className="text-center py-2" style={{ backgroundColor: COLORS.primary }}>
          <span className="text-white text-sm font-medium">Step 2 of 6</span>
        </div>
      </div>

      <div className="absolute top-0 left-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ top: '10px', left: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ top: '0px', left: '40px' }}></div>
        </div>
      </div>

      {/* Decorative Clouds - Bottom Left */}
      <div className="absolute bottom-0 left-0 pointer-events-none opacity-80">
        <div className="relative w-48 h-24">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ bottom: '10px', left: '10px' }}></div>
        </div>
      </div>

      {/* Decorative Clouds - Top Right */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-80">
        <div className="relative w-48 h-24">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ top: '10px', right: '10px' }}></div>
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

        <h2 className="text-2xl font-bold text-white mb-6">Account Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                {emailError && email && (
                  <p className="text-red-300 text-sm mt-1 ml-1">{emailError}</p>
                )}
              </div>
              
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (xxx-xxx-xxxx)"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                {phoneError && phoneNumber && (
                  <p className="text-red-300 text-sm mt-1 ml-1">{phoneError}</p>
                )}
              </div>
              
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && password && (
                  <p className="text-red-300 text-sm mt-1 ml-1">{passwordError}</p>
                )}
              </div>
              
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-300 text-sm mt-1 ml-1">Passwords do not match</p>
                )}
              </div>
            </div>
          </div>

          {/* Experience Setup */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Experience Setup</h2>
            <div className="space-y-3">
              <select
                value={selectedUsageInterest}
                onChange={(e) => setSelectedUsageInterest(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select Usage Interest</option>
                {usageInterestOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <select
                value={selectedIndustryInterest}
                onChange={(e) => setSelectedIndustryInterest(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select Industry Interest</option>
                {allIndustries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`w-full py-4 rounded-2xl text-xl font-bold shadow-lg transition-all ${
              isFormValid() && !isSubmitting
                ? 'hover:scale-105' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ 
              backgroundColor: isSubmitting ? '#888' : COLORS.yellow,
              color: COLORS.primary
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Next'}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/onboarding/terms')}
            className="w-full mt-4 py-3 text-white text-base underline hover:text-yellow-300 transition-colors"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
