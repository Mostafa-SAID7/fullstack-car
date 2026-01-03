// System namespaces
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading;
global using System.Threading.Tasks;
global using System.Text;

// Microsoft namespaces
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Logging;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Identity;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.IdentityModel.Tokens;

// Application interfaces
global using Application.Features.Shared.Caching.Interfaces;
global using Application.Features.Shared.Caching.Interfaces.Services;
global using Application.Features.Shared.Caching.DTOs.Requests;
global using Application.Features.Shared.Caching.DTOs.Responses;
global using Application.Features.Shared.Caching.Models;
global using Application.Features.Shared.Caching.Services;
global using Application.Features.Shared.Documents.Interfaces;
global using Application.Features.Shared.Documents.Models;
global using Application.Features.Shared.Documents.DTOs.Requests;
global using Application.Features.Shared.Storage.Interfaces;
global using Application.Features.Shared.Chat.Interfaces;
global using Application.Features.Shared.Localization.Interfaces;
global using Application.Features.Shared.Security.Interfaces;
global using Application.Features.Shared.Security.Models;
global using Application.Features.Shared.System.Interfaces;
global using Application.Features.Shared.System.Models;
global using Application.Features.Shared.Logging.Interfaces;
global using Application.Features.Admin.Analytics.Interfaces;
global using Application.Common.Interfaces.Data;
global using Application.Features.Identity.Core.Interfaces;
global using Application.Features.Identity.Auth.Interfaces;
global using Application.Features.Identity.OAuth.Interfaces;
global using Application.Features.Identity.Profile.Interfaces;
global using Application.Features.Identity.Password.Interfaces;
global using Application.Features.Identity.Security.Interfaces;

// Domain
global using Domain.Interfaces;
global using Domain.Entities.Identity;
global using Domain.Entities.Marketplace.Services;
global using Domain.Entities.Marketplace.Providers;
global using Domain.Entities.Marketplace.Bookings;
global using Domain.Entities.Marketplace.Reviews;

// Infrastructure
global using Infrastructure.Data;
global using Infrastructure.Repositories;
global using Infrastructure.Common;
global using Application.Features.Shared.Logging.Services;
global using Application.Features.Admin.Analytics.Services;
global using Application.Features.Identity.Core.Services;
global using Application.Features.Identity.Auth.Services;
global using Application.Features.Identity.Profile.Services;
global using Application.Features.Identity.Password.Services;
global using Application.Features.Identity.Security.Services;
global using Application.Features.Shared.Localization.Services;
global using Application.Features.Shared.Email.Services;
global using Application.Features.Shared.Storage.Services;
global using Application.Features.Shared.Chat.Services;
global using Application.Features.Shared.Notifications.Services;

// Infrastructure Seeds
global using Infrastructure.Data.Seeds;

// Third-party
global using StackExchange.Redis;

// Analytics Models - Global aliases for better organization
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