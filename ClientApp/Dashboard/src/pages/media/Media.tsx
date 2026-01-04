import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Upload, Filter, FolderOpen } from 'lucide-react';
import { MediaHeader } from './components/MediaHeader';
import { MediaGrid } from './components/MediaGrid';
import { MediaList } from './components/MediaList';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';

// Mock data - replace with real data from API
const mockMediaFiles = [
  {
    id: '1',
    name: 'hero-image.jpg',
    type: 'image' as const,
    size: 2457600,
    url: '/media/hero-image.jpg',
    thumbnail: 'https://picsum.photos/200/200?random=1',
    uploadedAt: '2024-01-15T10:30:00Z',
    dimensions: { width: 1920, height: 1080 }
  },
  {
    id: '2',
    name: 'product-showcase.png',
    type: 'image' as const,
    size: 1843200,
    url: '/media/product-showcase.png',
    thumbnail: 'https://picsum.photos/200/200?random=2',
    uploadedAt: '2024-01-14T14:20:00Z',
    dimensions: { width: 1200, height: 800 }
  },
  {
    id: '3',
    name: 'tutorial-video.mp4',
    type: 'video' as const,
    size: 52428800,
    url: '/media/tutorial-video.mp4',
    thumbnail: 'https://picsum.photos/200/200?random=3',
    uploadedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    name: 'user-manual.pdf',
    type: 'document' as const,
    size: 1048576,
    url: '/media/user-manual.pdf',
    uploadedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    name: 'logo-design.svg',
    type: 'other' as const,
    size: 51200,
    url: '/media/logo-design.svg',
    uploadedAt: '2024-01-11T11:30:00Z'
  },
  {
    id: '6',
    name: 'marketing-banner.jpg',
    type: 'image' as const,
    size: 1536000,
    url: '/media/marketing-banner.jpg',
    thumbnail: 'https://picsum.photos/200/200?random=4',
    uploadedAt: '2024-01-10T13:20:00Z',
    dimensions: { width: 1200, height: 600 }
  }
];

export const Media = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedFiles, setSelectedFiles] = useState<string[]>([]); // Not currently used

  const tabs = [
    { id: 'library', label: 'Library', icon: FolderOpen },
    { id: 'uploads', label: 'Recent Uploads', icon: Upload },
    { id: 'favorites', label: 'Favorites', icon: BarChart3 },
    { id: 'trash', label: 'Trash', icon: Filter }
  ];

  const filteredFiles = mockMediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (file: any) => {
    // Handle file preview/download
    console.log('File clicked:', file);
  };

  const handleDelete = (fileId: string) => {
    // Handle file deletion
    console.log('Delete file:', fileId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'library':
        return (
          <div className="space-y-6">
            {viewMode === 'grid' ? (
              <MediaGrid
                files={filteredFiles}
                onFileClick={handleFileClick}
                onDelete={handleDelete}
              />
            ) : (
              <MediaList
                files={filteredFiles}
                onFileClick={handleFileClick}
                onDelete={handleDelete}
              />
            )}
          </div>
        );
      case 'uploads':
        return (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Recent Uploads</h3>
            <p className="text-muted-foreground">Your recently uploaded files will appear here.</p>
          </div>
        );
      case 'favorites':
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Favorite Files</h3>
            <p className="text-muted-foreground">Star your favorite files to access them quickly here.</p>
          </div>
        );
      case 'trash':
        return (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Recently Deleted</h3>
            <p className="text-muted-foreground">Files in trash will be automatically deleted after 30 days.</p>
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
      <MediaHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

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

