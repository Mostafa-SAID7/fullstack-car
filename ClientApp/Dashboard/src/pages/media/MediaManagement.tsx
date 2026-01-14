import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Video, Mic, BarChart3, Upload, Settings, Users, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select/Select';
import { TabNavigation, TabContent } from '../../components/shared/TabNavigation';
import { VideoManagement } from './components/VideoManagement';
import { PodcastManagement } from './components/PodcastManagement';
import { MediaAnalytics } from './components/MediaAnalytics';
import { MediaUpload } from './components/MediaUpload';

export const MediaManagement = () => {
  const { t } = useTranslation(['media', 'common']);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMediaType, setSelectedMediaType] = useState<'video' | 'podcast'>('video');

  const tabs = [
    { id: 'overview', label: t('tabs.overview'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'content', label: t('tabs.content'), icon: <Video className="w-4 h-4" /> },
    { id: 'upload', label: t('tabs.upload'), icon: <Upload className="w-4 h-4" /> },
    { id: 'analytics', label: t('tabs.analytics'), icon: <Eye className="w-4 h-4" /> },
    { id: 'settings', label: t('tabs.settings'), icon: <Settings className="w-4 h-4" /> }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('management.totalVideos')}</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <Video className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">+12% {t('management.fromLastMonth')}</p>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('management.totalPodcasts')}</p>
            <p className="text-2xl font-bold">567</p>
          </div>
          <Mic className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">+8% {t('management.fromLastMonth')}</p>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('management.totalViews')}</p>
            <p className="text-2xl font-bold">2.4M</p>
          </div>
          <Eye className="h-8 w-8 text-purple-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">+15% {t('management.fromLastMonth')}</p>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('management.activeUsers')}</p>
            <p className="text-2xl font-bold">89.2K</p>
          </div>
          <Users className="h-8 w-8 text-orange-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">+5% {t('management.fromLastMonth')}</p>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('management.contentTitle')}</h2>
        <Select value={selectedMediaType} onValueChange={(value: string) => setSelectedMediaType(value as 'video' | 'podcast')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('management.selectType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                {t('management.videos')}
              </div>
            </SelectItem>
            <SelectItem value="podcast">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                {t('management.podcasts')}
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
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('management.settingsTitle')}</h3>
            <p className="text-muted-foreground">{t('management.settingsDesc')}</p>
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
          <h1 className="text-3xl font-bold">{t('management.title')}</h1>
          <p className="text-muted-foreground">{t('management.subtitle')}</p>
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