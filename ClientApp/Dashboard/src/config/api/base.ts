// API Base Configuration

import { ENV } from '../environment';

export interface ApiConfig {
  baseURL: string;
  aiAgentURL: string;
  wsURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}

export const API_CONFIG: ApiConfig = {
  baseURL: ENV.API_BASE_URL,
  aiAgentURL: ENV.AI_AGENT_URL,
  wsURL: ENV.WS_URL,
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
};



