import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Eye, 
  Play, 
  Heart, 
  MessageCircle, 
  Users, 
  Video,
  Mic
} from 'lucide-react';
import { ChartCard } from '../../dashboard/components/ChartCard';
import { videoService } from '../../../services/media/VideoService';
import { podcastService } from '../../../services/media/PodcastService';
import { mediaService } from '../../../services/media/MediaService';
import type { MediaAnalytics as MediaAnalyticsType } from '../../../services/media/types';

export const MediaAnalytics = () => {
  const [videoAnalytics, setVideoAnalytics] = useState<MediaAnalyticsType | null>(null);
  const [podcastAnalytics, setPodcastAnalytics] = useState<MediaAnalyticsType | null>(null);
  const [overallAnalytics, setOverallAnalytics] = useState<MediaAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const [videoData, podcastData, overallData] = await Promise.all([
        videoService.getVideoDashboard().catch(() => null),
        podcastService.getPodcastDashboard().catch(() => null),
        mediaService.getMediaAnalytics(startDate.toISOString(), endDate.toISOString()).catch(() => null)
      ]);

      setVideoAnalytics(videoData);
      setPodcastAnalytics(podcastData);
      setOverallAnalytics(overallData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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
          <h2 className="text-2xl font-bold">Media Analytics</h2>
          <p className="text-muted-foreground">Track performance and engagement metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
              <p className="text-2xl font-bold">{formatNumber(videoAnalytics?.totalVideos || 0)}</p>
            </div>
            <Video className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +12% from last period
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Podcasts</p>
              <p className="text-2xl font-bold">{formatNumber(podcastAnalytics?.totalPodcasts || 0)}</p>
            </div>
            <Mic className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +8% from last period
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views/Plays</p>
              <p className="text-2xl font-bold">
                {formatNumber((videoAnalytics?.totalViews || 0) + (podcastAnalytics?.totalPlays || 0))}
              </p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +15% from last period
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Engagement</p>
              <p className="text-2xl font-bold">
                {formatNumber((videoAnalytics?.totalLikes || 0) + (podcastAnalytics?.totalLikes || 0))}
              </p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +22% from last period
          </p>
        </div>
      </div>

      {/* Video Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Video Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total Views</span>
              </div>
              <span className="font-semibold">{formatNumber(videoAnalytics?.totalViews || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total Likes</span>
              </div>
              <span className="font-semibold">{formatNumber(videoAnalytics?.totalLikes || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total Comments</span>
              </div>
              <span className="font-semibold">{formatNumber(videoAnalytics?.totalComments || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <Mic className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">Podcast Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total Plays</span>
              </div>
              <span className="font-semibold">{formatNumber(podcastAnalytics?.totalPlays || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total Likes</span>
              </div>
              <span className="font-semibold">{formatNumber(podcastAnalytics?.totalLikes || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total Subscribers</span>
              </div>
              <span className="font-semibold">{formatNumber(podcastAnalytics?.totalSubscribers || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Views & Plays Over Time"
          description="Track content consumption trends"
        >
          <div className="text-center text-muted-foreground">
            Chart visualization would go here
          </div>
        </ChartCard>

        <ChartCard
          title="Engagement Metrics"
          description="Likes, comments, and interactions"
        >
          <div className="text-center text-muted-foreground">
            Chart visualization would go here
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {(overallAnalytics?.recentActivity || []).slice(0, 5).map((activity: any, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                {activity.type === 'video' ? (
                  <Video className="w-4 h-4 text-primary" />
                ) : (
                  <Mic className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.action} • {new Date(activity.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};