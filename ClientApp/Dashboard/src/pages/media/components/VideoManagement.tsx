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
  Plus,
  CheckSquare,
  Square
} from 'lucide-react';
import { videoService } from '../../../services/media/VideoService';
import { FormattedNumber, FormattedDate, FormattedFileSize } from '../../../components/formatting/CultureAwareFormatting';
import { useCultureFormatting } from '../../../utils/cultureFormatting';
import { SearchFilters } from '../../../components/media/SearchFilters';
import { BulkOperations } from '../../../components/media/BulkOperations';
import { ContentEditor } from '../../../components/media/ContentEditor';
import { VideoPlayer } from '../../../components/media/VideoPlayer';
import type { Video as VideoType, MediaFilters } from '../../../services/media/types';

export const VideoManagement = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MediaFilters>({
    pageNumber: 1,
    pageSize: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [totalCount, setTotalCount] = useState(0);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [previewVideo, setPreviewVideo] = useState<VideoType | null>(null);

  const { isRTL } = useCultureFormatting();

  useEffect(() => {
    loadVideos();
  }, [filters]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const result = await videoService.getVideos(filters);
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

  const handleFiltersChange = (newFilters: MediaFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const toggleVideoSelection = (id: string) => {
    setSelectedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedVideos.size === videos.length) {
      setSelectedVideos(new Set());
    } else {
      setSelectedVideos(new Set(videos.map(v => v.id)));
    }
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

  const handleBulkDelete = async () => {
    try {
      await Promise.all(Array.from(selectedVideos).map(id => videoService.deleteVideo(id)));
      setSelectedVideos(new Set());
      loadVideos();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      throw error;
    }
  };

  const handleBulkArchive = async () => {
    try {
      await Promise.all(
        Array.from(selectedVideos).map(id => 
          videoService.updateVideo(id, { status: 'archived' } as any)
        )
      );
      setSelectedVideos(new Set());
      loadVideos();
    } catch (error) {
      console.error('Bulk archive failed:', error);
      throw error;
    }
  };

  const handleBulkMakePublic = async () => {
    try {
      await Promise.all(
        Array.from(selectedVideos).map(id => 
          videoService.updateVideo(id, { isPublic: true })
        )
      );
      setSelectedVideos(new Set());
      loadVideos();
    } catch (error) {
      console.error('Bulk make public failed:', error);
      throw error;
    }
  };

  const handleBulkMakePrivate = async () => {
    try {
      await Promise.all(
        Array.from(selectedVideos).map(id => 
          videoService.updateVideo(id, { isPublic: false })
        )
      );
      setSelectedVideos(new Set());
      loadVideos();
    } catch (error) {
      console.error('Bulk make private failed:', error);
      throw error;
    }
  };

  const handleBulkAddTags = async (tags: string[]) => {
    try {
      await Promise.all(
        Array.from(selectedVideos).map(id => {
          const video = videos.find(v => v.id === id);
          if (video) {
            const newTags = [...new Set([...video.tags, ...tags])];
            return videoService.updateVideo(id, { tags: newTags });
          }
          return Promise.resolve();
        })
      );
      setSelectedVideos(new Set());
      loadVideos();
    } catch (error) {
      console.error('Bulk add tags failed:', error);
      throw error;
    }
  };

  const handleSaveEdit = async (updates: Partial<VideoType>) => {
    if (!editingVideo) return;
    
    try {
      await videoService.updateVideo(editingVideo.id, updates);
      setEditingVideo(null);
      loadVideos();
    } catch (error) {
      console.error('Failed to update video:', error);
      throw error;
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
        <div className="flex items-center gap-2">
          {videos.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              {selectedVideos.size === videos.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Select All
            </button>
          )}
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Upload Video
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow ${
              selectedVideos.has(video.id) ? 'ring-2 ring-primary' : ''
            }`}
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
              <div className="absolute top-2 left-2">
                <button
                  onClick={() => toggleVideoSelection(video.id)}
                  className="bg-black/70 text-white p-1 rounded hover:bg-black/90 transition-colors"
                >
                  {selectedVideos.has(video.id) ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
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
                <button
                  onClick={() => setPreviewVideo(video)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => setEditingVideo(video)}
                  className="flex items-center justify-center p-2 border rounded hover:bg-muted transition-colors"
                >
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

      {/* Bulk Operations */}
      <BulkOperations
        selectedCount={selectedVideos.size}
        onDelete={handleBulkDelete}
        onArchive={handleBulkArchive}
        onMakePublic={handleBulkMakePublic}
        onMakePrivate={handleBulkMakePrivate}
        onAddTags={handleBulkAddTags}
        onClearSelection={() => setSelectedVideos(new Set())}
      />

      {/* Content Editor Modal */}
      {editingVideo && (
        <ContentEditor
          content={editingVideo}
          type="video"
          onSave={handleSaveEdit}
          onCancel={() => setEditingVideo(null)}
        />
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full">
            <VideoPlayer
              src={previewVideo.videoUrl}
              poster={previewVideo.thumbnailUrl}
              title={previewVideo.title}
              className="mb-4"
            />
            <button
              onClick={() => setPreviewVideo(null)}
              className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

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