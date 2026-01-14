import React from 'react';
import { Plus, BarChart, RefreshCw, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../../lib/utils';

export const LocalizationHeader: React.FC<{
    showMetrics: boolean;
    setShowMetrics: (show: boolean) => void;
    onRefreshCache: () => void;
    onAddTranslation: () => void;
    onExport: () => void;
    onImport: () => void;
}> = ({ showMetrics, setShowMetrics, onRefreshCache, onAddTranslation, onExport, onImport }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
        >
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Localization Management
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage translations and localization across all supported languages
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setShowMetrics(!showMetrics)}
                    className={cn(
                        "px-4 py-2 border border-border rounded-lg transition-colors flex items-center gap-2",
                        showMetrics ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                    title="Toggle Cache Metrics"
                >
                    <BarChart className="w-4 h-4" />
                    {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
                </button>
                <button
                    onClick={onRefreshCache}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                    title="Refresh Translation Cache"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Cache
                </button>
                <button
                    onClick={onAddTranslation}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Translation
                </button>
                <div className="h-8 w-px bg-border mx-1"></div>
                <button
                    onClick={onExport}
                    className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    title="Export Translations"
                >
                    <Download className="w-4 h-4" />
                </button>
                <button
                    onClick={onImport}
                    className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    title="Import Translations"
                >
                    <Upload className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};
