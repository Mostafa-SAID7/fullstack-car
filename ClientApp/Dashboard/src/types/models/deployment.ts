// Model Deployment Types

export interface ModelDeployment {
  modelId: string;
  environment: 'development' | 'staging' | 'production';
  endpoint: string;
  status: 'deploying' | 'deployed' | 'failed' | 'stopped';
  replicas: number;
  resources: {
    cpu: string;
    memory: string;
    gpu?: string;
  };
}

