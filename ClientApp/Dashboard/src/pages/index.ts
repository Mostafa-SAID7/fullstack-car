export { DashboardOverview } from './dashboard';
export { Content, LocalizationManagement, Media, ThemesManagement } from './content';
export {
    QAManagement,
    QAAnalytics,
    PostsManagement,
    GroupsManagement,
    FriendsManagement,
    GuidesManagement,
    ReviewsManagement,
    MapsManagement,
    NewsManagement,
    PagesManagement
} from './community';
export { MediaManagement } from './media';
export { Settings } from './settings';
export { AIAgentManagement, ModelTraining } from './ai-agent';
export { Customers } from './marketplace/customers';
export { Products } from './marketplace/products';
export { Services } from './marketplace/services';

// Marketplace Pages
export * from './marketplace';

// Administration Pages
export { Users, Analytics, System, AuditLogs, HealthMonitor } from './administration';
export { NotificationManagement } from './administration/notifications';

// Marketing Pages
export {
    MarketingOverview,
    SocialMediaManagement,
    CampaignsManagement,
    AnalyticsDashboard,
    ContentPlanning
} from './marketing';

// Error Pages
export { NotFound, Forbidden, ServerError } from './errors';