// Conversation Detail Component - Show full conversation details

import { motion } from 'framer-motion';
import { X, User, Bot, Clock, MessageSquare, TrendingUp } from 'lucide-react';
import type { AIConversation } from '../../../types/ai-agent';
import { AgentType } from '../../../types/ai-agent';

interface ConversationDetailProps {
  conversation: AIConversation;
  onClose: () => void;
}

const agentConfig = {
  [AgentType.GENERAL]: { color: 'blue', icon: '💬', label: 'General' },
  [AgentType.MECHANIC]: { color: 'orange', icon: '🔧', label: 'Mechanic' },
  [AgentType.BUYER_GUIDE]: { color: 'green', icon: '🚗', label: "Buyer's Guide" },
  [AgentType.SELLER_ASSISTANT]: { color: 'purple', icon: '💰', label: 'Seller Assistant' },
  [AgentType.MODIFICATION_EXPERT]: { color: 'red', icon: '⚙️', label: 'Modification Expert' },
  [AgentType.COMMUNITY_HELPER]: { color: 'cyan', icon: '👥', label: 'Community Helper' }
};

export const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversation,
  onClose
}) => {
  const agentType = (conversation.metadata as any)?.agentType || AgentType.GENERAL;
  const agent = agentConfig[agentType as AgentType];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col h-[600px]"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-muted/30">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-3 rounded-xl bg-${agent.color}-500/10`}>
              <span className="text-2xl">{agent.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{conversation.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full bg-${agent.color}-500/10 text-${agent.color}-600 font-medium`}>
                  {agent.label}
                </span>
                {conversation.isActive && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Messages</p>
              <p className="font-semibold">{conversation.messages.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Started</p>
              <p className="font-semibold">{formatDate(conversation.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="font-semibold truncate">{conversation.userId}</p>
            </div>
          </div>
        </div>

        {/* Additional Metadata */}
        {conversation.metadata && (
          <div className="mt-4 p-3 bg-background/50 rounded-lg">
            <div className="grid grid-cols-3 gap-3 text-xs">
              {conversation.metadata.model && (
                <div>
                  <p className="text-muted-foreground mb-1">Model</p>
                  <p className="font-medium">{conversation.metadata.model}</p>
                </div>
              )}
              {conversation.metadata.totalTokens !== undefined && (
                <div>
                  <p className="text-muted-foreground mb-1">Tokens</p>
                  <p className="font-medium">{conversation.metadata.totalTokens.toLocaleString()}</p>
                </div>
              )}
              {conversation.metadata.totalMessages !== undefined && (
                <div>
                  <p className="text-muted-foreground mb-1">Total Messages</p>
                  <p className="font-medium">{conversation.metadata.totalMessages}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-primary/10'
                  : 'bg-muted'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-primary" />
              ) : (
                <Bot className="w-4 h-4 text-muted-foreground" />
              )}
            </div>

            {/* Message Content */}
            <div
              className={`flex-1 max-w-[80%] ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>

              {/* Message Metadata */}
              <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                <span>{formatTime(message.timestamp)}</span>
                {message.metadata?.confidence && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{Math.round(message.metadata.confidence * 100)}%</span>
                    </div>
                  </>
                )}
                {message.metadata?.tokens && (
                  <>
                    <span>•</span>
                    <span>{message.metadata.tokens} tokens</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: {formatDate(conversation.updatedAt)} at {formatTime(conversation.updatedAt)}</span>
          <span>ID: {conversation.id.slice(0, 8)}...</span>
        </div>
      </div>
    </motion.div>
  );
};
