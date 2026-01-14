import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    Plus,
    Play,
    Pause,
    Edit,
    Trash2,
    Eye,
    Users,
    DollarSign,
    TrendingUp,
    Calendar,
    Filter,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useCampaigns } from '../../../../hooks/marketing/useCampaigns';
import { CampaignStatus } from '../../../../services/marketing/types';

export const CampaignsManagement: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const { campaigns, loading, error, deleteCampaign } = useCampaigns({
        status: filter !== 'all' ? filter : undefined
    });

    const getStatusColor = (status: number) => {
        switch (status) {
            case CampaignStatus.Active: return 'bg-green-100 text-green-700';
            case CampaignStatus.Scheduled: return 'bg-blue-100 text-blue-700';
            case CampaignStatus.Completed: return 'bg-gray-100 text-gray-700';
            case CampaignStatus.Paused: return 'bg-yellow-100 text-yellow-700';
            case CampaignStatus.Draft: return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            await deleteCampaign(id);
        }
    };

    if (loading && campaigns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading campaigns...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-700 mb-2">Error Loading Campaigns</h3>
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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Campaigns</h1>
                    <p className="text-muted-foreground">Create and manage your marketing campaigns</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create Campaign
                </button>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Campaigns', value: campaigns.length.toString(), icon: Target, color: 'blue' },
                    { label: 'Active Campaigns', value: campaigns.filter(c => c.status === CampaignStatus.Active).length.toString(), icon: Play, color: 'green' },
                    { label: 'Total Reach', value: campaigns.reduce((acc, c) => acc + c.reach, 0).toLocaleString(), icon: Eye, color: 'purple' },
                    { label: 'Total Clicks', value: campaigns.reduce((acc, c) => acc + (c.clicks || 0), 0).toLocaleString(), icon: TrendingUp, color: 'orange' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                                {/* @ts-ignore */}
                                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filter:</span>
                </div>
                <div className="flex gap-2">
                    {['all', 'Active', 'Scheduled', 'Paused', 'Completed', 'Draft'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status === 'all' ? 'all' : status)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${(status === 'all' && filter === 'all') || filter === status
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
                {campaigns.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
                        <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No campaigns found matching the filter</p>
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg">{campaign.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                            {campaign.statusName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(campaign.startDate).toLocaleDateString()}
                                            {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                                        </span>
                                        <span>Platforms: {campaign.platforms.map(p => p.platformName).join(', ')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(campaign.id)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 border-t border-border pt-4 mt-4">
                                <div className="text-center border-r border-border last:border-0">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Budget</span>
                                    </div>
                                    <p className="font-bold">${campaign.budget.toLocaleString()}</p>
                                </div>
                                <div className="text-center border-r border-border last:border-0">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Reach</span>
                                    </div>
                                    <p className="font-bold">{campaign.reach.toLocaleString()}</p>
                                </div>
                                <div className="text-center border-r border-border last:border-0">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Clicks</span>
                                    </div>
                                    <p className="font-bold">{campaign.clicks.toLocaleString()}</p>
                                </div>
                                <div className="text-center border-r border-border last:border-0">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Engagement</span>
                                    </div>
                                    <p className="font-bold">{campaign.engagement.toLocaleString()}</p>
                                </div>
                                <div className="text-center border-r border-border last:border-0">
                                    <span className="text-sm font-medium block mb-1">CTR</span>
                                    <p className="font-bold">{(campaign.clickThroughRate * 100).toFixed(2)}%</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-medium block mb-1">Engagement Rate</span>
                                    <p className="font-bold">{(campaign.engagementRate * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default CampaignsManagement;
