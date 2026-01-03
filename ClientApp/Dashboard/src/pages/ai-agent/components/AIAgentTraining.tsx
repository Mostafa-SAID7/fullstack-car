import { motion } from 'framer-motion';
import { 
  Play, 
  Square, 
  Upload, 
  RefreshCw, 
  Filter, 
  Eye, 
  Download 
} from 'lucide-react';
import type { TrainingSession } from '../../../types/training';
import { getStatusColor, getStatusIcon } from '../utils/helpers';

interface AIAgentTrainingProps {
  trainingSessions: TrainingSession[];
  isTraining: boolean;
  onStartTraining: () => void;
  onStopTraining: () => void;
}

export const AIAgentTraining: React.FC<AIAgentTrainingProps> = ({
  trainingSessions,
  isTraining,
  onStartTraining,
  onStopTraining
}) => {
  return (
    <div className="space-y-6">
      {/* Training Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Training Controls</h3>
          <div className="flex gap-3">
            <button 
              onClick={isTraining ? onStopTraining : onStartTraining}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isTraining 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {isTraining ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTraining ? 'Stop Training' : 'Start Training'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Dataset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Training Dataset</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50">
                <option>Car Knowledge Base (15K samples)</option>
                <option>Customer Service (25K samples)</option>
                <option>Maintenance Guide (8K samples)</option>
                <option>Custom Dataset</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Training Mode</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50">
                <option>Fine-tuning</option>
                <option>Full Training</option>
                <option>Transfer Learning</option>
                <option>Incremental Learning</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Learning Rate</label>
              <input
                type="number"
                step="0.0001"
                defaultValue="0.0001"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Batch Size</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50">
                <option>16</option>
                <option>32</option>
                <option>64</option>
                <option>128</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Epochs</label>
              <input
                type="number"
                defaultValue="10"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Validation Split</label>
              <input
                type="number"
                step="0.1"
                defaultValue="0.2"
                min="0.1"
                max="0.5"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Training Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dashboard-card rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Training Sessions</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {trainingSessions.map((session) => (
            <div key={session.id} className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(session.status)}`}>
                    {getStatusIcon(session.status)}
                  </div>
                  <div>
                    <h4 className="font-medium">{session.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Started: {session.startTime} • Duration: {session.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Accuracy: {(session.accuracy * 100).toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Loss: {session.loss.toFixed(3)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{session.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      session.status === 'running' ? 'bg-blue-500' :
                      session.status === 'completed' ? 'bg-green-500' :
                      session.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${session.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Dataset: {session.datasetSize.toLocaleString()} samples
                </span>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};