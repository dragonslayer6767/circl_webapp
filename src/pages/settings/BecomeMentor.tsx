import { useState } from 'react';
import { COLORS } from '../../utils/colors';

export default function BecomeMentor() {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    // TODO: Implement API call
    console.log('Submitting mentor application:', { name, industry, reason });
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setName('');
      setIndustry('');
      setReason('');
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
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Application</h1>
          <p className="text-gray-600">Share your expertise and help fellow entrepreneurs grow</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Industry
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Technology, Finance, Healthcare"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Why do you want to become a mentor?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Share your motivation..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!name || !industry || !reason || isSubmitted}
            className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-white font-semibold transition-all shadow-lg ${
              !name || !industry || !reason || isSubmitted
                ? 'bg-gray-300 cursor-not-allowed'
                : 'hover:shadow-xl hover:scale-[1.02]'
            }`}
            style={{
              background: isSubmitted
                ? 'linear-gradient(90deg, #10b981, #059669)'
                : (!name || !industry || !reason)
                ? undefined
                : `linear-gradient(90deg, ${COLORS.primary}, #0066ff)`
            }}
          >
            {isSubmitted ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Application Submitted!</span>
              </>
            ) : (
              <span>Submit Application</span>
            )}
          </button>

          {isSubmitted && (
            <p className="text-center text-sm text-gray-600 animate-in fade-in duration-200">
              We'll review your application and get back to you within 2-3 business days.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
