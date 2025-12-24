import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import { useAuth } from '../hooks/useAuth';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BusinessProfileData {
  id?: number;
  business_name?: string;
  about?: string;
  vision?: string;
  mission?: string;
  company_culture?: string;
  product_service?: string;
  traction?: string;
  unique_selling_proposition?: string;
  revenue_streams?: string;
  advisors_mentors?: string;
  cofounders?: string;
  key_hires?: string;
  amount_raised?: string;
  financial_projections?: string;
  funding_stage?: string;
  use_of_funds?: string;
  investment?: string;
  mentorship?: string;
  other?: string;
  roles_needed?: string;
  user?: number;
  pricing_strategy?: string;
  industry?: string;
  type?: string;
  stage?: string;
  revenue?: string;
  location?: string;
  looking_for?: string;
}

export default function BusinessProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'business'>('business');
  const [isEditing, setIsEditing] = useState(false);
  
  // Business profile state
  const [businessName, setBusinessName] = useState('Your Company');
  const [about, setAbout] = useState('');
  
  const [companyDetails, setCompanyDetails] = useState({
    Industry: '',
    Type: '',
    Stage: '',
    Revenue: '',
    Location: '',
    'Looking for': ''
  });

  const [values, setValues] = useState({
    Vision: '',
    'Company Culture': ''
  });

  const [solutionDetails, setSolutionDetails] = useState({
    'Product/Service': '',
    'Unique Selling Proposition': '',
    'Traction/Progress': ''
  });

  const [businessModelDetails, setBusinessModelDetails] = useState({
    'Revenue Streams': '',
    'Pricing Strategy': ''
  });

  const [teamDetails, setTeamDetails] = useState({
    CoFounders: '',
    'Key Hires': '',
    'Advisors/Mentors': ''
  });

  useEffect(() => {
    // TODO: Fetch business profile data from API
    // Mock data for now
  }, [user]);

  const handleSave = () => {
    // TODO: Save business profile updates to API
    console.log('Saving business profile updates');
    setIsEditing(false);
  };

  const updateCompanyDetail = (key: string, value: string) => {
    setCompanyDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const updateSolutionDetail = (key: string, value: string) => {
    setSolutionDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateBusinessModelDetail = (key: string, value: string) => {
    setBusinessModelDetails(prev => ({ ...prev, [key]: value }));
  };

  const updateTeamDetail = (key: string, value: string) => {
    setTeamDetails(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Tabs */}
      <div className="sticky top-16 z-20" style={{ backgroundColor: COLORS.primary }}>
        <div className="flex justify-center items-center py-3">
          {/* Your Profile Tab */}
          <button
            onClick={() => {
              setActiveTab('profile');
              navigate('/profile');
            }}
            className="flex flex-col items-center w-28 mx-4"
          >
            <span 
              className={`text-white text-sm mb-2 ${activeTab === 'profile' ? 'font-semibold' : 'font-normal'}`}
            >
              Your Profile
            </span>
            <div 
              className={`h-0.5 w-full transition-all ${activeTab === 'profile' ? 'bg-white' : 'bg-transparent'}`}
            />
          </button>

          {/* Business Profile Tab */}
          <button
            onClick={() => setActiveTab('business')}
            className="flex flex-col items-center w-32 mx-4"
          >
            <span 
              className={`text-white text-sm mb-2 ${activeTab === 'business' ? 'font-semibold' : 'font-normal'}`}
            >
              Business Profile
            </span>
            <div 
              className={`h-0.5 w-full transition-all ${activeTab === 'business' ? 'bg-white' : 'bg-transparent'}`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 pb-24">
        {/* Company Overview Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          {/* Company Logo Placeholder */}
          <div 
            className="rounded-2xl h-32 flex flex-col items-center justify-center mb-4"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0066ff)` }}
          >
            <svg className="w-12 h-12 text-white mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-sm font-medium opacity-80">Company Logo</span>
          </div>

          {/* Company Name */}
          {isEditing ? (
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Company"
              className="w-full text-2xl font-bold text-gray-900 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              {businessName}
            </h2>
          )}
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">About</h3>
          </div>
          {isEditing ? (
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about your company..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {about || 'Tell us about your company...'}
            </p>
          )}
        </div>

        {/* Company Details Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Company Overview</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(companyDetails).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-500 mb-2">{key}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateCompanyDetail(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className={`font-medium ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {value || 'Not specified'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Our Values Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Our Values</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(values).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-500 mb-2">{key}</label>
                {isEditing ? (
                  <textarea
                    value={value}
                    onChange={(e) => updateValue(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className={`leading-relaxed ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {value || 'Not specified'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Our Solution Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Our Solution</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(solutionDetails).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-500 mb-2">{key}</label>
                {isEditing ? (
                  <textarea
                    value={value}
                    onChange={(e) => updateSolutionDetail(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className={`leading-relaxed ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {value || 'Not specified'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Business Model Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Business Model</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(businessModelDetails).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-500 mb-2">{key}</label>
                {isEditing ? (
                  <textarea
                    value={value}
                    onChange={(e) => updateBusinessModelDetail(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className={`leading-relaxed ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {value || 'Not specified'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Our Team Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Our Team</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(teamDetails).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-500 mb-2">{key}</label>
                {isEditing ? (
                  <textarea
                    value={value}
                    onChange={(e) => updateTeamDetail(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className={`leading-relaxed ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {value || 'Not specified'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit/Save Button - Fixed at top right */}
      <button
        onClick={() => {
          if (isEditing) {
            handleSave();
          }
          setIsEditing(!isEditing);
        }}
        className="fixed top-20 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30 hover:opacity-90 transition-opacity"
        style={{ backgroundColor: COLORS.primary }}
      >
        {isEditing ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )}
      </button>
    </div>
  );
}
