// AI Agent Testing Service

import { apiClient } from '../api';
import type { AgentType } from '../../types/ai-agent';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  agentType: AgentType;
  testMessage: string;
  context?: Record<string, any>;
  expectedKeywords?: string[];
  createdAt: string;
}

export interface TestResult {
  id: string;
  scenarioId: string;
  agentType: AgentType;
  testMessage: string;
  response: string;
  metadata: {
    model?: string;
    tokens?: number;
    confidence?: number;
    processingTime?: number;
    cost?: number;
  };
  timestamp: string;
}

export interface ABTestConfig {
  name: string;
  description: string;
  configA: Record<string, any>;
  configB: Record<string, any>;
  testMessages: string[];
}

export interface ABTestResult {
  id: string;
  testName: string;
  resultsA: TestResult[];
  resultsB: TestResult[];
  comparison: {
    avgConfidenceA: number;
    avgConfidenceB: number;
    avgResponseTimeA: number;
    avgResponseTimeB: number;
    avgCostA: number;
    avgCostB: number;
  };
  createdAt: string;
}

export class AIAgentTestingService {
  /**
   * Test an agent with a message
   */
  async testAgent(
    agentType: AgentType,
    message: string,
    context?: Record<string, any>
  ): Promise<TestResult> {
    const response = await apiClient.post('/api/agents/test', {
      agent_type: agentType,
      message,
      context
    });
    return response.data as any as TestResult;
  }

  /**
   * Get all test scenarios
   */
  async listScenarios(): Promise<TestScenario[]> {
    const response = await apiClient.get('/api/agents/test/scenarios');
    return response.data as any as TestScenario[];
  }

  /**
   * Create a new test scenario
   */
  async createScenario(scenario: Omit<TestScenario, 'id' | 'createdAt'>): Promise<TestScenario> {
    const response = await apiClient.post('/api/agents/test/scenarios', scenario);
    return response.data as any as TestScenario;
  }

  /**
   * Update a test scenario
   */
  async updateScenario(id: string, updates: Partial<TestScenario>): Promise<TestScenario> {
    const response = await apiClient.put(`/api/agents/test/scenarios/${id}`, updates);
    return response.data as any as TestScenario;
  }

  /**
   * Delete a test scenario
   */
  async deleteScenario(id: string): Promise<void> {
    await apiClient.delete(`/api/agents/test/scenarios/${id}`);
  }

  /**
   * Run a test scenario
   */
  async runScenario(scenarioId: string): Promise<TestResult> {
    const response = await apiClient.post(`/api/agents/test/scenarios/${scenarioId}/run`);
    return response.data as any as TestResult;
  }

  /**
   * Get test history
   */
  async getTestHistory(limit: number = 50): Promise<TestResult[]> {
    const response = await apiClient.get('/api/agents/test/history', {
      params: { limit }
    });
    return response.data as any as TestResult[];
  }

  /**
   * Run A/B test
   */
  async runABTest(config: ABTestConfig): Promise<ABTestResult> {
    const response = await apiClient.post('/api/agents/test/ab-test', config);
    return response.data as any as ABTestResult;
  }

  /**
   * Get A/B test results
   */
  async getABTestResults(limit: number = 20): Promise<ABTestResult[]> {
    const response = await apiClient.get('/api/agents/test/ab-test/results', {
      params: { limit }
    });
    return response.data as any as ABTestResult[];
  }

  /**
   * Delete A/B test result
   */
  async deleteABTestResult(id: string): Promise<void> {
    await apiClient.delete(`/api/agents/test/ab-test/results/${id}`);
  }
}

// Export singleton instance
export const testingService = new AIAgentTestingService();
