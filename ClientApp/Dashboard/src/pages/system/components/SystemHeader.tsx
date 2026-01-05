import React from 'react';
import { RefreshCw, Server } from 'lucide-react';
import { Button } from '../../../components/forms/buttons/Button';

interface SystemHeaderProps {
    onRefresh: () => void;
}

import { motion } from 'framer-motion';

export const SystemHeader: React.FC<SystemHeaderProps> = ({ onRefresh }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8 shadow-lg">
            {/* Background decoration */}

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl">
                        <Server className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-1">
                            System Status
                        </h1>
                        <div className="w-20 h-1 md:w-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-3" />
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                            Monitor server performance, services, and system health in real-time
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm text-muted-foreground font-medium">All Systems Operational</span>
                        </div>
                    </div>
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button variant="outline" onClick={onRefresh} className="gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-card border-border/50 hover:bg-muted/50 transition-all duration-200 text-sm md:text-base">
                        <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Refresh Data</span>
                        <RefreshCw className="w-4 h-4 sm:hidden" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};
