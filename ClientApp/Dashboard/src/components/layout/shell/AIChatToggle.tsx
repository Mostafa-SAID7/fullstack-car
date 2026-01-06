import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import { AIAssistant } from '../../../pages/dashboard/components/AIAssistant';

export const AIChatToggle: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* AI Chat Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-all duration-200 relative ${
                    isOpen
                        ? 'bg-pink-500/10 text-pink-600 border border-pink-500/20'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
                title="AI Assistant"
            >
                {isOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <div className="relative">
                        <Bot className="w-5 h-5" />
                        {/* Online indicator */}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500 border border-background"></span>
                        </span>
                    </div>
                )}
            </motion.button>

            {/* AI Chat Widget */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed top-16 right-6 z-[60]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="w-80 md:w-[400px] glassmorphism rounded-2xl shadow-xl border border-border/50 overflow-hidden"
                        >
                            <AIAssistant isEmbedded={true} onClose={() => setIsOpen(false)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};