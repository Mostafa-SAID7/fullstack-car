import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, TrendingUp, CheckCircle } from 'lucide-react';
import { usePages } from '../hooks/usePages';
import { PageStatus, PageType } from '@/types/community/page';

export const PageAnalyticsComponent: React.FC = () => {
  const { pages, loading } = usePages({ pageNumber: 1, pageSize: 100 });

  if (loading || !pages) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalViews = pages.items.reduce((sum, p) => sum + p.viewsCount, 0);
  const publishedPages = pages.items.filter(p => p.status === PageStatus.Published).length;
  const draftPages = pages.items.filter(p => p.status === PageStatus.Draft).length;
  const avgViews = pages.items.length > 0 ? (totalViews / pages.items.length).toFixed(0) : 0;

  // Type distribution
  const typeDistribution = [
    { type: PageType.Article, name: 'Article', count: pages.items.filter(p => p.type === PageType.Article).length },
    { type: PageType.Guide, name: 'Guide', count: pages.items.filter(p => p.type === PageType.Guide).length },
    { type: PageType.FAQ, name: 'FAQ', count: pages.items.filter(p => p.type === PageType.FAQ).length },
    { type: PageType.Policy, name: 'Policy', count: pages.items.filter(p => p.type === PageType.Policy).length },
    { type: PageType.About, name: 'About', count: pages.items.filter(p => p.type === PageType.About).length },
    { type: PageType.Help, name: 'Help', count: pages.items.filter(p => p.type === PageType.Help).length }
  ].filter(t => t.count > 0);

  const stats = [
    {
      label: 'Total Pages',
      value: pages.totalCount,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Published',
      value: publishedPages,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Avg Views',
      value: avgViews,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
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

      {/* Type Distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Page Type Distribution</h3>
          <p className="text-sm text-muted-foreground">Breakdown by page type</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {typeDistribution.map(({ name, count }) => {
              const percentage = pages.items.length > 0 
                ? ((count / pages.items.length) * 100).toFixed(0)
                : 0;
              return (
                <div key={name} className="flex items-center space-x-4">
                  <div className="w-24">
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

      {/* Most Viewed Pages */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Most Viewed Pages</h3>
          <p className="text-sm text-muted-foreground">Top pages by view count</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {pages.items
              .sort((a, b) => b.viewsCount - a.viewsCount)
              .slice(0, 10)
              .map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{page.title}</p>
                      <p className="text-xs text-muted-foreground">
                        By {page.authorFirstName} {page.authorLastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{page.viewsCount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Pages */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Recent Pages</h3>
          <p className="text-sm text-muted-foreground">Latest pages created</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {pages.items
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{page.title}</p>
                      <p className="text-xs text-muted-foreground">
                        By {page.authorFirstName} {page.authorLastName} • {new Date(page.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{page.viewsCount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
