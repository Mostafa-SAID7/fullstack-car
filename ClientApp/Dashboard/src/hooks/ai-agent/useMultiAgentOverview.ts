// Multi-Agent Overview Hook - For fetching agent status and metrics

import { useState, useEffect, useCallback } from 'react';
import { agentManagementService } from '../../services/ai-agent';
import type { AgentStatus, AgentType } from '../../types/ai-agent';

interface OverviewMetrics {
  totalConversations: number;
  activeConversations: number;
  averageResponseTime: number;
  satisfactionScore: number;
  totalAgents: number;
  activeAgents: number;
}

export const useMultiAgentOverview = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [metrics, setMetrics] = useState<OverviewMetrics>({
    totalConversations: 0,
    activeConversations: 0,
    averageResponseTime: 0,
    satisfactionScore: 0,
    totalAgents: 0,
    activeAgents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await agentManagementService.listAgents();

      if (!response || !response.agents) {
        throw new Error('Invalid response from agent service');
      }

      setAgents(response.agents);

      // Calculate overview metrics
      const totalConversations = response.agents.reduce(
        (sum, agent) => sum + agent.totalConversations,
        0
      );
      const activeAgents = response.agents.filter(agent => agent.isActive).length;
      const avgSatisfaction = response.agents.reduce(
        (sum, agent) => sum + agent.averageSatisfaction,
        0
      ) / (response.agents.length || 1);

      setMetrics({
        totalConversations,
        activeConversations: Math.floor(totalConversations * 0.1), // Estimate 10% active
        averageResponseTime: 1.2, // Mock value - would come from backend
        satisfactionScore: avgSatisfaction,
        totalAgents: response.agents.length,
        activeAgents
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    metrics,
    loading,
    error,
    refreshData
  };
};
