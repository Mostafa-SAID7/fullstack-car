export { DashboardOverview } from './dashboard';
export { Content, LocalizationManagement, Media, ThemesManagement } from './content';
export { Settings } from './settings';
export { AIAgentManagement } from './ai-agent';
export { Customers } from './marketplace/customers';
export { Products } from './marketplace/products';
export { Services } from './marketplace/services';

// Marketplace Pages
export * from './marketplace';

// Administration Pages
export { Users, Analytics, System, AuditLogs, HealthMonitor } from './administration';
export { NotificationManagement } from './administration/notifications';

// Marketing Pages
export { MarketingOverview, SocialMedia, Campaigns, ContentPlanning } from './marketing';
export { Analytics as MarketingAnalytics } from './marketing';

// Error Pages
export { NotFound, Forbidden, ServerError } from './errors';