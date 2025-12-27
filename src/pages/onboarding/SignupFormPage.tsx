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

  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [email, setEmail] = useState(data.email);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [password, setPassword] = useState(data.password);
  const [confirmPassword, setConfirmPassword] = useState(data.confirmPassword);
  const [selectedUsageInterest, setSelectedUsageInterest] = useState(data.selectedUsageInterest);
  const [selectedIndustryInterest, setSelectedIndustryInterest] = useState(data.selectedIndustryInterest);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = () => {
    return password.length >= 8 && password === confirmPassword;
  };

  const isFormValid = () => {
    return firstName.trim() !== '' &&
           lastName.trim() !== '' &&
           validateEmail(email) &&
           phoneNumber.trim() !== '' &&
           password.length >= 8 &&
           password === confirmPassword &&
           selectedUsageInterest !== '' &&
           selectedIndustryInterest !== '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      addNotification('Please fill out all fields correctly before continuing.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://circlapp.online/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          password: password,
          main_usage: selectedUsageInterest,
          industry_interest: selectedIndustryInterest
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        const userId = data.user_id;

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
          userId
        });

        // Store for tutorial system
        localStorage.setItem('selected_usage_interest', selectedUsageInterest);
        localStorage.setItem('selected_industry_interest', selectedIndustryInterest);
        localStorage.setItem('user_id', userId.toString());

        addNotification('Account created successfully!', 'success');
        nextStep();
        navigate('/onboarding/profile-picture');
      } else if (response.status === 400) {
        const errorData = await response.json();
        const errorMessage = errorData.email?.[0] || 'This email is already taken. Please choose a new one.';
        addNotification(errorMessage, 'error');
      } else {
        addNotification(`Registration failed. Status code: ${response.status}`, 'error');
      }
    } catch (error) {
      addNotification('Network error. Please try again.', 'error');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allIndustries = industryCategories.flatMap(([_, industries]) => industries).sort();

  return (
    <div 
      className="min-h-screen py-12 px-6 relative overflow-y-auto"
      style={{ backgroundColor: COLORS.primary }}
    >
      {/* Decorative Clouds */}
      <div className="absolute top-0 left-0 pointer-events-none opacity-80">
        <div className="relative w-64 h-32">
          <div className="absolute w-30 h-30 bg-white rounded-full" style={{ top: '10px', left: '10px' }}></div>
          <div className="absolute w-25 h-25 bg-white rounded-full" style={{ top: '0px', left: '40px' }}></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 pointer-events-none opacity-80">
        <div className="relative w-48 h-24">
          <div className="absolute w-20 h-20 bg-white rounded-full" style={{ bottom: '10px', left: '10px' }}></div>
        </div>
      </div>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                minLength={8}
              />
              
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-300 text-sm">Passwords do not match</p>
              )}
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
