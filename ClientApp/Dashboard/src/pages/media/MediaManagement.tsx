import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, BarChart3, Upload, Settings, Users, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select/Select';
import { TabNavigation, TabContent } from '../../components/shared/TabNavigation';
import { VideoManagement } from './components/VideoManagement';
import { PodcastManagement } from './components/PodcastManagement';
import { MediaAnalytics } from './components/MediaAnalytics';
import { MediaUpload } from './components/MediaUpload';

export const MediaManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMediaType, setSelectedMediaType] = useState<'video' | 'podcast'>('video');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'content', label: 'Content Management', icon: <Video className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload Media', icon: <Upload className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Eye className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <Video className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Podcasts</p>
            <p className="text-2xl font-bold">567</p>
          </div>
          <Mic className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">+8% from last month</p>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold">2.4M</p>
          </div>
          <Eye className="h-8 w-8 text-purple-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">+15% from last month</p>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Users</p>
            <p className="text-2xl font-bold">89.2K</p>
          </div>
          <Users className="h-8 w-8 text-orange-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">+5% from last month</p>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Select value={selectedMediaType} onValueChange={(value: 'video' | 'podcast') => setSelectedMediaType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
              </div>
            </SelectItem>
            <SelectItem value="podcast">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Podcasts
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedMediaType === 'video' ? <VideoManagement /> : <PodcastManagement />}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'content':
        return renderContentManagement();
      case 'upload':
        return <MediaUpload />;
      case 'analytics':
        return <MediaAnalytics />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Media Settings</h3>
            <p className="text-muted-foreground">Configure media upload limits, quality settings, and more.</p>
          </div>
        );
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Management</h1>
          <p className="text-muted-foreground">Manage videos, podcasts, and media content</p>
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