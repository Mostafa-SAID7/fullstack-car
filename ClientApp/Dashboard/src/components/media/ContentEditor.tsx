import { useState } from 'react';
import { X, Save, Image as ImageIcon, Tag, Calendar } from 'lucide-react';
import type { Video, Podcast } from '../../services/media/types';

interface ContentEditorProps {
  content: Video | Podcast;
  type: 'video' | 'podcast';
  onSave: (updates: Partial<Video | Podcast>) => Promise<void>;
  onCancel: () => void;
}

export const ContentEditor = ({ content, type, onSave, onCancel }: ContentEditorProps) => {
  const [formData, setFormData] = useState({
    title: content.title,
    description: content.description,
    tags: content.tags,
    isPublic: content.isPublic,
    allowComments: content.allowComments,
    allowDownload: 'allowDownload' in content ? content.allowDownload : false,
    quality: 'quality' in content ? content.quality : '',
    episodeNumber: 'episodeNumber' in content ? content.episodeNumber : undefined,
    seasonNumber: 'seasonNumber' in content ? content.seasonNumber : undefined,
    seriesId: 'seriesId' in content ? content.seriesId : '',
    transcript: 'transcript' in content ? content.transcript : ''
  });

  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            Edit {type === 'video' ? 'Video' : 'Podcast'}
          </h2>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add tags"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Video-specific fields */}
          {type === 'video' && (
            <div>
              <label className="block text-sm font-medium mb-2">Quality</label>
              <select
                value={formData.quality}
                onChange={(e) => setFormData(prev => ({ ...prev, quality: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="HD">HD (720p)</option>
                <option value="FHD">Full HD (1080p)</option>
                <option value="4K">4K (2160p)</option>
              </select>
            </div>
          )}

          {/* Podcast-specific fields */}
          {type === 'podcast' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Episode Number</label>
                  <input
                    type="number"
                    value={formData.episodeNumber || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      episodeNumber: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Season Number</label>
                  <input
                    type="number"
                    value={formData.seasonNumber || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      seasonNumber: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Series ID</label>
                <input
                  type="text"
                  value={formData.seriesId}
                  onChange={(e) => setFormData(prev => ({ ...prev, seriesId: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter series identifier"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Transcript</label>
                <textarea
                  value={formData.transcript}
                  onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter podcast transcript"
                />
              </div>
            </>
          )}

          {/* Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isPublic" className="text-sm">Make public</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowComments"
                checked={formData.allowComments}
                onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="allowComments" className="text-sm">Allow comments</label>
            </div>

            {type === 'podcast' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowDownload"
                  checked={formData.allowDownload}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowDownload: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="allowDownload" className="text-sm">Allow download</label>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
