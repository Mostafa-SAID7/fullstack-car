// Conversation Monitor Component - Monitor active conversations in real-time

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Filter,
  MessageSquare,
  Activity,
  Clock,
  Search
} from 'lucide-react';
import { useConversationMonitor } from '../../../hooks/ai-agent/useConversationMonitor';
import { ConversationCard } from './ConversationCard';
import { ConversationDetail } from './ConversationDetail';
import type { AIConversation, AgentType } from '../../../types/ai-agent';
import { AgentType as AgentTypeEnum } from '../../../types/ai-agent';

export const ConversationMonitor: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<AIConversation | null>(null);
  const [filterAgent, setFilterAgent] = useState<AgentType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { conversations, loading, error, refreshConversations } = useConversationMonitor({
    autoRefresh,
    refreshInterval: 2000
  });

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesAgent = !filterAgent || conv.metadata?.agentType === filterAgent;
    const matchesSearch = !searchQuery || 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesAgent && matchesSearch && conv.isActive;
  });

  // Calculate stats
  const activeCount = conversations.filter(c => c.isActive).length;
  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Conversation Monitor</h2>
          <p className="text-muted-foreground">Monitor active conversations in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              autoRefresh
                ? 'bg-green-500/10 border-green-500/50 text-green-600'
                : 'bg-card border-border hover:bg-muted/50'
            }`}
          >
            <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={refreshConversations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <MessageSquare className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">{activeCount}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Active Conversations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{totalMessages}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Total Messages</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold">
              {autoRefresh ? '2s' : 'Manual'}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">Refresh Rate</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Agent Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value as AgentType | '')}
              className="px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="">All Agents</option>
              <option value={AgentTypeEnum.GENERAL}>General</option>
              <option value={AgentTypeEnum.MECHANIC}>Mechanic</option>
              <option value={AgentTypeEnum.BUYER_GUIDE}>Buyer's Guide</option>
              <option value={AgentTypeEnum.SELLER_ASSISTANT}>Seller Assistant</option>
              <option value={AgentTypeEnum.MODIFICATION_EXPERT}>Modification Expert</option>
              <option value={AgentTypeEnum.COMMUNITY_HELPER}>Community Helper</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6"
        >
          <p className="text-red-600 font-medium">{error}</p>
        </motion.div>
      )}

      {/* Conversation List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {loading && conversations.length === 0 ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 rounded-2xl p-12 text-center"
            >
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Conversations</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterAgent
                  ? 'Try adjusting your filters'
                  : 'Conversations will appear here when users start chatting'}
              </p>
            </motion.div>
          ) : (
            filteredConversations.map((conversation, index) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                delay={index * 0.05}
              />
            ))
          )}
        </div>

        {/* Detail View */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selectedConversation ? (
            <ConversationDetail
              conversation={selectedConversation}
              onClose={() => setSelectedConversation(null)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 rounded-2xl p-12 text-center"
            >
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
              <p className="text-muted-foreground">
                Click on a conversation to view details and messages
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
