import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import { useAuth } from '../hooks/useAuth';

interface ProfileData {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  profile_image?: string;
  bio?: string;
  birthday?: string;
  personality_type?: string;
  institution_attended?: string;
  years_of_experience?: number;
  locations?: string[];
  skillsets?: string[];
  clubs?: string[];
  hobbies?: string[];
  entrepreneurial_history?: string;
  circs?: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'business'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [connections, setConnections] = useState(0);
  
  // Editable fields
  const [bio, setBio] = useState('');
  const [birthday, setBirthday] = useState('');
  const [personalityType, setPersonalityType] = useState('');
  const [institution, setInstitution] = useState('');
  const [experience, setExperience] = useState('');
  const [locations, setLocations] = useState('');
  const [skills, setSkills] = useState('');
  const [clubs, setClubs] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [entrepreneurialHistory, setEntrepreneurialHistory] = useState('');

  useEffect(() => {
    // TODO: Fetch profile data from API
    // Mock data for now
    const mockProfile: ProfileData = {
      id: user?.user_id || 49,
      first_name: user?.fullname?.split(' ')[0] || 'Fragne',
      last_name: user?.fullname?.split(' ')[1] || 'Delgado',
      full_name: user?.fullname || 'Fragne Delgado',
      email: user?.email || 'fragne@example.com',
      bio: '',
      circs: 122
    };
    setProfileData(mockProfile);
    setConnections(0);
  }, [user]);

  const calculateAge = (birthday: string) => {
    if (!birthday) return 'N/A';
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age.toString();
  };

  const handleSave = () => {
    // TODO: Save profile updates to API
    console.log('Saving profile updates');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Tabs */}
      <div className="sticky top-16 z-20" style={{ backgroundColor: COLORS.primary }}>
        <div className="flex justify-center items-center py-3">
          {/* Your Profile Tab */}
          <button
            onClick={() => setActiveTab('profile')}
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
            onClick={() => {
              setActiveTab('business');
              navigate('/profile/business');
            }}
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
        {/* Profile Header Card */}
        <div 
          className="rounded-3xl p-8 mb-6 shadow-xl relative overflow-hidden"
          style={{ backgroundColor: COLORS.primary }}
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative mb-5">
              {/* Enhanced outer glow - smaller */}
              <div className="absolute inset-0 w-36 h-36 mx-auto rounded-full bg-white/30 blur-xl" />
              
