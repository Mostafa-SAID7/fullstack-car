import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Play, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  MessageCircle, 
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { videoService } from '../../../services/media/VideoService';
import { FormattedNumber, FormattedDate, FormattedFileSize } from '../../../components/formatting/CultureAwareFormatting';
import { useCultureFormatting } from '../../../utils/cultureFormatting';
import type { Video as VideoType, MediaFilters } from '../../../services/media/types';

export const VideoManagement = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MediaFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [totalCount, setTotalCount] = useState(0);

  const { isRTL } = useCultureFormatting();

  useEffect(() => {
    loadVideos();
  }, [filters]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const result = await videoService.getVideos({
        ...filters,
        search: searchQuery || undefined
      });
      setVideos(result.items);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, pageNumber: 1 }));
    loadVideos();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoService.deleteVideo(id);
        loadVideos();
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Video Management</h2>
          <p className="text-muted-foreground">Manage and organize your video content</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Upload Video
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {formatDuration(video.duration)}
              </div>
              <div className="absolute top-2 right-2">
                <button className="bg-black/70 text-white p-1 rounded hover:bg-black/90 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{video.description}</p>
              
              {/* Stats */}
              <div className={`flex items-center gap-4 text-sm text-muted-foreground mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <FormattedNumber value={video.viewCount} compact />
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <FormattedNumber value={video.likeCount} compact />
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <FormattedNumber value={video.commentCount} compact />
                </div>
              </div>

              {/* Meta Info */}
              <div className={`flex items-center justify-between text-xs text-muted-foreground mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <FormattedDate date={video.createdAt} format="short" />
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <FormattedFileSize bytes={video.fileSize} />
                </div>
              </div>

              {/* Tags */}
              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {video.tags.length > 3 && (
                    <span className="text-muted-foreground text-xs">
                      +{video.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded text-sm hover:bg-primary/90 transition-colors">
                  <Play className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center justify-center p-2 border rounded hover:bg-muted transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="flex items-center justify-center p-2 border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalCount > filters.pageSize! && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((filters.pageNumber! - 1) * filters.pageSize!) + 1} to{' '}
            {Math.min(filters.pageNumber! * filters.pageSize!, totalCount)} of {totalCount} videos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber! - 1) }))}
              disabled={filters.pageNumber === 1}
              className="px-3 py-2 border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2">
              Page {filters.pageNumber} of {Math.ceil(totalCount / filters.pageSize!)}
            </span>
            <button
              onClick={() => setFilters(prev => ({ ...prev, pageNumber: prev.pageNumber! + 1 }))}
              disabled={filters.pageNumber! >= Math.ceil(totalCount / filters.pageSize!)}
              className="px-3 py-2 border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};