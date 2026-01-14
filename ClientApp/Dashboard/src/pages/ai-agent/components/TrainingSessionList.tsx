// Training Session List Component

import { motion } from 'framer-motion';
import { Square, Trash2, Clock } from 'lucide-react';
import type { TrainingJob, TrainingStatus } from '../../../types/ai-agent';

interface TrainingSessionListProps {
  sessions: TrainingJob[];
  selectedSession: TrainingJob | null;
  onSelectSession: (session: TrainingJob) => void;
  onStopTraining: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  loading: boolean;
  getStatusIcon: (status: TrainingStatus) => JSX.Element;
  getStatusColor: (status: TrainingStatus) => string;
}

export const TrainingSessionList: React.FC<TrainingSessionListProps> = ({
  sessions,
  selectedSession,
  onSelectSession,
  onStopTraining,
  onDeleteSession,
  loading,
  getStatusIcon,
  getStatusColor
}) => {
  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Training Sessions</h3>
      
      {loading && sessions.length === 0 ? (
        // Loading skeletons
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        ))
      ) : sessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-12 text-center"
        >
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Training Sessions</h3>
          <p className="text-muted-foreground">
            Start a new training session to improve your AI agent
          </p>
        </motion.div>
      ) : (
        sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectSession(session)}
            className={`bg-card border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedSession?.id === session.id
                ? 'border-primary shadow-lg ring-2 ring-primary/20'
                : 'border-border/50 hover:border-primary/50'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getStatusIcon(session.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{session.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-${getStatusColor(session.status)}-500/10 text-${getStatusColor(session.status)}-600 capitalize`}>
                      {session.status}
                    </span>
                    {session.progress > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(session.progress)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {session.status === 'running' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStopTraining(session.id);
                    }}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Stop Training"
                  >
                    <Square className="w-4 h-4 text-red-500" />
                  </button>
                )}
                {(session.status === 'completed' || session.status === 'failed' || session.status === 'cancelled') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Session"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {session.status === 'running' && (
              <div className="mb-3">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${session.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>Started: {formatDate(session.startedAt)}</span>
                {session.duration && (
                  <>
                    <span>•</span>
                    <span>Duration: {formatDuration(session.duration)}</span>
                  </>
                )}
              </div>
              {session.config && (
                <span>{session.config.epochs} epochs</span>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};
