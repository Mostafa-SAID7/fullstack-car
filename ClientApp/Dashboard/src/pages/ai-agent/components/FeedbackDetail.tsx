// Feedback Detail Component - Display detailed feedback information

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, AlertCircle, CheckSquare, XSquare, MessageSquare } from 'lucide-react';
import type { Feedback } from '../../../types/ai-agent';
import { FeedbackType } from '../../../types/ai-agent';

interface FeedbackDetailProps {
  feedback: Feedback;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason?: string) => void;
}

export const FeedbackDetail: React.FC<FeedbackDetailProps> = ({
  feedback,
  onClose,
  onApprove,
  onReject
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case FeedbackType.POSITIVE:
        return <ThumbsUp className="w-6 h-6 text-green-500" />;
      case FeedbackType.NEGATIVE:
        return <ThumbsDown className="w-6 h-6 text-red-500" />;
      case FeedbackType.CORRECTION:
        return <AlertCircle className="w-6 h-6 text-purple-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
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

  const handleReject = () => {
    onReject(rejectReason || undefined);
    setShowRejectForm(false);
    setRejectReason('');
  };

  const color = getFeedbackColor(feedback.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col max-h-[600px]"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-muted/30">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-${color}-500/10`}>
              {getFeedbackIcon(feedback.type)}
            </div>
            <div>
              <h2 className="text-xl font-bold capitalize">{feedback.type} Feedback</h2>
              <span className={`text-xs px-2 py-1 rounded-full bg-${color}-500/10 text-${color}-600 font-medium`}>
                {feedback.type}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Conversation ID</p>
            <p className="font-medium font-mono text-xs">{feedback.conversationId}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Message ID</p>
            <p className="font-medium font-mono text-xs">{feedback.messageId}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Timestamp</p>
            <p className="font-medium">{new Date(feedback.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Feedback ID</p>
            <p className="font-medium font-mono text-xs">{feedback.id.slice(0, 16)}...</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Feedback Details
        </h3>

        {feedback.data && (
          <div className="space-y-4">
            {typeof feedback.data === 'object' ? (
              Object.entries(feedback.data).map(([key, value]) => (
                <div key={key} className="bg-background/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap break-words">
                  {String(feedback.data)}
                </p>
              </div>
            )}
          </div>
        )}

        {!feedback.data && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No additional data available
          </p>
        )}
      </div>

      {/* Actions */}
      {feedback.type === FeedbackType.CORRECTION && (
        <div className="p-6 border-t border-border/50 bg-muted/30">
          {showRejectForm ? (
            <div className="space-y-3">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (optional)"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                rows={3}
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReject}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <XSquare className="w-4 h-4" />
                  Confirm Reject
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                <CheckSquare className="w-5 h-5" />
                Approve & Add to Knowledge Base
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors font-semibold"
              >
                <XSquare className="w-5 h-5" />
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
