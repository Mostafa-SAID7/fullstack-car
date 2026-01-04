import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, Database, Layers, Terminal } from 'lucide-react';
import { aiAgentService } from '../../../services/aiAgentService';

interface TrainingStatus {
    is_training: boolean;
    progress: number;
    status: string;
    results?: {
        loss: number;
        accuracy: number;
        duration: string;
        model_path: string;
    };
}

export const ModelTraining: React.FC = () => {
    const [config, setConfig] = useState({
        base_model: 'gpt2',
        epochs: 3,
        dataset_name: 'car_knowledge.json'
    });
    const [status, setStatus] = useState<TrainingStatus | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const currentStatus = await aiAgentService.getTrainingStatus();
                setStatus(currentStatus);
                if (currentStatus.is_training) {
                    setLogs(prev => {
                        const newLog = `[${new Date().toLocaleTimeString()}] ${currentStatus.status}`;
                        if (prev[prev.length - 1] !== newLog) {
                            return [...prev.slice(-9), newLog];
                        }
                        return prev;
                    });
                }
            } catch (error) {
                console.error('Failed to fetch training status:', error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const startTraining = async () => {
        try {
            setLogs([`[${new Date().toLocaleTimeString()}] Starting training process...`]);
            await aiAgentService.startTraining(config);
        } catch (error) {
            setLogs(prev => [...prev, `[ERROR] Failed to start training: ${error}`]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">AI Model Training</h2>
                    <p className="text-gray-400">Fine-tune automotive models for specialized assistance</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${status?.is_training ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-gray-800 text-gray-400'}`}>
                        {status?.is_training ? 'Training Active' : 'System Idle'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 glass p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Layers size={20} className="text-blue-400" />
                        Parameters
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Base Model</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                value={config.base_model}
                                onChange={(e) => setConfig({ ...config, base_model: e.target.value })}
                                disabled={status?.is_training}
                            >
                                <option value="gpt2">GPT-2 (Lightweight)</option>
                                <option value="distilbert-base-uncased">DistilBERT</option>
                                <option value="car-bert-v1">Custom CarBERT</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Epochs ({config.epochs})</label>
                            <input
                                type="range" min="1" max="10"
                                className="w-full accent-blue-500"
                                value={config.epochs}
                                onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
                                disabled={status?.is_training}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                <Database size={14} /> Dataset
                            </label>
                            <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 text-sm">
                                {config.dataset_name}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={startTraining}
                        disabled={status?.is_training}
                        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        {status?.is_training ? (
                            <RotateCcw className="animate-spin" size={20} />
                        ) : (
                            <Play size={20} />
                        )}
                        {status?.is_training ? 'Processing...' : 'Start Training'}
                    </button>
                </div>

                {/* Progress & Logs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Card */}
                    <div className="glass p-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Live Progress</h3>
                            <span className="text-2xl font-bold text-blue-400">{Math.round(status?.progress || 0)}%</span>
                        </div>

                        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${status?.progress || 0}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <p className="mt-4 text-sm text-blue-300 font-medium">
                            {status?.status || 'Waiting to start...'}
                        </p>
                    </div>

                    {/* Results / Results Table */}
                    {status?.results && !status.is_training && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6"
                        >
                            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                <CheckCircle size={20} />
                                Training Results
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase">Loss</p>
                                    <p className="text-xl font-mono text-white">{status.results.loss}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase">Accuracy</p>
                                    <p className="text-xl font-mono text-white">{(status.results.accuracy * 100).toFixed(1)}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase">Duration</p>
                                    <p className="text-xl font-mono text-white">{status.results.duration}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 uppercase">GPU Usage</p>
                                    <p className="text-xl font-mono text-white">82%</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Console Logs */}
                    <div className="bg-black/60 rounded-2xl border border-white/10 p-6 font-mono text-sm h-48 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 mb-4 text-gray-500 border-b border-white/5 pb-2">
                            <Terminal size={14} /> System Console
                        </div>
                        <div className="space-y-1">
                            {logs.map((log, i) => (
                                <div key={i} className={`${log.includes('[ERROR]') ? 'text-red-400' : 'text-blue-400/80'}`}>
                                    {log}
                                </div>
                            ))}
                            {status?.is_training && (
                                <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
