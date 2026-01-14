import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, LineChart as LineChartIcon, ArrowUpRight, ArrowDownRight, Loader2, AlertCircle } from 'lucide-react';
import { useMarketingAnalytics } from '../../../../hooks/marketing/useMarketingAnalytics';

export const AnalyticsDashboard: React.FC = () => {
    const { overview, performance, loading, error } = useMarketingAnalytics();

    if (loading && !overview) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-700 mb-2">Error Loading Analytics</h3>
                <p className="text-red-600 mb-4">{error}</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Analytics</h1>
                    <p className="text-muted-foreground">Deep dive into your marketing performance metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg. Engagement', value: `${(overview?.averageEngagementRate || 0 * 100).toFixed(1)}%`, icon: TrendingUp },
                    { label: 'Conversion Rate', value: '2.4%', icon: PieChart }, // Mock for now if not in overview
                    { label: 'Total Reach', value: overview?.totalReach.toLocaleString() || '0', icon: BarChart3 },
                    { label: 'Total Impressions', value: overview?.totalImpressions.toLocaleString() || '0', icon: LineChartIcon },
                ].map((item, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium text-muted-foreground">{item.label}</h3>
                        </div>
                        <p className="text-3xl font-bold">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground italic">Performance Over Time Chart Placeholder</p>
                    {/* Real chart would go here using performance data */}
                </div>
                <div className="bg-card border border-border rounded-xl p-6 h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground italic">Platform Distribution Chart Placeholder</p>
                    {/* Real chart would go here using platform data */}
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsDashboard;
