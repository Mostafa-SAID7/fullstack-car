import { useState } from 'react';
import { 
  Trash2, 
  Archive, 
  Eye, 
  EyeOff, 
  Tag, 
  CheckSquare,
  Square,
  X
} from 'lucide-react';

interface BulkOperationsProps {
  selectedCount: number;
  onDelete: () => Promise<void>;
  onArchive: () => Promise<void>;
  onMakePublic: () => Promise<void>;
  onMakePrivate: () => Promise<void>;
  onAddTags: (tags: string[]) => Promise<void>;
  onClearSelection: () => void;
}

export const BulkOperations = ({
  selectedCount,
  onDelete,
  onArchive,
  onMakePublic,
  onMakePrivate,
  onAddTags,
  onClearSelection
}: BulkOperationsProps) => {
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleOperation = async (operation: () => Promise<void>, confirmMessage?: string) => {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    try {
      setProcessing(true);
      await operation();
    } catch (error) {
      console.error('Bulk operation failed:', error);
      alert('Operation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleAddTags = async () => {
    if (tags.length === 0) {
      alert('Please add at least one tag');
      return;
    }

    try {
      setProcessing(true);
      await onAddTags(tags);
      setTags([]);
      setShowTagDialog(false);
    } catch (error) {
      console.error('Failed to add tags:', error);
      alert('Failed to add tags. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border shadow-lg rounded-lg p-4 z-40">
        <div className="flex items-center gap-4">
          {/* Selection Info */}
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            <span className="font-medium">{selectedCount} selected</span>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOperation(onMakePublic)}
              disabled={processing}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Make public"
            >
              <Eye className="w-4 h-4" />
              Public
            </button>

            <button
              onClick={() => handleOperation(onMakePrivate)}
              disabled={processing}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Make private"
            >
              <EyeOff className="w-4 h-4" />
              Private
            </button>

            <button
              onClick={() => setShowTagDialog(true)}
              disabled={processing}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add tags"
            >
              <Tag className="w-4 h-4" />
              Tags
            </button>

            <button
              onClick={() => handleOperation(onArchive, 'Are you sure you want to archive the selected items?')}
              disabled={processing}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
              Archive
            </button>

            <button
              onClick={() => handleOperation(onDelete, 'Are you sure you want to delete the selected items? This action cannot be undone.')}
              disabled={processing}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Clear selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tag Dialog */}
      {showTagDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Tags</h3>
              <button
                onClick={() => setShowTagDialog(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter tag name"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowTagDialog(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTags}
                  disabled={processing || tags.length === 0}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Adding...' : 'Add Tags'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
