import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minimize2, Maximize2, Loader2, MessageSquare, Wrench, Search, BarChart3, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiAgentService, type ChatMessage } from '../../../services/ai-agent';

import type { AIMode } from '../../../types/pages/dashboard/components';

interface AIAssistantProps {
    isEmbedded?: boolean;
    onClose?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isEmbedded = false, onClose }) => {
    const [isOpen, setIsOpen] = useState(isEmbedded ? true : false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [mode, setMode] = useState<AIMode>('chat');
    const [showModes, setShowModes] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: 'Hello! I am your Community Car AI Assistant. I can help with general chat, car maintenance advice, matching you with the perfect car, or analyzing market trends. How can I help today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages, isOpen, isMinimized]);

    useEffect(() => {
        const handleInsight = (e: any) => {
            const prompt = e.detail.prompt;
            setIsOpen(true);
            setIsMinimized(false);
            setMode('analysis');
            handleExternalPrompt(prompt);
        };
        window.addEventListener('ai-insight', handleInsight);
        return () => window.removeEventListener('ai-insight', handleInsight);
    }, []);

    const handleExternalPrompt = async (prompt: string) => {
        const userMessage: ChatMessage = { role: 'user', content: prompt };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        try {
            const response = await aiAgentService.chat(prompt, messages, 'dashboard_analysis');
            setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error analyzing data. Check connection.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const query = input;
        setInput('');
        setLoading(true);

        try {
            let response;
            if (mode === 'chat') {
                response = await aiAgentService.chat(query, messages);
            } else if (mode === 'maintenance') {
                // Simple parsing for maintenance demo or just send a structured query
                response = await aiAgentService.chat(`[Maintenance Mode] ${query}`, messages);
            } else if (mode === 'recommendation') {
                response = await aiAgentService.chat(`[Recommendation Mode] ${query}`, messages);
            } else {
                response = await aiAgentService.chat(`[Analysis Mode] ${query}`, messages);
            }

            const assistantMessage: ChatMessage = { role: 'assistant', content: response.response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please make sure the AI agent is running.' }]);
        } finally {
            setLoading(false);
        }
    };

    const modes = [
        { id: 'chat', label: 'General Chat', icon: MessageSquare, color: 'text-blue-500' },
        { id: 'maintenance', label: 'Maintenance Advisor', icon: Wrench, color: 'text-orange-500' },
        { id: 'recommendation', label: 'Car Matcher', icon: Search, color: 'text-purple-500' },
        { id: 'analysis', label: 'Market Analysis', icon: BarChart3, color: 'text-green-500' },
    ];

    const currentModeInfo = modes.find(m => m.id === mode);

    // If embedded, render only the chat interface
    if (isEmbedded) {
        return (
            <div className="flex flex-col h-[550px]">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/90 p-4 text-primary-foreground">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary-foreground/20 rounded-lg">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">AI Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] opacity-80 uppercase tracking-wider">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                            {onClose && (
                                <button onClick={onClose} className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mode Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowModes(!showModes)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg text-xs font-medium transition-all w-full justify-between"
                        >
                            <div className="flex items-center gap-2">
                                {currentModeInfo && <currentModeInfo.icon size={14} className="text-primary-foreground" />}
                                <span>{currentModeInfo?.label}</span>
                            </div>
                            <ChevronDown size={14} className={`transition-transform ${showModes ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showModes && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 glassmorphism rounded-xl shadow-xl border border-border/30 overflow-hidden z-10 bg-background/20 backdrop-blur-md"
                                >
                                    {modes.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                setMode(m.id as AIMode);
                                                setShowModes(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs hover:bg-background/30 hover:backdrop-blur-sm transition-all duration-200 ${
                                                mode === m.id
                                                    ? 'bg-primary/20 text-primary font-semibold backdrop-blur-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <m.icon size={16} className={m.color} />
                                            {m.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Chat Body */}
                {!isMinimized && (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] custom-scrollbar bg-background/50 backdrop-blur-sm">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm backdrop-blur-sm ${msg.role === 'user'
                                            ? 'bg-primary/90 text-primary-foreground rounded-tr-sm border border-primary/20'
                                            : 'bg-card/80 text-card-foreground rounded-tl-sm border border-border/50'
                                            }`}
                                    >
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-card p-3 rounded-2xl rounded-tl-sm border border-border flex gap-1">
                                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border/50 bg-background/30 backdrop-blur-sm">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Ask in ${currentModeInfo?.label.toLowerCase()}...`}
                                    className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="absolute right-1.5 p-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-lg transition-colors shadow-lg disabled:shadow-none"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Original standalone widget (for backward compatibility)
    return (
        <div className="fixed top-20 right-6 z-[60] flex flex-col items-end">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 rounded-xl shadow-lg flex items-center justify-center transition-all border-2 mb-4 ${
                    isOpen
                        ? 'bg-muted text-foreground border-border'
                        : 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-transparent hover:shadow-xl'
                    }`}
            >
                {isOpen ? <X size={26} /> : (
                    <div className="relative">
                        <Bot size={26} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-background"></span>
                        </span>
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            height: isMinimized ? 'auto' : '550px'
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="w-80 md:w-[400px] glassmorphism rounded-2xl shadow-xl border border-border/50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-primary/90 p-4 text-primary-foreground">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-primary-foreground/20 rounded-lg">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">AI Assistant</h3>
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-[10px] opacity-80 uppercase tracking-wider">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Mode Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowModes(!showModes)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg text-xs font-medium transition-all w-full justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        {currentModeInfo && <currentModeInfo.icon size={14} className="text-primary-foreground" />}
                                        <span>{currentModeInfo?.label}</span>
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform ${showModes ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showModes && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-2 glassmorphism rounded-xl shadow-xl border border-border/30 overflow-hidden z-10 bg-background/20 backdrop-blur-md"
                                        >
                                            {modes.map((m) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => {
                                                        setMode(m.id as AIMode);
                                                        setShowModes(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs hover:bg-background/30 hover:backdrop-blur-sm transition-all duration-200 ${
                                                        mode === m.id
                                                            ? 'bg-primary/20 text-primary font-semibold backdrop-blur-sm'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    <m.icon size={16} className={m.color} />
                                                    {m.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Chat Body */}
                        {!isMinimized && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] custom-scrollbar bg-background">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                    : 'bg-card text-card-foreground rounded-tl-sm border border-border'
                                                    }`}
                                            >
                                                <div className="prose prose-sm max-w-none">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-card/80 backdrop-blur-sm p-3 rounded-2xl rounded-tl-sm border border-border/50 flex gap-1">
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-border bg-card">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder={`Ask in ${currentModeInfo?.label.toLowerCase()}...`}
                                            className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || loading}
                                            className="absolute right-1.5 p-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-lg transition-colors shadow-lg disabled:shadow-none"
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
