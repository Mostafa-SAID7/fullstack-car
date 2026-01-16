import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Eye, Heart, Share2, MessageCircle } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { ArticleCategory, ArticleStatus } from '@/types/community/article';

export const ArticleAnalyticsComponent: React.FC = () => {
  const { articles, loading } = useArticles({ pageNumber: 1, pageSize: 100 });

  if (loading || !articles) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalViews = articles.items.reduce((sum, a) => sum + a.viewsCount, 0);
  const totalLikes = articles.items.reduce((sum, a) => sum + a.likesCount, 0);
  const totalShares = articles.items.reduce((sum, a) => sum + a.sharesCount, 0);
  const totalComments = articles.items.reduce((sum, a) => sum + a.commentsCount, 0);
  const publishedArticles = articles.items.filter(a => a.status === ArticleStatus.Published).length;
  const featuredArticles = articles.items.filter(a => a.status === ArticleStatus.Featured).length;

  const getCategoryName = (category: ArticleCategory): string => {
    switch (category) {
      case ArticleCategory.Industry: return 'Industry';
      case ArticleCategory.Technology: return 'Technology';
      case ArticleCategory.Reviews: return 'Reviews';
      case ArticleCategory.Events: return 'Events';
      case ArticleCategory.Tips: return 'Tips';
      case ArticleCategory.Maintenance: return 'Maintenance';
      case ArticleCategory.Lifestyle: return 'Lifestyle';
      case ArticleCategory.Racing: return 'Racing';
      default: return 'Unknown';
    }
  };

  // Category distribution
  const categoryDistribution = [
    { category: ArticleCategory.Industry, name: 'Industry', count: articles.items.filter(a => a.category === ArticleCategory.Industry).length },
    { category: ArticleCategory.Technology, name: 'Technology', count: articles.items.filter(a => a.category === ArticleCategory.Technology).length },
    { category: ArticleCategory.Reviews, name: 'Reviews', count: articles.items.filter(a => a.category === ArticleCategory.Reviews).length },
    { category: ArticleCategory.Events, name: 'Events', count: articles.items.filter(a => a.category === ArticleCategory.Events).length },
    { category: ArticleCategory.Tips, name: 'Tips', count: articles.items.filter(a => a.category === ArticleCategory.Tips).length },
    { category: ArticleCategory.Maintenance, name: 'Maintenance', count: articles.items.filter(a => a.category === ArticleCategory.Maintenance).length },
    { category: ArticleCategory.Lifestyle, name: 'Lifestyle', count: articles.items.filter(a => a.category === ArticleCategory.Lifestyle).length },
    { category: ArticleCategory.Racing, name: 'Racing', count: articles.items.filter(a => a.category === ArticleCategory.Racing).length }
  ].filter(c => c.count > 0);

  const stats = [
    {
      label: 'Total Articles',
      value: articles.totalCount,
      icon: Newspaper,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Total Likes',
      value: totalLikes.toLocaleString(),
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Total Shares',
      value: totalShares.toLocaleString(),
      icon: Share2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Category Distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Category Distribution</h3>
          <p className="text-sm text-muted-foreground">Breakdown by article category</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {categoryDistribution.map(({ name, count }) => {
              const percentage = articles.items.length > 0 
                ? ((count / articles.items.length) * 100).toFixed(0)
                : 0;
              return (
                <div key={name} className="flex items-center space-x-4">
                  <div className="w-32">
                    <span className="text-sm font-medium text-foreground">{name}</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground w-24 text-right">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Most Viewed Articles */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Most Viewed Articles</h3>
          <p className="text-sm text-muted-foreground">Top articles by view count</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {articles.items
              .sort((a, b) => b.viewsCount - a.viewsCount)
              .slice(0, 10)
              .map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryName(article.category)} • By {article.authorFirstName} {article.authorLastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-foreground">{article.viewsCount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Most Engaged Articles */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Most Engaged Articles</h3>
          <p className="text-sm text-muted-foreground">Articles with highest engagement</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {articles.items
              .sort((a, b) => (b.likesCount + b.sharesCount + b.commentsCount) - (a.likesCount + a.sharesCount + a.commentsCount))
              .slice(0, 10)
              .map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        By {article.authorFirstName} {article.authorLastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{article.likesCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="w-3 h-3" />
                      <span>{article.sharesCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{article.commentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Recent Articles</h3>
          <p className="text-sm text-muted-foreground">Latest published articles</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {articles.items
              .filter(a => a.publishedAt)
              .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
              .slice(0, 10)
              .map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(article.publishedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-foreground">{article.viewsCount}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
