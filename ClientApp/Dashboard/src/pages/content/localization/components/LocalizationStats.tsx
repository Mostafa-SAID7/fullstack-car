import React from 'react';
import { motion } from 'framer-motion';
import { Languages, CheckCircle, Globe, FileText } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export interface TranslationStatsDto {
    totalTranslations: number;
    activeTranslations: number;
    totalLanguages: number;
    totalCategories: number;
}

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
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
            {trend && (
                <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    trend === 'up' ? 'bg-green-100 text-green-700' :
                        trend === 'down' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                )}>
                    {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                </div>
            )}
        </div>
        <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
        </div>
    </motion.div>
);

export const LocalizationStats: React.FC<{ stats: TranslationStatsDto | null }> = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Translations"
                value={stats.totalTranslations}
                icon={Languages}
                color="blue"
            />
            <StatCard
                title="Active Translations"
                value={stats.activeTranslations}
                icon={CheckCircle}
                color="green"
            />
            <StatCard
                title="Languages Supported"
                value={stats.totalLanguages}
                icon={Globe}
                color="purple"
            />
            <StatCard
                title="Categories"
                value={stats.totalCategories}
                icon={FileText}
                color="orange"
            />
        </div>
    );
};
