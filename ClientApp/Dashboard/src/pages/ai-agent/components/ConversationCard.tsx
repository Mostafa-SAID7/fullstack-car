// Conversation Card Component - Display individual conversation in monitor

import { motion } from 'framer-motion';
import { MessageSquare, Clock, User } from 'lucide-react';
import type { AIConversation } from '../../../types/ai-agent';
import { AgentType } from '../../../types/ai-agent';

interface ConversationCardProps {
  conversation: AIConversation;
  isSelected: boolean;
  onClick: () => void;
  delay?: number;
}

const agentConfig = {
  [AgentType.GENERAL]: { color: 'blue', icon: '💬', label: 'General' },
  [AgentType.MECHANIC]: { color: 'orange', icon: '🔧', label: 'Mechanic' },
  [AgentType.BUYER_GUIDE]: { color: 'green', icon: '🚗', label: "Buyer's Guide" },
  [AgentType.SELLER_ASSISTANT]: { color: 'purple', icon: '💰', label: 'Seller Assistant' },
  [AgentType.MODIFICATION_EXPERT]: { color: 'red', icon: '⚙️', label: 'Modification Expert' },
  [AgentType.COMMUNITY_HELPER]: { color: 'cyan', icon: '👥', label: 'Community Helper' }
};

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onClick,
  delay = 0
}) => {
  const agentType = conversation.metadata?.agentType || AgentType.GENERAL;
  const agent = agentConfig[agentType];
  
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const messageCount = conversation.messages.length;
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`bg-card border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'border-primary shadow-lg ring-2 ring-primary/20'
          : 'border-border/50 hover:border-primary/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg bg-${agent.color}-500/10 flex-shrink-0`}>
            <span className="text-xl">{agent.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{conversation.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full bg-${agent.color}-500/10 text-${agent.color}-600`}>
                {agent.label}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span>{messageCount}</span>
              </div>
            </div>
          </div>
        </div>
        
        {conversation.isActive && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded-full flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
        )}
      </div>

      {/* Last Message Preview */}
      {lastMessage && (
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {lastMessage.role === 'user' ? '👤 ' : '🤖 '}
            {lastMessage.content}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span className="truncate max-w-[120px]">{conversation.userId}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatTime(conversation.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};
