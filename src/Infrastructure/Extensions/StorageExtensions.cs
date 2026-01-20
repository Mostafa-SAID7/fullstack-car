using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Infrastructure.Common;
using Application.Common.Interfaces;
using Infrastructure.Services.FileStorage;

namespace Infrastructure.Extensions
{
    public static class StorageExtensions
    {
        public static IServiceCollection AddStorageServices(this IServiceCollection services, IConfiguration configuration)
        {
            // File Storage Configuration
            services.Configure<FileStorageSettings>(configuration.GetSection("FileStorageSettings"));
            
            // File Storage Services
            services.AddScoped<LocalFileStorageService>();
            services.AddScoped<AzureBlobStorageService>();
            services.AddScoped<AmazonS3StorageService>();
            services.AddScoped<FileStorageFactory>();
            services.AddScoped<IFileValidationService, FileValidationService>();
            services.AddScoped<IThumbnailService, ThumbnailService>();
            services.AddScoped<ICdnService, CdnService>();

            return services;
        }
    }
}
