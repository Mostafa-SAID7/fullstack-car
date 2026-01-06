import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Eye,
  Users,
  MousePointer,
  Share2,
  Download
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const analyticsData = {
    overview: {
      totalImpressions: { value: '2.4M', change: '+12.5%', trend: 'up' },
      totalReach: { value: '1.8M', change: '+8.3%', trend: 'up' },
      totalEngagement: { value: '156K', change: '+15.2%', trend: 'up' },
      totalClicks: { value: '45.2K', change: '-2.1%', trend: 'down' }
    },
    platforms: [
      { name: 'Facebook', impressions: '850K', reach: '620K', engagement: '42K', clicks: '18.5K', color: 'blue' },
      { name: 'Instagram', impressions: '720K', reach: '540K', engagement: '65K', clicks: '15.2K', color: 'pink' },
      { name: 'Twitter', impressions: '480K', reach: '380K', engagement: '28K', clicks: '8.1K', color: 'sky' },
      { name: 'LinkedIn', impressions: '350K', reach: '260K', engagement: '21K', clicks: '3.4K', color: 'indigo' }
    ],
    topPosts: [
      {
        id: 1,
        platform: 'Instagram',
        content: 'Summer car maintenance tips that will save you money! 🚗💰',
        impressions: '125K',
        engagement: '8.2K',
        clicks: '2.1K',
        date: '2024-01-05'
      },
      {
        id: 2,
        platform: 'Facebook',
        content: 'Electric vehicles: The future is here! Check out our latest EV reviews.',
        impressions: '98K',
        engagement: '6.8K',
        clicks: '1.8K',
        date: '2024-01-04'
      },
      {
        id: 3,
        platform: 'Twitter',
        content: 'Quick poll: What\'s your favorite car brand? Let us know in the comments! 🚙',
        impressions: '76K',
        engagement: '5.4K',
        clicks: '1.2K',
        date: '2024-01-03'
      }
    ]
  };

  const chartData = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    impressions: Math.floor(Math.random() * 100000) + 50000,
    engagement: Math.floor(Math.random() * 10000) + 2000,
    clicks: Math.floor(Math.random() * 3000) + 500
  })), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Analytics</h1>
          <p className="text-muted-foreground">Track your marketing performance across all channels</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(analyticsData.overview).map(([key, data], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                {key === 'totalImpressions' && <Eye className="w-6 h-6 text-primary" />}
                {key === 'totalReach' && <Users className="w-6 h-6 text-primary" />}
                {key === 'totalEngagement' && <Share2 className="w-6 h-6 text-primary" />}
                {key === 'totalClicks' && <MousePointer className="w-6 h-6 text-primary" />}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                data.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {data.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{data.value}</h3>
            <p className="text-muted-foreground text-sm capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Performance Trends</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Impressions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Clicks</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 flex items-end gap-1">
          {chartData.slice(-14).map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col gap-1">
                <div 
                  className="bg-blue-500/20 rounded-t-sm"
                  style={{ height: `${(data.impressions / 150000) * 100}px` }}
                />
                <div 
                  className="bg-green-500/20 rounded-sm"
                  style={{ height: `${(data.engagement / 12000) * 50}px` }}
                />
                <div 
                  className="bg-purple-500/20 rounded-b-sm"
                  style={{ height: `${(data.clicks / 3500) * 30}px` }}
                />
              </div>
              <span className="text-xs text-muted-foreground transform -rotate-45 origin-left">
                {data.date}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Platform Performance & Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-bold text-lg mb-6">Platform Performance</h3>
          <div className="space-y-4">
            {analyticsData.platforms.map((platform, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${platform.color}-500`} />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{platform.impressions} impressions</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Reach</p>
                    <p className="font-medium">{platform.reach}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-medium">{platform.engagement}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Clicks</p>
                    <p className="font-medium">{platform.clicks}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-bold text-lg mb-6">Top Performing Posts</h3>
          <div className="space-y-4">
            {analyticsData.topPosts.map((post) => (
              <div key={post.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-primary">{post.platform}</span>
                  <span className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm mb-3 line-clamp-2">{post.content}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Impressions</p>
                    <p className="font-medium">{post.impressions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-medium">{post.engagement}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Clicks</p>
                    <p className="font-medium">{post.clicks}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default Analytics;