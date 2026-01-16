import { useState, useEffect } from 'react';
import { TrendingUp, Play, Mic, Eye, Heart, Clock } from 'lucide-react';
import { videoService } from '../../services/media/VideoService';
import { podcastService } from '../../services/media/PodcastService';
import type { Video, Podcast } from '../../services/media/types';

interface TrendingContentProps {
  type: 'video' | 'podcast';
  count?: number;
  days?: number;
  onItemClick?: (id: string) => void;
}

export const TrendingContent = ({
  type,
  count = 10,
  days = 7,
  onItemClick
}: TrendingContentProps) => {
  const [items, setItems] = useState<(Video | Podcast)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrending();
  }, [type, count, days]);

  const loadTrending = async () => {
    try {
      setLoading(true);
      const result = type === 'video'
        ? await videoService.getTrendingVideos(count, days)
        : await podcastService.getTrendingPodcasts(count, days);
      setItems(result);
    } catch (error) {
      console.error('Failed to load trending content:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No trending {type}s found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">
          Trending {type === 'video' ? 'Videos' : 'Podcasts'}
        </h3>
        <span className="text-sm text-muted-foreground">
          (Last {days} days)
        </span>
      </div>

      {/* Trending List */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-muted">
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  {type === 'video' ? (
                    <Play className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <Mic className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(item.duration)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium line-clamp-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.description}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatCount('viewCount' in item ? item.viewCount : item.playCount)}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {formatCount(item.likeCount)}
                </div>
              </div>
            </div>

            {/* Trending Indicator */}
            <div className="flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
