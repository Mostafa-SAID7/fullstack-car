// Knowledge Entry Form Component - Add/Edit knowledge entries

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import type { KnowledgeEntry, KnowledgeCategory } from '../../../types/ai-agent';

interface KnowledgeEntryFormProps {
  entry?: KnowledgeEntry | null;
  onSubmit: (data: { content: string; category: KnowledgeCategory; source: string }) => void;
  onCancel: () => void;
}

export const KnowledgeEntryForm: React.FC<KnowledgeEntryFormProps> = ({
  entry,
  onSubmit,
  onCancel
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<KnowledgeCategory>('maintenance');
  const [source, setSource] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry) {
      setContent(entry.content);
      setCategory(entry.category);
      setSource(entry.source);
    }
  }, [entry]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!source.trim()) {
      newErrors.source = 'Source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        content: content.trim(),
        category,
        source: source.trim()
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              {entry ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className={`w-full bg-background border rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none ${
                  errors.content ? 'border-red-500' : 'border-border/50'
                }`}
                placeholder="Enter knowledge content..."
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {content.length} characters
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
                className={`w-full bg-background border rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all ${
                  errors.category ? 'border-red-500' : 'border-border/50'
                }`}
              >
                <option value="maintenance">Maintenance</option>
                <option value="diagnostics">Diagnostics</option>
                <option value="buying_guide">Buying Guide</option>
                <option value="selling_tips">Selling Tips</option>
                <option value="modifications">Modifications</option>
                <option value="car_specs">Car Specs</option>
                <option value="community_help">Community Help</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Source */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Source *
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={`w-full bg-background border rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all ${
                  errors.source ? 'border-red-500' : 'border-border/50'
                }`}
                placeholder="e.g., Manual, Expert, Documentation"
              />
              {errors.source && (
                <p className="text-sm text-red-500">{errors.source}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-semibold"
              >
                <Save className="w-4 h-4" />
                {entry ? 'Update Entry' : 'Add Entry'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
