// Admin Security Analytics Types

export interface SecurityAnalytics {
  totalThreats: number;
  blockedAttempts: number;
  suspiciousActivities: number;
  threats: ThreatData[];
  securityEvents: SecurityEventData[];
}

export interface ThreatData {
  type: string;
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastDetected: string;
}

export interface SecurityEventData {
  timestamp: string;
  event: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
}



