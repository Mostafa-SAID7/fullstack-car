import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Plus,
  Calendar,
  TrendingUp,
  MessageSquare,
  Share2
} from 'lucide-react';

export const SocialMedia: React.FC = () => {

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue', followers: '12.5K', posts: 45 },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink', followers: '8.9K', posts: 32 },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'sky', followers: '6.2K', posts: 78 },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'indigo', followers: '4.1K', posts: 23 }
  ];

  const scheduledPosts = [
    {
      id: 1,
      platform: 'facebook',
      content: 'Summer car maintenance tips to keep your vehicle running smoothly! 🚗☀️',
      scheduledTime: '2024-01-07 10:00',
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      platform: 'instagram',
      content: 'Check out this amazing car transformation! Before and after photos 📸',
      scheduledTime: '2024-01-07 14:30',
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 3,
      platform: 'twitter',
      content: 'Electric vehicles are the future! What\'s your favorite EV model? #ElectricCars #Future',
      scheduledTime: '2024-01-06 16:00',
      status: 'published',
      engagement: { likes: 24, comments: 8, shares: 12 }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Social Media Management</h1>
          <p className="text-muted-foreground">Manage your social media presence across all platforms</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Create Post
        </button>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${platform.color}-500/10`}>
                <platform.icon className={`w-6 h-6 text-${platform.color}-500`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{platform.followers}</p>
                <p className="text-sm text-muted-foreground">followers</p>
              </div>
            </div>
            <h3 className="font-semibold mb-2">{platform.name}</h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{platform.posts} posts</span>
              <span className="text-green-600">+12% growth</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Calendar & Scheduled Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Content Calendar</h3>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6; // Start from previous month
                const isCurrentMonth = day > 0 && day <= 31;
                const hasPost = isCurrentMonth && [5, 12, 18, 25].includes(day);
                
                return (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                      isCurrentMonth
                        ? hasPost
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-muted'
                        : 'text-muted-foreground/50'
                    }`}
                  >
                    {isCurrentMonth ? day : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Scheduled Posts</h3>
            <span className="text-sm text-muted-foreground">{scheduledPosts.length} posts</span>
          </div>

          <div className="space-y-4">
            {scheduledPosts.map((post) => {
              const platform = platforms.find(p => p.id === post.platform);
              return (
                <div key={post.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-${platform?.color}-500/10`}>
                      {platform?.icon && <platform.icon className={`w-4 h-4 text-${platform.color}-500`} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-2">{post.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(post.scheduledTime).toLocaleString()}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          post.status === 'scheduled' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      {post.status === 'published' && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {post.engagement.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.engagement.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            {post.engagement.shares}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default SocialMedia;