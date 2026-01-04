import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import type { AIModel } from '../../../types/models';
import type { AIAgentConfig } from '../../../types/config';

interface AIAgentModelsProps {
  config: AIAgentConfig;
  onConfigUpdate: (updates: Partial<AIAgentConfig>) => void;
}

export const AIAgentModels: React.FC<AIAgentModelsProps> = ({
  config,
  onConfigUpdate
}) => {
  const models: AIModel[] = [
    {
      id: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      name: 'DialoGPT-medium',
      provider: 'microsoft',
      size: '345M',
      accuracy: 89.2,
      active: true,
      description: 'Conversational AI model optimized for dialogue',
      version: '1.0',
      parameters: { temperature: 0.7, maxTokens: 1024, topP: 0.9, topK: 40 },
      capabilities: { textGeneration: true, textCompletion: true, conversation: true, codeGeneration: false, translation: false, summarization: false, questionAnswering: true },
      performance: { averageResponseTime: 120, throughput: 50, memoryUsage: 1024, cpuUsage: 30, accuracy: 89.2, errorRate: 0.05 }
    },
    {
      id: '2',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      name: 'GPT-3.5-turbo',
      provider: 'openai',
      size: '175B',
      accuracy: 94.1,
      active: false,
      description: 'Advanced language model with high accuracy',
      version: '1.0',
      parameters: { temperature: 0.7, maxTokens: 2048, topP: 1, topK: 50 },
      capabilities: { textGeneration: true, textCompletion: true, conversation: true, codeGeneration: true, translation: true, summarization: true, questionAnswering: true },
      performance: { averageResponseTime: 800, throughput: 10, memoryUsage: 4096, cpuUsage: 80, accuracy: 94.1, errorRate: 0.01 }
    },
    {
      id: '3',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      name: 'BERT-base',
      provider: 'google',
      size: '110M',
      accuracy: 87.5,
      active: false,
      description: 'Bidirectional encoder for understanding context',
      version: '1.0',
      parameters: { temperature: 0.5, maxTokens: 512, topP: 0.9, topK: 30 },
      capabilities: { textGeneration: false, textCompletion: true, conversation: false, codeGeneration: false, translation: false, summarization: true, questionAnswering: true },
      performance: { averageResponseTime: 60, throughput: 100, memoryUsage: 512, cpuUsage: 20, accuracy: 87.5, errorRate: 0.08 }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
      >
        <h3 className="font-bold text-lg mb-6">Available Models</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${model.active
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }`}
              onClick={() => {/* Handle model selection */ }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span className="font-medium">{model.name}</span>
                </div>
                {model.active && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-3">{model.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-medium">{model.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{model.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-medium text-green-500">{model.accuracy}%</span>
                </div>
              </div>

              <button
                className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${model.active
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
              >
                {model.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Model Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
      >
        <h3 className="font-bold text-lg mb-6">Model Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Temperature ({config.temperature})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => onConfigUpdate({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Controls randomness: Lower is more focused, higher is more creative
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Top-P ({config.topP})</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.topP}
                onChange={(e) => onConfigUpdate({ topP: parseFloat(e.target.value) })}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nucleus sampling parameter for diversity control
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Tokens</label>
              <input
                type="number"
                value={config.maxTokens}
                onChange={(e) => onConfigUpdate({ maxTokens: parseInt(e.target.value) })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Top-K</label>
              <input
                type="number"
                value={config.topK}
                onChange={(e) => onConfigUpdate({ topK: parseInt(e.target.value) })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};