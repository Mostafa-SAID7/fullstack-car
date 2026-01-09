import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Play, 
  Edit, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Users
} from 'lucide-react';
import { podcastService } from '../../../services/media/PodcastService';
import type { Podcast, MediaFilters } from '../../../services/media/types';

export const PodcastManagement = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MediaFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadPodcasts();
  }, [filters]);

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      const result = await podcastService.getPodcasts({
        ...filters,
        search: searchQuery || undefined
      });
      setPodcasts(result.items);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to load podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, pageNumber: 1 }));
    loadPodcasts();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this podcast?')) {
      try {
        await podcastService.deletePodcast(id);
        loadPodcasts();
      } catch (error) {
        console.error('Failed to delete podcast:', error);
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
          <h2 className="text-2xl font-bold">Podcast Management</h2>
          <p className="text-muted-foreground">Manage and organize your podcast content</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Upload Podcast
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

      {/* Podcasts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts.map((podcast) => (
          <motion.div
            key={podcast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted">
              {podcast.thumbnailUrl ? (
                <img
                  src={podcast.thumbnailUrl}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Mic className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {formatDuration(podcast.duration)}
              </div>
              <div className="absolute top-2 right-2">
                <button className="bg-black/70 text-white p-1 rounded hover:bg-black/90 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              {podcast.episodeNumber && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                  Ep. {podcast.episodeNumber}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{podcast.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{podcast.description}</p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  {podcast.playCount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {podcast.likeCount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {podcast.commentCount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {podcast.subscriptionCount.toLocaleString()}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(podcast.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatFileSize(podcast.fileSize)}
                </div>
              </div>

              {/* Series Info */}
              {(podcast.seasonNumber || podcast.seriesId) && (
                <div className="text-xs text-muted-foreground mb-3">
                  {podcast.seasonNumber && `Season ${podcast.seasonNumber}`}
                  {podcast.seriesId && ` • Series`}
                </div>
              )}

              {/* Tags */}
              {podcast.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {podcast.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {podcast.tags.length > 3 && (
                    <span className="text-muted-foreground text-xs">
                      +{podcast.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Features */}
              <div className="flex items-center gap-2 mb-3 text-xs">
                {podcast.allowDownload && (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
                    <Download className="w-3 h-3" />
                    Downloadable
                  </span>
                )}
                {podcast.transcript && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Transcript
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded text-sm hover:bg-primary/90 transition-colors">
                  <Play className="w-4 h-4" />
                  Play
                </button>
                <button className="flex items-center justify-center p-2 border rounded hover:bg-muted transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(podcast.id)}
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
            {Math.min(filters.pageNumber! * filters.pageSize!, totalCount)} of {totalCount} podcasts
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