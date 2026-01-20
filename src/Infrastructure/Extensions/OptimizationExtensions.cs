using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Infrastructure.Common;

namespace Infrastructure.Extensions
{
    public static class OptimizationExtensions
    {
        public static IServiceCollection AddOptimizationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Performance Optimization Configuration
            services.Configure<PerformanceOptions>(configuration.GetSection("PerformanceOptions"));
            services.Configure<ConnectionOptions>(configuration.GetSection("ConnectionOptions"));

            return services;
        }
    }
}
