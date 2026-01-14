import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Facebook, Instagram, Twitter, Linkedin, MessageCircle, Heart, Repeat, Loader2, AlertCircle } from 'lucide-react';
import { useSocialPlatforms } from '../../../../hooks/marketing/useSocialPlatforms';

export const SocialMediaManagement: React.FC = () => {
    const { platforms, loading, error } = useSocialPlatforms();

    const getPlatformIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'facebook': return Facebook;
            case 'instagram': return Instagram;
            case 'twitter': return Twitter;
            case 'linkedin': return Linkedin;
            default: return Share2;
        }
    };

    const getPlatformColor = (name: string) => {
        switch (name.toLowerCase()) {
            case 'facebook': return 'blue';
            case 'instagram': return 'pink';
            case 'twitter': return 'sky';
            case 'linkedin': return 'indigo';
            default: return 'gray';
        }
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    if (loading && platforms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading social platforms...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-700 mb-2">Error Loading Social Media</h3>
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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Social Media</h1>
                    <p className="text-muted-foreground">Manage your social presence and engagement</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platforms.map((platform, i) => {
                    const Icon = getPlatformIcon(platform.name);
                    const color = getPlatformColor(platform.name);
                    return (
                        <div key={platform.id} className="bg-card border border-border rounded-xl p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-xl bg-${color}-500/10`}>
                                    <Icon className={`w-6 h-6 text-${color}-500`} />
                                </div>
                                <div>
                                    <h3 className="font-bold">{platform.displayName || platform.name}</h3>
                                    <p className="text-sm text-muted-foreground">{formatNumber(platform.totalFollowers)} followers</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Engagement Rate</span>
                                <span className="font-medium text-green-500">{platform.averageEngagementRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    );
                })}

                {platforms.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
                        <Share2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No social platforms connected</p>
                    </div>
                )}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Platform Overview</h3>
                <div className="space-y-4">
                    <p className="text-muted-foreground italic">Detailed platform performance metrics would go here.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default SocialMediaManagement;