              {/* White border ring - medium size */}
              <div className="relative w-32 h-32 mx-auto rounded-full border-4 border-white overflow-hidden bg-white shadow-2xl">
                {profileData?.profile_image ? (
                  <img 
                    src={profileData.profile_image} 
                    alt={profileData.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: COLORS.yellow }}>
                    <span className="text-5xl text-white font-bold">
                      {profileData?.first_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                
                {/* Camera icon overlay */}
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-10" style={{ backgroundColor: COLORS.primary }}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Name and Username */}
            <h1 className="text-2xl font-bold text-white mb-2">
              {profileData?.full_name || 'Loading...'}
            </h1>
            <div className="bg-white/25 backdrop-blur-md rounded-xl px-5 py-2 mb-6 shadow-lg">
              <span className="text-white text-sm font-semibold">
                @{profileData?.last_name}{profileData?.id}
              </span>
            </div>

            {/* Stats Cards */}
            <div className="flex justify-center gap-5 w-full max-w-md">
              {/* Connections */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg mb-2 border-2 border-white/10"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)' }}
                >
                  <svg className="w-5 h-5 text-white mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-white font-bold text-lg">{connections}</span>
                </div>
                <span className="text-white text-xs font-medium">Connections</span>
              </div>

              {/* Circles */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg mb-2 border-2 border-white/10"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)' }}
                >
                  <svg className="w-5 h-5 text-white mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-white font-bold text-lg">0</span>
                </div>
                <span className="text-white text-xs font-medium">Circles</span>
              </div>

              {/* Circs */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg mb-2 border-2 border-white/10"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)' }}
                >
                  <svg className="w-5 h-5 text-white mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-bold text-lg">{profileData?.circs || 0}</span>
                </div>
                <span className="text-white text-xs font-medium">Circs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade to Premium Button */}
        <button 
          className="w-full rounded-2xl p-4 mb-6 shadow-lg flex items-center justify-between group hover:shadow-xl transition-all"
          style={{ background: `linear-gradient(90deg, ${COLORS.primary}, #0066ff)` }}
        >
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            <span className="text-white font-semibold text-lg">Upgrade to Premium</span>
          </div>
          <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Bio Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Bio</h2>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          ) : (
            <p className="text-gray-600">
              {bio || 'Tell others about yourself...'}
            </p>
          )}
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">About {profileData?.first_name}</h2>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="space-y-5">
            <ProfileField 
              label="Age" 
              value={calculateAge(birthday)}
              editValue={birthday}
              onEdit={setBirthday}
              isEditing={isEditing}
              placeholder="YYYY-MM-DD"
            />
            <ProfileField 
              label="Institution" 
              value={institution || 'Not set'}
              editValue={institution}
              onEdit={setInstitution}
              isEditing={isEditing}
              placeholder="Institution"
            />
            <ProfileField 
              label="Location(s)" 
              value={locations || 'Not set'}
              editValue={locations}
              onEdit={setLocations}
              isEditing={isEditing}
              placeholder="Location(s)"
            />
            {(personalityType || isEditing) && (
              <ProfileField 
                label="Personality Type" 
                value={personalityType || 'Not set'}
                editValue={personalityType}
                onEdit={setPersonalityType}
                isEditing={isEditing}
                placeholder="Personality Type"
              />
            )}
          </div>
        </div>

        {/* Technical Side Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Technical Side</h2>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="space-y-5">
            <ProfileField 
              label="Skills" 
              value={skills || 'Not set'}
              editValue={skills}
              onEdit={setSkills}
              isEditing={isEditing}
              placeholder="Skills (comma-separated)"
            />
            <ProfileField 
              label="Experience" 
              value={experience ? `${experience} years` : 'Not set'}
              editValue={experience}
              onEdit={setExperience}
              isEditing={isEditing}
              placeholder="Years of experience"
              type="number"
            />
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Interests</h2>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="space-y-5">
            <ProfileField 
              label="Clubs" 
              value={clubs || 'Not set'}
              editValue={clubs}
              onEdit={setClubs}
              isEditing={isEditing}
              placeholder="Clubs (comma-separated)"
            />
            <ProfileField 
              label="Hobbies" 
              value={hobbies || 'Not set'}
              editValue={hobbies}
              onEdit={setHobbies}
              isEditing={isEditing}
              placeholder="Hobbies (comma-separated)"
            />
          </div>
        </div>

        {/* Entrepreneurial History Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Entrepreneurial History</h2>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {isEditing ? (
            <textarea
              value={entrepreneurialHistory}
              onChange={(e) => setEntrepreneurialHistory(e.target.value)}
              placeholder="Share your entrepreneurial journey..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          ) : (
            <p className="text-gray-600">
              {entrepreneurialHistory || 'Share your entrepreneurial journey...'}
            </p>
          )}
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

// Profile Field Component
interface ProfileFieldProps {
  label: string;
  value: string;
  editValue: string;
  onEdit: (value: string) => void;
  isEditing: boolean;
  placeholder: string;
  type?: string;
}

function ProfileField({ label, value, editValue, onEdit, isEditing, placeholder, type = 'text' }: ProfileFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-gray-500">{label}</label>
        {!isEditing && value !== 'Not set' && (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      {isEditing ? (
        <input
          type={type}
          value={editValue}
          onChange={(e) => onEdit(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className={`font-medium ${value === 'Not set' ? 'text-gray-400' : 'text-gray-900'}`}>
          {value}
        </p>
      )}
    </div>
  );
}
