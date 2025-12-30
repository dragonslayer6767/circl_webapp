import { useState, useEffect } from 'react';
import { circleService, Circle, CircleMember } from '../services/circleServices';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../utils/colors';
import './TestCircles.css';

export default function TestCircles() {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDesc, setNewCircleDesc] = useState('');
  const [circleImage, setCircleImage] = useState<File | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [joinCircleId, setJoinCircleId] = useState('');

  // ============ Helper Functions ============

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleError = (err: any) => {
    console.error('❌ Error:', err);
    setError(err.response?.data?.detail || err.message || 'An error occurred');
  };

  // ============ Fetch Circles ============

  const handleFetchCircles = async () => {
    resetMessages();
    setLoading(true);
    try {
      console.log('📋 Fetching circles...');
      const data = await circleService.getCircles();
      setCircles(data);
      setSuccess(`✅ Loaded ${data.length} circles`);
      console.log('✅ Circles loaded:', data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ Create Circle ============

  const handleCreateCircle = async () => {
    if (!newCircleName.trim() || !newCircleDesc.trim()) {
      setError('❌ Name and description are required');
      return;
    }

    resetMessages();
    setLoading(true);
    try {
      console.log('🆕 Creating circle...');
      const newCircle = await circleService.createCircle({
        name: newCircleName,
        description: newCircleDesc,
        image: circleImage || undefined,
        is_public: true,
      });
      setSuccess(`✅ Circle "${newCircle.name}" created!`);
      setNewCircleName('');
      setNewCircleDesc('');
      setCircleImage(null);
      console.log('✅ Circle created:', newCircle);
      await handleFetchCircles();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ Get Circle Details ============

  const handleGetCircleDetails = async (circleId: number) => {
    resetMessages();
    setLoading(true);
    try {
      console.log(`📖 Fetching circle ${circleId}...`);
      const circle = await circleService.getCircle(circleId);
      setSelectedCircle(circle);
      setSuccess(`✅ Loaded circle: ${circle.name}`);
      console.log('✅ Circle details:', circle);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ Get Circle Members ============

  const handleGetCircleMembers = async (circleId: number) => {
    resetMessages();
    setLoading(true);
    try {
      console.log(`👥 Fetching members for circle ${circleId}...`);
      const data = await circleService.getCircleMembers(circleId);
      setCircleMembers(data.results);
      setSuccess(`✅ Loaded ${data.results.length} members`);
      console.log('✅ Circle members:', data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ Join Circle ============

  const handleJoinCircle = async () => {
    if (!joinCircleId.trim()) {
      setError('❌ Circle ID is required');
      return;
    }

    resetMessages();
    setLoading(true);
    try {
      const circleId = parseInt(joinCircleId);
      console.log(`🚀 Joining circle ${circleId}...`);
      const result = await circleService.joinCircle(circleId, accessCode || undefined);
      setSuccess(`✅ ${result.message}`);
      setJoinCircleId('');
      setAccessCode('');
      console.log('✅ Joined circle:', result);
      await handleFetchCircles();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ Leave Circle ============

  const handleLeaveCircle = async (circleId: number) => {
    resetMessages();
    setLoading(true);
    try {
      console.log(`👋 Leaving circle ${circleId}...`);
      const result = await circleService.leaveCircle(circleId);
      setSuccess(`✅ ${result.message}`);
      console.log('✅ Left circle:', result);
      await handleFetchCircles();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ Generate Invite ============

  const handleGenerateInvite = async (circleId: number) => {
    resetMessages();
    setLoading(true);
    try {
      console.log(`🔗 Generating invite for circle ${circleId}...`);
      const invite = await circleService.generateInviteLink(circleId);
      setSuccess(`✅ Invite generated: ${invite.token}`);
      console.log('✅ Invite link:', invite);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Load circles on mount
  useEffect(() => {
    if (user?.user_id) {
      handleFetchCircles();
    }
  }, [user]);

  return (
    <div className="test-circles-container">
      <div className="test-circles-header">
        <h1>🔄 CIRCL Phase 1 - Circles API Test</h1>
        <p className="logged-in-as">Logged in as: <strong>{user?.fullname || 'Not logged in'}</strong></p>
      </div>

      {/* Messages */}
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {/* Create Circle Section */}
      <section className="test-section create-section">
        <h2>🆕 Create New Circle</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Circle Name"
            value={newCircleName}
            onChange={(e) => setNewCircleName(e.target.value)}
            disabled={loading}
          />
          <textarea
            placeholder="Circle Description"
            value={newCircleDesc}
            onChange={(e) => setNewCircleDesc(e.target.value)}
            disabled={loading}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCircleImage(e.target.files?.[0] || null)}
            disabled={loading}
          />
          <button 
            onClick={handleCreateCircle} 
            disabled={loading}
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? '⏳ Creating...' : '✅ Create Circle'}
          </button>
        </div>
      </section>

      {/* Join Circle Section */}
      <section className="test-section join-section">
        <h2>🚀 Join Existing Circle</h2>
        <div className="form-group">
          <input
            type="number"
            placeholder="Circle ID"
            value={joinCircleId}
            onChange={(e) => setJoinCircleId(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Access Code (optional)"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            disabled={loading}
          />
          <button 
            onClick={handleJoinCircle} 
            disabled={loading}
            style={{ backgroundColor: COLORS.secondary }}
          >
            {loading ? '⏳ Joining...' : '✅ Join Circle'}
          </button>
        </div>
      </section>

      {/* My Circles Section */}
      <section className="test-section circles-section">
        <div className="section-header">
          <h2>📚 My Circles ({circles.length})</h2>
          <button 
            onClick={handleFetchCircles} 
            disabled={loading}
            className="refresh-btn"
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh'}
          </button>
        </div>

        <div className="circles-grid">
          {circles.length === 0 ? (
            <p className="no-circles">No circles found. Create one or join an existing circle!</p>
          ) : (
            circles.map((circle) => (
              <div key={circle.id} className="circle-card">
                {circle.image && (
                  <img 
                    src={circleService.getCircleImageUrl(circle.image)} 
                    alt={circle.name}
                    className="circle-image"
                  />
                )}
                <div className="circle-content">
                  <h3>{circle.name}</h3>
                  <p className="description">{circle.description}</p>
                  <p className="member-count">👥 {circle.member_count} members</p>
                  <div className="button-group">
                    <button 
                      onClick={() => handleGetCircleDetails(circle.id)} 
                      disabled={loading}
                      title="View circle details"
                    >
                      👁️ View
                    </button>
                    <button 
                      onClick={() => handleGetCircleMembers(circle.id)} 
                      disabled={loading}
                      title="View circle members"
                    >
                      👥 Members
                    </button>
                    <button 
                      onClick={() => handleGenerateInvite(circle.id)} 
                      disabled={loading}
                      title="Generate invite link"
                    >
                      🔗 Invite
                    </button>
                    <button 
                      onClick={() => handleLeaveCircle(circle.id)} 
                      disabled={loading}
                      className="danger"
                      title="Leave this circle"
                    >
                      👋 Leave
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Circle Details Section */}
      {selectedCircle && (
        <section className="test-section details-section">
          <h2>📖 Circle Details: {selectedCircle.name}</h2>
          <div className="details-box">
            <div className="detail-row">
              <span className="label">Circle ID:</span>
              <span className="value">{selectedCircle.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Description:</span>
              <span className="value">{selectedCircle.description}</span>
            </div>
            <div className="detail-row">
              <span className="label">Members:</span>
              <span className="value">{selectedCircle.member_count}</span>
            </div>
            <div className="detail-row">
              <span className="label">Public:</span>
              <span className="value">{selectedCircle.is_public ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Created:</span>
              <span className="value">{new Date(selectedCircle.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </section>
      )}

      {/* Circle Members Section */}
      {circleMembers.length > 0 && (
        <section className="test-section members-section">
          <h2>👥 Circle Members ({circleMembers.length})</h2>
          <div className="members-list">
            {circleMembers.map((member) => (
              <div key={member.id} className="member-card">
                {member.user.profile_image && (
                  <img 
                    src={member.user.profile_image} 
                    alt={member.user.first_name}
                    className="member-avatar"
                  />
                )}
                <div className="member-info">
                  <p className="name">{member.user.first_name} {member.user.last_name}</p>
                  <p className="email">{member.user.email}</p>
                  <p className="role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
