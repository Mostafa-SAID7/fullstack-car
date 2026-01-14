// Monitoring Resources and Errors Constants

export const SYSTEM_RESOURCES = [
  { name: 'CPU', unit: '%', threshold: 80, icon: 'cpu' },
  { name: 'Memory', unit: '%', threshold: 85, icon: 'memory' },
  { name: 'Disk', unit: '%', threshold: 90, icon: 'disk' },
  { name: 'Network', unit: 'Mbps', threshold: 100, icon: 'network' }
] as const;

export const ERROR_TYPES = [
  'Timeout Errors',
  'Model Errors',
  'API Errors',
  'Network Errors',
  'Validation Errors',
  'Authentication Errors'
] as const;





