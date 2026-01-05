// Configuration Template Types

import type { AIAgentConfig } from './ai-agent';

export interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'production' | 'testing' | 'custom';
  config: Partial<AIAgentConfig>;
  isDefault: boolean;
}
