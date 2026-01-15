import { ENV } from '../../config/environment';
import { apiClient } from '../api';
import type { AgentType, AgentStatus, AgentConfig, AgentResponse, ChatRequest } from '../../types/ai-agent';

const BASE_URL = `${ENV.AI_AGENT_URL}/agents`;

export class AIAgentManagementService {
  /**
   * List all available agents
   */
  async listAgents(): Promise<{ agents: AgentStatus[] }> {
    const response = await apiClient.get(BASE_URL);
    return response.data as { agents: AgentStatus[] };
  }

  /**
   * Get status for a specific agent
   */
  async getAgentStatus(agentType: AgentType): Promise<AgentStatus> {
    const response = await apiClient.get(`${BASE_URL}/${agentType}/status`);
    return response.data as AgentStatus;
  }

  /**
   * Configure a specific agent
   */
  async configureAgent(agentType: AgentType, config: Record<string, any>): Promise<any> {
    const response = await apiClient.post(`${BASE_URL}/${agentType}/configure`, {
      agent_type: agentType,
      config
    });
    return response.data;
  }

  /**
   * Get current configuration for an agent
   */
  async getAgentConfig(agentType: AgentType): Promise<{ agent_type: string; config: Record<string, any> }> {
    const response = await apiClient.get(`${BASE_URL}/${agentType}/config`);
    return response.data as { agent_type: string; config: Record<string, any> };
  }

  /**
   * Test an agent with a sample message
   */
  async testAgent(agentType: AgentType, testRequest: ChatRequest): Promise<AgentResponse> {
    const response = await apiClient.post(`${BASE_URL}/${agentType}/test`, testRequest);
    return response.data as AgentResponse;
  }

  /**
   * Get performance metrics for an agent
   */
  async getAgentMetrics(agentType: AgentType): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/${agentType}/metrics`);
    return response.data;
  }

  /**
   * Enable an agent
   */
  async enableAgent(agentType: AgentType): Promise<any> {
    const response = await apiClient.post(`${BASE_URL}/${agentType}/enable`);
    return response.data;
  }

  /**
   * Disable an agent
   */
  async disableAgent(agentType: AgentType): Promise<any> {
    const response = await apiClient.post(`${BASE_URL}/${agentType}/disable`);
    return response.data;
  }
}

export const agentManagementService = new AIAgentManagementService();
