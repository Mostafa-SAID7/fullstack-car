import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Heart, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { usePostAnalytics } from '../hooks';

export const PostAnalyticsComponent: React.FC = () => {
  const { analytics, loading, error } = usePostAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      label: 'Total Posts',
      value: analytics.totalPosts,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Published',
      value: analytics.publishedPosts,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Total Likes',
      value: analytics.totalLikes.toLocaleString(),
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Total Comments',
      value: analytics.totalComments.toLocaleString(),
      icon: MessageSquare,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'Avg Engagement',
      value: `${analytics.averageEngagement.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Posts */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Top Performing Posts</h3>
          <p className="text-sm text-muted-foreground">Posts with highest engagement</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {analytics.topPosts.map((post) => (
              <div key={post.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{post.title}</h4>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {post.viewsCount}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {post.likesCount}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {post.commentsCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Recent Posts</h3>
          <p className="text-sm text-muted-foreground">Latest posts in your community</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {analytics.recentPosts.map((post) => (
              <div key={post.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{post.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    By {post.userFirstName} {post.userLastName} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
