using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Infrastructure.Common;

namespace Infrastructure.Extensions
{
    public static class MediaExtensions
    {
        public static IServiceCollection AddMediaServices(this IServiceCollection services, IConfiguration configuration)
        {
            // File Storage Configuration
            services.Configure<FileStorageSettings>(configuration.GetSection("FileStorageSettings"));

            return services;
        }
    }
}
