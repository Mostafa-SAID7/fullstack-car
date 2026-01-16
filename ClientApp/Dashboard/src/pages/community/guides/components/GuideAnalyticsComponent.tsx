import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Eye, Bookmark } from 'lucide-react';
import { useGuides } from '../hooks/useGuides';
import { GuideCategory, GuideDifficulty } from '@/types/community/guide';

export const GuideAnalyticsComponent: React.FC = () => {
  const { guides, loading } = useGuides({ pageNumber: 1, pageSize: 100 });

  if (loading || !guides) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalViews = guides.items.reduce((sum, g) => sum + g.viewsCount, 0);
  const totalBookmarks = guides.items.reduce((sum, g) => sum + g.bookmarksCount, 0);
  const totalRatings = guides.items.reduce((sum, g) => sum + g.ratingsCount, 0);
  const avgRating = guides.items.length > 0 
    ? (guides.items.reduce((sum, g) => sum + g.rating, 0) / guides.items.length).toFixed(1)
    : 0;

  const getCategoryName = (category: GuideCategory): string => {
    switch (category) {
      case GuideCategory.Maintenance: return 'Maintenance';
      case GuideCategory.Repair: return 'Repair';
      case GuideCategory.Modification: return 'Modification';
      case GuideCategory.Cleaning: return 'Cleaning';
      case GuideCategory.Inspection: return 'Inspection';
      case GuideCategory.Installation: return 'Installation';
      case GuideCategory.Troubleshooting: return 'Troubleshooting';
      default: return 'Unknown';
    }
  };

  const getDifficultyName = (difficulty: GuideDifficulty): string => {
    switch (difficulty) {
      case GuideDifficulty.Beginner: return 'Beginner';
      case GuideDifficulty.Intermediate: return 'Intermediate';
      case GuideDifficulty.Advanced: return 'Advanced';
      case GuideDifficulty.Expert: return 'Expert';
      default: return 'Unknown';
    }
  };

  // Category distribution
  const categoryDistribution = [
    { category: GuideCategory.Maintenance, name: 'Maintenance', count: guides.items.filter(g => g.category === GuideCategory.Maintenance).length },
    { category: GuideCategory.Repair, name: 'Repair', count: guides.items.filter(g => g.category === GuideCategory.Repair).length },
    { category: GuideCategory.Modification, name: 'Modification', count: guides.items.filter(g => g.category === GuideCategory.Modification).length },
    { category: GuideCategory.Cleaning, name: 'Cleaning', count: guides.items.filter(g => g.category === GuideCategory.Cleaning).length },
    { category: GuideCategory.Inspection, name: 'Inspection', count: guides.items.filter(g => g.category === GuideCategory.Inspection).length },
    { category: GuideCategory.Installation, name: 'Installation', count: guides.items.filter(g => g.category === GuideCategory.Installation).length },
    { category: GuideCategory.Troubleshooting, name: 'Troubleshooting', count: guides.items.filter(g => g.category === GuideCategory.Troubleshooting).length }
  ].filter(c => c.count > 0);

  // Difficulty distribution
  const difficultyDistribution = [
    { difficulty: GuideDifficulty.Beginner, name: 'Beginner', count: guides.items.filter(g => g.difficulty === GuideDifficulty.Beginner).length },
    { difficulty: GuideDifficulty.Intermediate, name: 'Intermediate', count: guides.items.filter(g => g.difficulty === GuideDifficulty.Intermediate).length },
    { difficulty: GuideDifficulty.Advanced, name: 'Advanced', count: guides.items.filter(g => g.difficulty === GuideDifficulty.Advanced).length },
    { difficulty: GuideDifficulty.Expert, name: 'Expert', count: guides.items.filter(g => g.difficulty === GuideDifficulty.Expert).length }
  ].filter(d => d.count > 0);

  const stats = [
    {
      label: 'Total Guides',
      value: guides.totalCount,
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Average Rating',
      value: avgRating,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Total Bookmarks',
      value: totalBookmarks.toLocaleString(),
      icon: Bookmark,
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
          <p className="text-sm text-muted-foreground">Breakdown by guide category</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {categoryDistribution.map(({ name, count }) => {
              const percentage = guides.items.length > 0 
                ? ((count / guides.items.length) * 100).toFixed(0)
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

      {/* Difficulty Distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Difficulty Distribution</h3>
          <p className="text-sm text-muted-foreground">Breakdown by difficulty level</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {difficultyDistribution.map(({ name, count }) => {
              const percentage = guides.items.length > 0 
                ? ((count / guides.items.length) * 100).toFixed(0)
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

      {/* Top Rated Guides */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Top Rated Guides</h3>
          <p className="text-sm text-muted-foreground">Highest rated guides</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {guides.items
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 10)
              .map((guide) => (
                <div key={guide.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {guide.imageUrl ? (
                      <img
                        src={guide.imageUrl}
                        alt={guide.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{guide.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryName(guide.category)} • {getDifficultyName(guide.difficulty)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-foreground">{guide.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Most Popular Guides */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Most Popular Guides</h3>
          <p className="text-sm text-muted-foreground">Guides with most views</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {guides.items
              .sort((a, b) => b.viewsCount - a.viewsCount)
              .slice(0, 10)
              .map((guide) => (
                <div key={guide.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    {guide.imageUrl ? (
                      <img
                        src={guide.imageUrl}
                        alt={guide.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{guide.title}</p>
                      <p className="text-xs text-muted-foreground">
                        By {guide.userFirstName} {guide.userLastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-foreground">{guide.viewsCount}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
