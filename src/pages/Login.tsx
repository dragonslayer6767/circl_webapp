import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { useNotification } from '../context/NotificationContext';
import { COLORS } from '../utils/colors';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      addNotification('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email.trim().toLowerCase(), password);
      addNotification('Welcome back!', 'success');
      navigate('/forum');
    } catch (error) {
      addNotification('The email or password you entered is incorrect. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      addNotification('Please enter your email', 'error');
      return;
    }

    // TODO: Implement forgot password API call
    addNotification('We will get back to you soon with a new password.', 'success');
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
  };

  const handleJoinCircl = () => {
    navigate('/signup');
  };

  return (
    <div 
      className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center px-8 py-12 overflow-y-auto"
      style={{ backgroundColor: COLORS.primary }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          document.getElementById('email-input')?.blur();
          document.getElementById('password-input')?.blur();
        }
      }}
    >
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-10">
        <div 
          className="w-[160px] h-[160px] rounded-full bg-white flex items-center justify-center mb-6"
        >
          <h1 className="text-[44px] font-bold" style={{ color: COLORS.primary }}>
            Circl.
          </h1>
        </div>
        <h2 className="text-xl font-bold text-white text-center">
          Where Ideas Go Around
        </h2>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-2xl px-6">
        {/* Join Circl Button */}
        <button
          onClick={handleJoinCircl}
          className="w-full py-4 mb-6 text-xl font-bold rounded-xl transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#ffde59',
            color: COLORS.primary,
          }}
        >
          Join Circl
        </button>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <input
              id="email-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
              autoCapitalize="none"
              autoComplete="email"
            />

            {/* Password Input */}
            <input
              id="password-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
              autoComplete="current-password"
            />

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-xl font-bold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'white',
                color: COLORS.primary,
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Forgot Password Link */}
        <button
          onClick={() => setShowForgotPassword(true)}
          className="w-full mt-6 text-base font-medium text-white underline hover:opacity-80 transition-opacity"
        >
          Forgot your password?
        </button>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForgotPassword(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.primary }}>
              Forgot Password
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Enter your email. We will get back to you soon with a new password.
            </p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: COLORS.primary }}
                autoCapitalize="none"
              />
              
              <button
                type="submit"
                className="w-full py-3 font-bold rounded-xl"
                style={{
                  backgroundColor: '#ffde59',
                  color: COLORS.primary,
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
