import { useState } from 'react';
import { COLORS } from '../../utils/colors';

export default function ReportProblem() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement API call
    console.log('Submitting problem report:', { subject, description });
    setIsSubmitted(true);
    
    setTimeout(() => {
      setSubject('');
      setDescription('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8 pt-6">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-100"
          >
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Problem</h1>
          <p className="text-gray-600">Let us know what's wrong so we can fix it</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of the problem"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide as much detail as possible..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!subject || !description || isSubmitted}
            className={`w-full py-4 rounded-xl text-white font-semibold transition-all ${
              !subject || !description || isSubmitted ? 'bg-gray-300 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
            }`}
            style={{
              background: isSubmitted ? '#10b981' : (!subject || !description) ? undefined : `linear-gradient(90deg, ${COLORS.primary}, #0066ff)`
            }}
          >
            {isSubmitted ? '✓ Report Submitted!' : 'Submit Report'}
          </button>

          {isSubmitted && (
            <p className="text-center text-sm text-gray-600">Thank you! We'll look into this issue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
