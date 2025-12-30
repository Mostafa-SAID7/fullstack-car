import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Save, RefreshCw, Power } from 'lucide-react';

export const AIAgentManagement = () => {
    // Persist active state to localStorage for better demo
    const [isAIEnabled, setIsAIEnabled] = useState(() => {
        const saved = localStorage.getItem('ai_agent_enabled');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(150);

    // Save state on change
    useEffect(() => {
        localStorage.setItem('ai_agent_enabled', JSON.stringify(isAIEnabled));
    }, [isAIEnabled]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Agent Management</h1>
                    <p className="text-muted-foreground mt-1">Configure your AI assistant's behavior and settings.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-3xl p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Agent Status</h3>
                        <div className={`w-3 h-3 rounded-full ${isAIEnabled ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-2xl ${isAIEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            <Power className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="font-medium text-lg">{isAIEnabled ? 'Active' : 'Disabled'}</p>
                            <p className="text-sm text-muted-foreground">System is {isAIEnabled ? 'operational' : 'offline'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAIEnabled(!isAIEnabled)}
                        className={`w-full py-2.5 rounded-xl font-medium transition-colors ${isAIEnabled
                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                            }`}
                    >
                        {isAIEnabled ? 'Deactivate Agent' : 'Activate Agent'}
                    </button>
                </motion.div>

                {/* Model Configuration */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border border-border rounded-3xl p-6 shadow-sm md:col-span-2"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Bot className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Model Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Model Temperature ({temperature})</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={temperature}
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                    className="w-full accent-primary"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Controls randomness: Lower is more focused, higher is more creative.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Max Tokens ({maxTokens})</label>
                                <input
                                    type="number"
                                    value={maxTokens}
                                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Model Provider</label>
                                <select className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50">
                                    <option>Microsoft DialoGPT (Local)</option>
                                    <option>OpenAI GPT-4 (Cloud)</option>
                                    <option>Hugging Face API</option>
                                </select>
                            </div>

                            {/* SVG Activity Chart */}
                            <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Activity (Last 24h)</h4>
                                <div className="h-16 w-full flex items-end gap-1">
                                    {[35, 45, 30, 60, 75, 50, 45, 55, 80, 70, 45, 50].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-xs mt-2 text-muted-foreground">
                                    <span>24h ago</span>
                                    <span>Now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity Mockup */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Recent Interactions</h3>
                    <button className="p-2 hover:bg-muted rounded-full transition-colors">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                <div className="space-y-4">
                    {[
                        { u: 1, q: "Toyota Camry Maintenance", t: "2m ago", s: "Success" },
                        { u: 2, q: "Best SUV 2024", t: "15m ago", s: "Success" },
                        { u: 3, q: "Sell my car", t: "1h ago", s: "Success" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-primary">U{item.u}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">Customer asked about "{item.q}"</p>
                                <p className="text-xs text-muted-foreground mt-1">{item.t} • Response Status: <span className="text-emerald-500 font-medium">{item.s}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
