using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDatabaseServices(configuration);
            services.AddIdentityServices(configuration);
            services.AddCommonInfrastructureServices();
            services.AddLocalizationServices(configuration);
            services.AddCachingServices(configuration);
            services.AddMediaServices(configuration);
            services.AddCommunityServices(configuration);
            services.AddAnalyticsServices(configuration);
            services.AddBackgroundJobs();
            services.AddSeedingServices();
            services.AddOptimizationServices(configuration);

            return services;
        }
    }
}
