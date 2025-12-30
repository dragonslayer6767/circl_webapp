import { useState } from 'react';
import { COLORS } from '../../utils/colors';
import { forumService } from '../../services/forumService';
import './PostComposer.css';

interface PostComposerProps {
  onPostCreate?: () => void;
}

export default function PostComposer({ onPostCreate }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Public');
  const [privacy, setPrivacy] = useState('Public');
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CHARACTER_LIMIT = 500;

  const categories = ['Public', 'Networking', 'Mentorship', 'Resources', 'Announcements'];
  const privacyOptions = ['Public', 'Private'];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(undefined);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call forumService.createPost() API
      await forumService.createPost({
        content,
        category,
        privacy,
        image,
      });

      console.log('✨ Post created successfully');

      // Reset form
      setContent('');
      setCategory('Public');
      setPrivacy('Public');
      setImage(undefined);
      setImagePreview(null);

      // Call callback
      onPostCreate?.();
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Post creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingChars = CHARACTER_LIMIT - content.length;
  const charPercentage = (content.length / CHARACTER_LIMIT) * 100;

  return (
    <form onSubmit={handleSubmit} className="post-composer">
      <div className="composer-header">
        <h3>Create a Post</h3>
        <p className="text-sm text-gray-500">Share your thoughts with the community</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Content Textarea */}
      <div className="composer-field">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, CHARACTER_LIMIT))}
          placeholder="What's on your mind? Share your thoughts, questions, or updates..."
          className="composer-textarea"
          rows={4}
          disabled={isLoading}
        />
        <div className="char-count">
          <div 
            className="char-bar"
            style={{
              width: `${charPercentage}%`,
              backgroundColor: charPercentage > 80 ? '#dc3545' : COLORS.primary
            }}
          />
          <span className={charPercentage > 80 ? 'text-red' : ''}>
            {remainingChars} characters remaining
          </span>
        </div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="remove-image-btn"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>
      )}

      {/* Category & Privacy Dropdowns */}
      <div className="composer-controls">
        <div className="control-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
            className="control-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="privacy">Privacy</label>
          <select
            id="privacy"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            disabled={isLoading}
            className="control-select"
          >
            {privacyOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="composer-actions">
        <button
          type="button"
          onClick={() => document.getElementById('image-input')?.click()}
          className="action-button secondary"
          disabled={isLoading}
          title="Add image to post"
        >
          🖼️ Add Image
        </button>

        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          disabled={isLoading}
        />

        <button
          type="submit"
          className="action-button primary"
          disabled={isLoading || !content.trim()}
          style={{ backgroundColor: COLORS.primary }}
        >
          {isLoading ? '⏳ Posting...' : '✨ Post'}
        </button>
      </div>
    </form>
  );
}
