// This file serves as a central import point for all analytics models
// Individual model types are now organized by logical groupings for better maintainability

// Analytics - Main analytics classes
global using UserAnalytics = Application.Features.Admin.Analytics.Models.Analytics.UserAnalytics;
global using ContentAnalytics = Application.Features.Admin.Analytics.Models.Analytics.ContentAnalytics;
global using EngagementAnalytics = Application.Features.Admin.Analytics.Models.Analytics.EngagementAnalytics;
global using SystemAnalytics = Application.Features.Admin.Analytics.Models.Analytics.SystemAnalytics;
global using SecurityAnalytics = Application.Features.Admin.Analytics.Models.Analytics.SecurityAnalytics;
global using PerformanceAnalytics = Application.Features.Admin.Analytics.Models.Analytics.PerformanceAnalytics;

// Trends - All trend data classes
global using UserTrendData = Application.Features.Admin.Analytics.Models.Trends.UserTrendData;
global using UserActivityTrend = Application.Features.Admin.Analytics.Models.Trends.UserActivityTrend;
global using ContentTrendData = Application.Features.Admin.Analytics.Models.Trends.ContentTrendData;
global using EngagementTrendData = Application.Features.Admin.Analytics.Models.Trends.EngagementTrendData;
global using SystemTrendData = Application.Features.Admin.Analytics.Models.Trends.SystemTrendData;
global using SecurityTrendData = Application.Features.Admin.Analytics.Models.Trends.SecurityTrendData;

// Alerts - Alert and threat related classes
global using SystemAlert = Application.Features.Admin.Analytics.Models.Alerts.SystemAlert;
global using SecurityThreat = Application.Features.Admin.Analytics.Models.Alerts.SecurityThreat;

// Demographics - Demographic and category data
global using UserDemographic = Application.Features.Admin.Analytics.Models.Demographics.UserDemographic;
global using ContentCategory = Application.Features.Admin.Analytics.Models.Demographics.ContentCategory;

// Metrics - Performance and measurement classes
global using PerformanceMetric = Application.Features.Admin.Analytics.Models.Metrics.PerformanceMetric;

// Events - Event related classes
global using SecurityEvent = Application.Features.Admin.Analytics.Models.Events.SecurityEvent;

// TopItems - Top users, content, and popular items
global using TopUser = Application.Features.Admin.Analytics.Models.TopItems.TopUser;
global using TopEngagedContent = Application.Features.Admin.Analytics.Models.TopItems.TopEngagedContent;
global using PopularContent = Application.Features.Admin.Analytics.Models.TopItems.PopularContent;

// All model types are now available through their global aliases
// This maintains backward compatibility while providing better logical organization
