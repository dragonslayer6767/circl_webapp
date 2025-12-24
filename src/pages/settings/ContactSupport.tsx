import { useState } from 'react';
import { COLORS } from '../../utils/colors';

export default function ContactSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement API call
    console.log('Submitting support request:', { name, email, subject, message });
    setIsSubmitted(true);
    
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary + '20' }}
          >
            <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a7 7 0 00-7 7v4a3 3 0 003 3h1a1 1 0 001-1v-6a1 1 0 00-1-1H6v-1a4 4 0 018 0v1h-1a1 1 0 00-1 1v6a1 1 0 001 1h1a3 3 0 003-3v-4a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Support</h1>
          <p className="text-gray-600">We're here to help! Send us a message and we'll respond within 24 hours.</p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: COLORS.primary + '20' }}
            >
              <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Email</p>
              <p className="text-sm text-gray-600">support@circlapp.online</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: COLORS.primary + '20' }}
            >
              <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Response Time</p>
              <p className="text-sm text-gray-600">Within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="How can we help you?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide as much detail as possible..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name || !email || !subject || !message || isSubmitted}
            className={`w-full py-4 rounded-xl text-white font-semibold transition-all ${
              !name || !email || !subject || !message || isSubmitted ? 'bg-gray-300 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
            }`}
            style={{
              background: isSubmitted ? '#10b981' : (!name || !email || !subject || !message) ? undefined : `linear-gradient(90deg, ${COLORS.primary}, #0066ff)`
            }}
          >
            {isSubmitted ? '✓ Message Sent!' : 'Send Message'}
          </button>

          {isSubmitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-center text-sm text-green-700 font-medium">
                Thank you for contacting us! We've received your message and will get back to you soon.
              </p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900 mb-1">How do I reset my password?</p>
              <p className="text-sm text-gray-600">Go to Settings → Change Password to update your password.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">How do I become a mentor?</p>
              <p className="text-sm text-gray-600">Visit Settings → Become a Mentor to submit your application.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">How can I delete my account?</p>
              <p className="text-sm text-gray-600">Go to Settings → Delete Account. Note that this action cannot be undone.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
