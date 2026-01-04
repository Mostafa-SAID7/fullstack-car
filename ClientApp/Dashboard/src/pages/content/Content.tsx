import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText, ShieldCheck, TrendingUp } from 'lucide-react';
import { ContentHeader } from './components/ContentHeader';
import { ContentStats } from './components/ContentStats';
import { ContentSections } from './components/ContentSections';
import { ContentAnalytics } from './components/ContentAnalytics';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';

export const Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'moderation', label: 'Moderation', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ContentStats />
          </div>
        );
      case 'posts':
        return <ContentSections />;
      case 'moderation':
        return (
          <div className="text-center py-12">
            <ShieldCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Content Moderation</h3>
            <p className="text-muted-foreground">Advanced content moderation and review tools coming soon.</p>
          </div>
        );
      case 'analytics':
        return <ContentAnalytics />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <ContentHeader />

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