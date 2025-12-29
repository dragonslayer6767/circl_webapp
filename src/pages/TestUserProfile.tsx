import { useEffect, useState } from 'react';
import { userService, UserProfile } from '../services/userServices';

export default function TestUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Change this to a valid user ID in your backend
    const userId = 1;
    userService.getUserProfile(userId)
      .then(setProfile)
      .catch(err => setError(err.message || 'Error fetching user profile'));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Loading...</div>;
  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {profile.fullname}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>ID:</strong> {profile.user_id}</p>
    </div>
  );
}
