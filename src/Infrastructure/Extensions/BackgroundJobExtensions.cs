using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Services;

namespace Infrastructure.Extensions
{
    public static class BackgroundJobExtensions
    {
        public static IServiceCollection AddBackgroundJobs(this IServiceCollection services)
        {
            // Register background services that exist
            services.AddHostedService<RefreshTokenCleanupService>();
            services.AddHostedService<TranslationValidationBackgroundService>();
            services.AddHostedService<TranslationCacheWarmupService>();
            
            return services;
        }
    }
}
