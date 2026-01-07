import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Share2, 
  Target,
  BarChart3,
  Calendar,
  MessageSquare,
  Eye
} from 'lucide-react';
import { TabNavigation, TabContent } from '../../components/layout/tabs/TabNavigation';
import { StatsCards } from '../../components/shared/StatsCards';
import { useMarketingStats } from '../../hooks/marketing/useMarketingStats';
import { useCampaigns } from '../../hooks/marketing/useCampaigns';
import { MarketingService } from '../../services/marketing/MarketingService';

export const MarketingOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats, loading: statsLoading } = useMarketingStats();
  const { campaigns, loading: campaignsLoading } = useCampaigns({ pageSize: 3, sortBy: 'createdAt', sortDirection: 'desc' });
  const [socialPerformance, setSocialPerformance] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchSocialPerformance = async () => {
      const marketingService = new MarketingService();
      const result = await marketingService.getSocialMediaPerformance();
      if (result.succeeded && result.data) {
        setSocialPerformance(result.data);
      }
    };
    
    fetchSocialPerformance();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Target className="w-4 h-4" /> },
    { id: 'social', label: 'Social Media', icon: <Share2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const marketingStats = stats ? [
    {
      label: 'Total Reach',
      value: stats.totalReach.value,
      change: stats.totalReach.change,
      changeType: stats.totalReach.changeType,
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      label: 'Engagement Rate',
      value: stats.engagementRate.value,
      change: stats.engagementRate.change,
      changeType: stats.engagementRate.changeType,
      icon: MessageSquare,
      color: 'text-green-500'
    },
    {
      label: 'Active Campaigns',
      value: stats.activeCampaigns.value,
      change: stats.activeCampaigns.change,
      changeType: stats.activeCampaigns.changeType,
      icon: Target,
      color: 'text-purple-500'
    },
    {
      label: 'New Followers',
      value: stats.newFollowers.value,
      change: stats.newFollowers.change,
      changeType: stats.newFollowers.changeType,
      icon: Users,
      color: 'text-orange-500'
    }
  ] : [];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <StatsCards stats={marketingStats} />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="font-bold text-lg mb-4">Recent Campaigns</h3>
                {campaignsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-3 bg-muted/30 rounded-lg animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {campaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Reach: {campaign.reach.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 3 ? 'bg-green-100 text-green-700' : // Active
                          campaign.status === 2 ? 'bg-blue-100 text-blue-700' :   // Scheduled
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {campaign.statusName}
                        </span>
                      </div>
                    ))}
                    {campaigns.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No campaigns found. Create your first campaign to get started.
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="font-bold text-lg mb-4">Social Media Performance</h3>
                <div className="space-y-4">
                  {socialPerformance.length > 0 ? (
                    socialPerformance.map((social, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${social.color}-500`} />
                          <span className="font-medium">{social.platform}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{social.followers}</p>
                          <p className="text-sm text-muted-foreground">{social.engagement} engagement</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No social media data available. Connect your social platforms to see performance metrics.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Content for {activeTab} tab coming soon...</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Manage your marketing campaigns and social media presence</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </motion.div>
  );
};

export default MarketingOverview;