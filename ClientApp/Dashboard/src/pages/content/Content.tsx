import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, TrendingUp, FileText } from 'lucide-react';
import { ContentHeader, ContentStats, ContentList, ContentAnalytics } from './components';
import { ContentTypeSelector, ContentType, TabNavigation, TabContent } from '../../components/ui';

export const Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('posts');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'content', label: 'Content', icon: FileText },
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
      case 'content':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Content Management</h2>
                <p className="text-muted-foreground">Manage and moderate all community content types</p>
              </div>
              <ContentTypeSelector
                selectedType={selectedContentType}
                onTypeChange={setSelectedContentType}
              />
            </div>
            <ContentList contentType={selectedContentType} />
          </div>
        );
      case 'moderation':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Content Moderation</h2>
              <p className="text-muted-foreground">Review and moderate reported content</p>
            </div>
            <ContentList contentType="reports" />
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