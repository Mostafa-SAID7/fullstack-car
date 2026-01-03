import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minimize2, Maximize2, Loader2, MessageSquare, Wrench, Search, BarChart3, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { aiAgentService, type ChatMessage } from '../../services/aiAgentService';

type AIMode = 'chat' | 'maintenance' | 'recommendation' | 'analysis';

export const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            height: isMinimized ? 'auto' : '550px'
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-80 md:w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-4 text-white">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white/20 rounded-lg">
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
                                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded transition-colors">
                                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Mode Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowModes(!showModes)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-all w-full justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        {currentModeInfo && <currentModeInfo.icon size={14} className="text-white" />}
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
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 overflow-hidden z-10"
                                        >
                                            {modes.map((m) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => {
                                                        setMode(m.id as AIMode);
                                                        setShowModes(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${mode === m.id ? 'bg-gray-50 dark:bg-gray-600 font-semibold' : 'text-gray-600 dark:text-gray-300'
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
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 bg-gray-50/30 dark:bg-gray-900/10">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-600'
                                                    }`}
                                            >
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-600 flex gap-1">
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder={`Ask in ${currentModeInfo?.label.toLowerCase()}...`}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none dark:text-white"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || loading}
                                            className="absolute right-1.5 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors shadow-lg"
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

            <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all ${isOpen
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white'
                    }`}
            >
                {isOpen ? <X size={26} /> : (
                    <div className="relative">
                        <Bot size={26} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white dark:border-gray-800"></span>
                        </span>
                    </div>
                )}
            </motion.button>
        </div>
    );
};
