// Multi-Agent Overview Component - Shows status and metrics for all specialized agents

import { motion } from 'framer-motion';
import {
  Bot,
  MessageSquare,
  Zap,
  ThumbsUp,
  Wrench,
  ShoppingCart,
  DollarSign,
  Settings,
  Users,
  RefreshCw,
  Activity
} from 'lucide-react';
import { useMultiAgentOverview } from '../../../hooks/ai-agent/useMultiAgentOverview';
import { MetricCard } from './MetricCard';
import { AgentType } from '../../../types/ai-agent';

const AGENT_ICONS: Record<string, any> = {
  [AgentType.MECHANIC]: Wrench,
  [AgentType.BUYER_GUIDE]: ShoppingCart,
  [AgentType.SELLER_ASSISTANT]: DollarSign,
  [AgentType.MODIFICATION_EXPERT]: Settings,
  [AgentType.COMMUNITY_HELPER]: Users,
  [AgentType.GENERAL]: Bot
};

const AGENT_COLORS: Record<string, { icon: string; bg: string; border: string }> = {
  [AgentType.MECHANIC]: { icon: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  [AgentType.BUYER_GUIDE]: { icon: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  [AgentType.SELLER_ASSISTANT]: { icon: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  [AgentType.MODIFICATION_EXPERT]: { icon: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  [AgentType.COMMUNITY_HELPER]: { icon: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  [AgentType.GENERAL]: { icon: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20' }
};

const AGENT_NAMES: Record<string, string> = {
  [AgentType.MECHANIC]: 'Mechanic Agent',
  [AgentType.BUYER_GUIDE]: "Buyer's Guide",
  [AgentType.SELLER_ASSISTANT]: 'Seller Assistant',
  [AgentType.MODIFICATION_EXPERT]: 'Modification Expert',
  [AgentType.COMMUNITY_HELPER]: 'Community Helper',
  [AgentType.GENERAL]: 'General Agent'
};

export const MultiAgentOverview: React.FC = () => {
  const { agents, metrics, loading, error, refreshData } = useMultiAgentOverview();

  if (error) {
    return (
      <div className="bg-card border border-destructive/50 rounded-3xl p-6">
        <div className="flex items-center gap-3 text-destructive">
          <Activity className="w-5 h-5" />
          <p className="font-medium">Error loading agent data: {error}</p>
        </div>
        <button
          onClick={refreshData}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Agent System Overview</h2>
          <p className="text-muted-foreground">Monitor all specialized agents and their performance</p>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Conversations"
          value={(metrics?.totalConversations ?? 0).toLocaleString()}
          icon={MessageSquare}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-500/10"
          loading={loading}
          delay={0}
        />

        <MetricCard
          title="Active Agents"
          value={`${metrics?.activeAgents ?? 0}/${metrics?.totalAgents ?? 0}`}
          subtitle="Agents online"
          icon={Bot}
          iconColor="text-green-500"
          iconBgColor="bg-green-500/10"
          loading={loading}
          delay={0.1}
        />

        <MetricCard
          title="Avg Response Time"
          value={`${(metrics?.averageResponseTime ?? 0).toFixed(1)}s`}
          icon={Zap}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-500/10"
          trend={{ value: 12, isPositive: true }}
          loading={loading}
          delay={0.2}
        />

        <MetricCard
          title="Satisfaction Score"
          value={`${((metrics?.satisfactionScore ?? 0) * 100).toFixed(0)}%`}
          icon={ThumbsUp}
          iconColor="text-pink-500"
          iconBgColor="bg-pink-500/10"
          trend={{ value: 5, isPositive: true }}
          loading={loading}
          delay={0.3}
        />
      </div>

      {/* Agent Status Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Specialized Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-3xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-muted rounded-2xl" />
                  <div className="w-16 h-6 bg-muted rounded-full" />
                </div>
                <div className="h-6 bg-muted rounded mb-2 w-32" />
                <div className="h-4 bg-muted rounded w-24 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))
          ) : (
            agents.map((agent, index) => {
              const Icon = AGENT_ICONS[agent.agentType] || Bot;
              const colors = AGENT_COLORS[agent.agentType] || AGENT_COLORS[AgentType.GENERAL];
              const name = AGENT_NAMES[agent.agentType] || agent.agentType;
              const avgSat = agent.averageSatisfaction ?? 0;

              return (
                <motion.div
                  key={agent.agentType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`bg-card border ${colors.border} shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-3xl p-6`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${colors.bg}`}>
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${agent.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`} />
                      {agent.isActive ? 'Active' : 'Offline'}
                    </div>
                  </div>

                  <h4 className="text-lg font-bold mb-1">{name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {(agent.totalConversations ?? 0).toLocaleString()} conversations
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Satisfaction</span>
                      <span className="font-semibold">
                        {(avgSat * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${avgSat >= 0.8
                            ? 'bg-green-500'
                            : avgSat >= 0.6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        style={{ width: `${avgSat * 100}%` }}
                      />
                    </div>

                    {agent.lastUsed && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last used: {new Date(agent.lastUsed).toLocaleString()}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-card border border-border/50 shadow-md rounded-3xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-green-500/10">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics?.activeConversations ?? 0}</p>
              <p className="text-sm text-muted-foreground">Active Now</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10">
              <MessageSquare className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.floor((metrics?.totalConversations ?? 0) / 30)}/day
              </p>
              <p className="text-sm text-muted-foreground">Avg Daily</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
