import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';

export const Campaigns: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const campaigns = [
    {
      id: 1,
      name: 'Summer Car Care Campaign',
      status: 'active',
      budget: '$2,500',
      spent: '$1,850',
      reach: '45.2K',
      clicks: '2.1K',
      conversions: 156,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      platforms: ['facebook', 'instagram', 'google']
    },
    {
      id: 2,
      name: 'Electric Vehicle Promotion',
      status: 'scheduled',
      budget: '$3,000',
      spent: '$0',
      reach: '0',
      clicks: '0',
      conversions: 0,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      platforms: ['facebook', 'twitter', 'linkedin']
    },
    {
      id: 3,
      name: 'Winter Maintenance Tips',
      status: 'completed',
      budget: '$1,800',
      spent: '$1,750',
      reach: '32.8K',
      clicks: '1.8K',
      conversions: 124,
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      platforms: ['instagram', 'facebook']
    },
    {
      id: 4,
      name: 'New Year Car Deals',
      status: 'paused',
      budget: '$4,200',
      spent: '$2,100',
      reach: '28.5K',
      clicks: '1.2K',
      conversions: 89,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      platforms: ['google', 'facebook', 'instagram']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCampaigns = filter === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Marketing Campaigns</h1>
          <p className="text-muted-foreground">Create and manage your marketing campaigns</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Campaigns', value: campaigns.length.toString(), icon: Target, color: 'blue' },
          { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'active').length.toString(), icon: Play, color: 'green' },
          { label: 'Total Reach', value: '106.5K', icon: Eye, color: 'purple' },
          { label: 'Total Conversions', value: '369', icon: TrendingUp, color: 'orange' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'scheduled', 'paused', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{campaign.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                  <span>Platforms: {campaign.platforms.join(', ')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                {campaign.status === 'active' ? (
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                    <Pause className="w-4 h-4" />
                  </button>
                ) : campaign.status === 'paused' ? (
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                ) : null}
                <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Budget</span>
                </div>
                <p className="font-bold">{campaign.budget}</p>
                <p className="text-xs text-muted-foreground">Spent: {campaign.spent}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Reach</span>
                </div>
                <p className="font-bold">{campaign.reach}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Clicks</span>
                </div>
                <p className="font-bold">{campaign.clicks}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Conversions</span>
                </div>
                <p className="font-bold">{campaign.conversions}</p>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium">CTR</span>
                <p className="font-bold">
                  {campaign.clicks !== '0' && campaign.reach !== '0' 
                    ? ((parseFloat(campaign.clicks.replace('K', '000')) / parseFloat(campaign.reach.replace('K', '000'))) * 100).toFixed(2) + '%'
                    : '0%'
                  }
                </p>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium">CVR</span>
                <p className="font-bold">
                  {campaign.clicks !== '0' 
                    ? ((campaign.conversions / parseFloat(campaign.clicks.replace('K', '000'))) * 100).toFixed(2) + '%'
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
export default Campaigns;