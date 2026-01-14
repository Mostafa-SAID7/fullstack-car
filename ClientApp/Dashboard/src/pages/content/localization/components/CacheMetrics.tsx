import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Globe, EyeOff, Flame, RefreshCw } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import type { TranslationCacheMetrics } from '../../../../services/localization';

const StatCard = ({ title, value, icon: Icon, color = 'blue' }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-xl", `bg-${color}-500/10`)}>
                <Icon className={cn("w-6 h-6", `text-${color}-500`)} />
            </div>
        </div>
        <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
        </div>
    </motion.div>
);

export const CacheMetrics: React.FC<{
    metrics: TranslationCacheMetrics;
    warmingCulture: string;
    onWarmingCultureChange: (culture: string) => void;
    onWarmCache: () => void;
    isWarming: boolean;
}> = ({ metrics, warmingCulture, onWarmingCultureChange, onWarmCache, isWarming }) => {
    return (
        <div className="overflow-hidden space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Overall Hit Rate"
                    value={`${metrics.overallCacheHitRate.toFixed(1)}%`}
                    icon={Zap}
                    color="blue"
                />
                <StatCard
                    title="Memory Cache Hits"
                    value={metrics.memoryCacheHits}
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Distributed Hits"
                    value={metrics.distributedCacheHits}
                    icon={Globe}
                    color="purple"
                />
                <StatCard
                    title="Cache Misses"
                    value={metrics.cacheMisses}
                    icon={EyeOff}
                    color="red"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Cache Warming
                    </h3>
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Target Culture</label>
                            <select
                                value={warmingCulture}
                                onChange={(e) => onWarmingCultureChange(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="en-US">English (en-US)</option>
                                <option value="ar-SA">Arabic (ar-SA)</option>
                                <option value="ar-EG">Arabic (ar-EG)</option>
                            </select>
                        </div>
                        <button
                            onClick={onWarmCache}
                            disabled={isWarming}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isWarming ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                            Warm Cache
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                        Preloads common features into the cache to improve initial request performance.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-2">Performance Info</h3>
                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Last Updated:</span>
                            <span className="font-medium">{new Date(metrics.lastUpdated).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Uptime Since:</span>
                            <span className="font-medium">{new Date(metrics.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Avg Load Time:</span>
                            <span className="font-medium text-blue-600">{metrics.averageLoadTime || '0ms'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
