import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Mic, 
  BarChart3, 
  Upload, 
  Settings, 
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Play,
  ChevronDown
} from 'lucide-react';
import { VideoManagement } from './components/VideoManagement';
import { PodcastManagement } from './components/PodcastManagement';
import { MediaAnalytics } from './components/MediaAnalytics';
import { MediaUpload } from './components/MediaUpload';
import { mediaService } from '../../services/media/MediaService';
import type { MediaDashboardStats, MediaType } from '../../services/media/types';

export const MediaOverview = () => {
  const [dashboardStats, setDashboardStats] = useState<MediaDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<MediaType>('video');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await mediaService.getMediaDashboard();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Set default stats for demo
      setDashboardStats({
        videos: {
          total: 1234,
          published: 1100,
          draft: 134,
          totalViews: 2400000,
          totalLikes: 45000,
          totalComments: 12000
        },
        podcasts: {
          total: 567,
          published: 520,
          draft: 47,
          totalPlays: 890000,
          totalLikes: 23000,
          totalSubscribers: 15000
        },
        recentActivity: [
          {
            type: 'video',
            action: 'published',
            title: 'How to Build Modern Web Apps',
            timestamp: new Date().toISOString()
          },
          {
            type: 'podcast',
            action: 'created',
            title: 'Tech Talk Episode 15',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      });
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
          <h1 className="text-3xl font-bold">Media Overview</h1>
          <p className="text-muted-foreground">Manage your video and podcast content</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as MediaType)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="video">Videos</option>
            <option value="podcast">Podcasts</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
              <p className="text-2xl font-bold">{formatNumber(dashboardStats?.videos.total || 0)}</p>
            </div>
            <Video className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +12% from last month
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Podcasts</p>
              <p className="text-2xl font-bold">{formatNumber(dashboardStats?.podcasts.total || 0)}</p>
            </div>
            <Mic className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +8% from last month
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Views/Plays</p>
              <p className="text-2xl font-bold">
                {formatNumber((dashboardStats?.videos.totalViews || 0) + (dashboardStats?.podcasts.totalPlays || 0))}
              </p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +15% from last month
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Engagement</p>
              <p className="text-2xl font-bold">
                {formatNumber((dashboardStats?.videos.totalLikes || 0) + (dashboardStats?.podcasts.totalLikes || 0))}
              </p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            +22% from last month
          </p>
        </div>
      </div>

      {/* Content Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload New Content</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">View Analytics</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Media Settings</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardStats?.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {activity.type === 'video' ? (
                    <Video className="w-4 h-4 text-primary" />
                  ) : (
                    <Mic className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action} • {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {selectedType === 'video' ? 'Recent Videos' : 'Recent Podcasts'}
          </h3>
          <button className="text-primary hover:text-primary/80 font-medium">
            View All
          </button>
        </div>
        
        {selectedType === 'video' ? (
          <VideoManagement />
        ) : (
          <PodcastManagement />
        )}
      </div>
    </motion.div>
  );
};