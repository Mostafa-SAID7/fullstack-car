// Configuration Backup Types

import type { AIAgentConfig } from './ai-agent';

export interface ConfigBackup {
  id: string;
  name: string;
  config: AIAgentConfig;
  createdAt: string;
  description?: string;
  tags: string[];
}
