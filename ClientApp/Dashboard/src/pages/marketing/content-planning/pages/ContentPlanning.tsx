import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Filter, Layout, FileText, Image as ImageIcon, Video, Loader2, AlertCircle, List } from 'lucide-react';
import { useCampaigns } from '../../../../hooks/marketing/useCampaigns';

export const ContentPlanning: React.FC = () => {
    const { campaigns, loading, error } = useCampaigns({ pageSize: 3, sortBy: 'createdAt', sortDirection: 'desc' });

    if (loading && campaigns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading content plan...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-700 mb-2">Error Loading Content Plan</h3>
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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Content Planning</h1>
                    <p className="text-muted-foreground">Visualize and schedule your upcoming content</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Content
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Calendar Placeholder */}
                    <div className="bg-card border border-border rounded-xl p-6 h-[500px] flex flex-col items-center justify-center text-center">
                        <Calendar className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium">Content Calendar View</h3>
                        <p className="text-muted-foreground">A full calendar view will be implemented here.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Recent & Upcoming Content */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Upcoming Posts
                        </h3>
                        <div className="space-y-4">
                            {campaigns.slice(0, 3).map((campaign, i) => (
                                <div key={i} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <h4 className="font-medium text-sm">{campaign.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Performance: {(campaign.engagementRate * 100).toFixed(1)}% ER
                                    </p>
                                </div>
                            ))}
                            {campaigns.length === 0 && !loading && (
                                <p className="text-sm text-muted-foreground italic text-center py-4">No upcoming content scheduled</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <List className="w-5 h-5 text-primary" />
                            Content Backlog
                        </h3>
                        <div className="space-y-3">
                            {['EV Battery Maintenance', 'Winter Driving Guide', 'New Model Review', 'Customer Spotlight'].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-muted rounded transition-colors cursor-pointer border border-transparent hover:border-border/50">
                                    <span className="text-sm">{item}</span>
                                    <Layout className="w-3 h-3 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContentPlanning;
