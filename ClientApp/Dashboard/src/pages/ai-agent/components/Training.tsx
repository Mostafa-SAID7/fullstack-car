// Training Component - AI Agent Training Interface

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Square,
  RefreshCw,
  Plus,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { trainingService } from '../../../services/ai-agent';
import { useToast } from '../../../hooks';
import type { TrainingJob, TrainingStatus } from '../../../types/ai-agent';
import { TrainingSessionList } from './TrainingSessionList';
import { TrainingProgress } from './TrainingProgress';
import { TrainingConfigForm } from './TrainingConfigForm';

export const Training: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingJob[]>([]);
  const [selectedSession, setSelectedSession] = useState<TrainingJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadTrainingSessions();
  }, []);

  const loadTrainingSessions = async () => {
    try {
      setLoading(true);
      const response = await trainingService.listTrainingSessions({ limit: 50 });
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error loading training sessions:', error);
      toast.error('Failed to load training sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async (config: any) => {
    try {
      const newSession = await trainingService.startTraining({
        name: config.name || `Training ${new Date().toLocaleString()}`,
        config
      });
      
      toast.success('Training session started successfully');
      setShowConfigForm(false);
      setSessions([newSession, ...sessions]);
      setSelectedSession(newSession);
    } catch (error) {
      console.error('Error starting training:', error);
      toast.error('Failed to start training session');
    }
  };

  const handleStopTraining = async (sessionId: string) => {
    try {
      await trainingService.stopTraining(sessionId);
      toast.success('Training session stopped');
      loadTrainingSessions();
    } catch (error) {
      console.error('Error stopping training:', error);
      toast.error('Failed to stop training session');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this training session?')) {
      return;
    }

    try {
      await trainingService.deleteTrainingSession(sessionId);
      toast.success('Training session deleted');
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete training session');
    }
  };

  const getStatusIcon = (status: TrainingStatus) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TrainingStatus) => {
    switch (status) {
      case 'running':
        return 'blue';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      case 'cancelled':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  // Calculate stats
  const runningCount = sessions.filter(s => s.status === 'running').length;
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const failedCount = sessions.filter(s => s.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training Management</h2>
          <p className="text-muted-foreground">Train and improve AI agent models</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTrainingSessions}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowConfigForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Training
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{sessions.length}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Total Sessions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <RefreshCw className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{runningCount}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Running</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">{completedCount}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold">{failedCount}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Failed</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session List */}
        <div>
          <TrainingSessionList
            sessions={sessions}
            selectedSession={selectedSession}
            onSelectSession={setSelectedSession}
            onStopTraining={handleStopTraining}
            onDeleteSession={handleDeleteSession}
            loading={loading}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        </div>

        {/* Progress/Detail View */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selectedSession ? (
            <TrainingProgress
              session={selectedSession}
              onClose={() => setSelectedSession(null)}
              onStop={() => handleStopTraining(selectedSession.id)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 rounded-2xl p-12 text-center"
            >
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Training Session</h3>
              <p className="text-muted-foreground">
                Click on a session to view progress and metrics
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Training Config Form Modal */}
      {showConfigForm && (
        <TrainingConfigForm
          onSubmit={handleStartTraining}
          onClose={() => setShowConfigForm(false)}
        />
      )}
    </div>
  );
};
