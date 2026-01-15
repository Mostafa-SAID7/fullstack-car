import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, TrendingUp, Globe, Lock, Shield } from 'lucide-react';
import { useGroups } from '../hooks';

export const GroupAnalyticsComponent: React.FC = () => {
  const { groups, loading } = useGroups({ pageNumber: 1, pageSize: 100 });

  if (loading || !groups) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalMembers = groups.items.reduce((sum, g) => sum + g.membersCount, 0);
  const totalPosts = groups.items.reduce((sum, g) => sum + g.postsCount, 0);
  const publicGroups = groups.items.filter(g => g.privacy === 1).length;
  const privateGroups = groups.items.filter(g => g.privacy === 2).length;
  const secretGroups = groups.items.filter(g => g.privacy === 3).length;
  const avgMembersPerGroup = groups.items.length > 0 ? (totalMembers / groups.items.length).toFixed(1) : 0;

  const stats = [
    {
      label: 'Total Groups',
      value: groups.totalCount,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Total Members',
      value: totalMembers.toLocaleString(),
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Total Posts',
      value: totalPosts.toLocaleString(),
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Avg Members/Group',
      value: avgMembersPerGroup,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Public Groups',
      value: publicGroups,
      icon: Globe,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Private Groups',
      value: privateGroups,
      icon: Lock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
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

      {/* Top Groups by Members */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Most Popular Groups</h3>
          <p className="text-sm text-muted-foreground">Groups with most members</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {groups.items
              .sort((a, b) => b.membersCount - a.membersCount)
              .slice(0, 10)
              .map((group) => (
                <div key={group.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                  {group.imageUrl && (
                    <img
                      src={group.imageUrl}
                      alt={group.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{group.name}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {group.membersCount} members
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        {group.postsCount} posts
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Groups */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Recently Created Groups</h3>
          <p className="text-sm text-muted-foreground">Latest groups in your community</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {groups.items
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((group) => (
                <div key={group.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                  {group.imageUrl && (
                    <img
                      src={group.imageUrl}
                      alt={group.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{group.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      By {group.ownerFirstName} {group.ownerLastName} • {new Date(group.createdAt).toLocaleDateString()}
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
