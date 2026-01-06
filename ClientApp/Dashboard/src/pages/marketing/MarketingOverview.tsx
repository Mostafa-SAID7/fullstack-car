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

export const MarketingOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Target className="w-4 h-4" /> },
    { id: 'social', label: 'Social Media', icon: <Share2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const marketingStats = [
    {
      label: 'Total Reach',
      value: '125.4K',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      label: 'Engagement Rate',
      value: '4.8%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      color: 'text-green-500'
    },
    {
      label: 'Active Campaigns',
      value: '8',
      change: '+2',
      changeType: 'positive' as const,
      icon: Target,
      color: 'text-purple-500'
    },
    {
      label: 'New Followers',
      value: '2.3K',
      change: '+18.2%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-orange-500'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StatsCards stats={marketingStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="font-bold text-lg mb-4">Recent Campaigns</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Summer Car Care', status: 'Active', reach: '45.2K' },
                    { name: 'Electric Vehicle Promo', status: 'Scheduled', reach: '32.1K' },
                    { name: 'Maintenance Tips', status: 'Completed', reach: '28.7K' }
                  ].map((campaign, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">Reach: {campaign.reach}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'Active' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="font-bold text-lg mb-4">Social Media Performance</h3>
                <div className="space-y-4">
                  {[
                    { platform: 'Facebook', followers: '12.5K', engagement: '5.2%', color: 'blue' },
                    { platform: 'Instagram', followers: '8.9K', engagement: '7.1%', color: 'pink' },
                    { platform: 'Twitter', followers: '6.2K', engagement: '3.8%', color: 'sky' },
                    { platform: 'LinkedIn', followers: '4.1K', engagement: '4.5%', color: 'indigo' }
                  ].map((social, i) => (
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
                  ))}
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