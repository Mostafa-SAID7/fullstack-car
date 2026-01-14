// Conversation Monitor Hook - For monitoring active conversations

import { useState, useEffect, useCallback } from 'react';
import { conversationsService } from '../../services/ai-agent';
import type { AIConversation } from '../../types/ai-agent';

interface ConversationMonitorOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useConversationMonitor = (options: ConversationMonitorOptions = {}) => {
  const { autoRefresh = true, refreshInterval = 2000 } = options;
  
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const response = await conversationsService.listConversations({ limit: 50 });
      setConversations(response.conversations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();

    if (autoRefresh) {
      const interval = setInterval(fetchConversations, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchConversations, autoRefresh, refreshInterval]);

  const refreshConversations = useCallback(() => {
    setLoading(true);
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refreshConversations
  };
};
