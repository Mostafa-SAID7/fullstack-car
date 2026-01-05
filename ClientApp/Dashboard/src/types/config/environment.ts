// Environment Configuration Types

import type { AIAgentConfig } from './ai-agent';

export interface EnvironmentConfig {
  name: string;
  description: string;
  config: AIAgentConfig;
  isActive: boolean;
  lastModified: string;
}
