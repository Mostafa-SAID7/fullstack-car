using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Application.Features.Admin.Analytics.Interfaces;
using Application.Features.Admin.Analytics.Services;
using Infrastructure.Common;

namespace Infrastructure.Extensions
{
    public static class AnalyticsExtensions
    {
        public static IServiceCollection AddAnalyticsServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Analytics Services
            services.Configure<AnalyticsSettings>(configuration.GetSection("AnalyticsSettings"));
            services.AddScoped<IUserAnalyticsService, UserAnalyticsService>();
            services.AddScoped<IContentAnalyticsService, ContentAnalyticsService>();
            services.AddScoped<IEngagementAnalyticsService, EngagementAnalyticsService>();
            services.AddScoped<ISystemAnalyticsService, SystemAnalyticsService>();
            services.AddScoped<ISecurityAnalyticsService, SecurityAnalyticsService>();
            services.AddScoped<IPerformanceAnalyticsService, PerformanceAnalyticsService>();
            services.AddScoped<IAnalyticsService, AnalyticsService>();

            return services;
        }
    }
}
