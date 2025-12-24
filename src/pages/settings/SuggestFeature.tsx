import { useState } from 'react';
import { COLORS } from '../../utils/colors';

export default function SuggestFeature() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement API call
    console.log('Submitting feature suggestion:', { title, description });
    setIsSubmitted(true);
    
    setTimeout(() => {
      setTitle('');
      setDescription('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8 pt-6">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary + '20' }}
          >
            <svg className="w-8 h-8" style={{ color: COLORS.primary }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suggest a Feature</h1>
          <p className="text-gray-600">Help us improve Circl with your ideas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Feature Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for your suggestion"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your feature idea in detail..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title || !description || isSubmitted}
            className={`w-full py-4 rounded-xl text-white font-semibold transition-all ${
              !title || !description || isSubmitted ? 'bg-gray-300 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
            }`}
            style={{
              background: isSubmitted ? '#10b981' : (!title || !description) ? undefined : `linear-gradient(90deg, ${COLORS.primary}, #0066ff)`
            }}
          >
            {isSubmitted ? '✓ Suggestion Submitted!' : 'Submit Suggestion'}
          </button>

          {isSubmitted && (
            <p className="text-center text-sm text-gray-600">Thank you! We'll review your suggestion.</p>
          )}
        </div>
      </div>
    </div>
  );
}
