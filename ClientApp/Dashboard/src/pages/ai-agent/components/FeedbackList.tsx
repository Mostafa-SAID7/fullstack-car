// Feedback List Component - Display list of feedback items

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, AlertCircle, CheckSquare, XSquare, Clock } from 'lucide-react';
import type { Feedback } from '../../../types/ai-agent';
import { FeedbackType } from '../../../types/ai-agent';

interface FeedbackListProps {
  feedback: Feedback[];
  selectedFeedback: Feedback | null;
  selectedIds: Set<string>;
  onSelectFeedback: (feedback: Feedback) => void;
  onToggleSelection: (id: string) => void;
  onToggleSelectAll: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({
  feedback,
  selectedFeedback,
  selectedIds,
  onSelectFeedback,
  onToggleSelection,
  onToggleSelectAll,
  onApprove,
  onReject,
  loading
}) => {
  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case FeedbackType.POSITIVE:
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case FeedbackType.NEGATIVE:
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      case FeedbackType.CORRECTION:
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case FeedbackType.POSITIVE:
        return 'green';
      case FeedbackType.NEGATIVE:
        return 'red';
      case FeedbackType.CORRECTION:
        return 'purple';
      default:
        return 'gray';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Select All */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Feedback Items</h3>
        {feedback.length > 0 && (
          <button
            onClick={onToggleSelectAll}
            className="text-sm text-primary hover:underline"
          >
            {selectedIds.size === feedback.length ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>

      {loading && feedback.length === 0 ? (
        // Loading skeletons
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        ))
      ) : feedback.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-12 text-center"
        >
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Feedback</h3>
          <p className="text-muted-foreground">
            No feedback items match your filters
          </p>
        </motion.div>
      ) : (
        feedback.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-card border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedFeedback?.id === item.id
                ? 'border-primary shadow-lg ring-2 ring-primary/20'
                : 'border-border/50 hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedIds.has(item.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleSelection(item.id);
                }}
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
              />

              {/* Content */}
              <div
                className="flex-1 min-w-0"
                onClick={() => onSelectFeedback(item)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getFeedbackIcon(item.type)}
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-${getFeedbackColor(item.type)}-500/10 text-${getFeedbackColor(item.type)}-600 capitalize font-medium`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(item.timestamp)}</span>
                  </div>
                </div>

                {/* Message Preview */}
                {item.data && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {typeof item.data === 'object' && 'message' in item.data
                      ? (item.data as any).message
                      : JSON.stringify(item.data)}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Conversation: {item.conversationId.slice(0, 8)}...
                  </div>

                  {/* Quick Actions */}
                  {item.type === FeedbackType.CORRECTION && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApprove(item.id);
                        }}
                        className="p-1.5 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckSquare className="w-4 h-4 text-green-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReject(item.id);
                        }}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XSquare className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};
