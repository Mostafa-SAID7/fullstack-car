using Infrastructure.Data;
using Infrastructure.Repositories;
using Infrastructure.Services.Identity;
using Infrastructure.Services.Localization;
using Infrastructure.Services.Communication;
using Infrastructure.Services.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Domain.Interfaces;
using Application.Common.Interfaces.Identity;
using Application.Common.Interfaces.Localization;
using Application.Common.Interfaces.Communication;
using Application.Common.Interfaces.Storage;

namespace Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services, 
            IConfiguration configuration)
        {
            // Add DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection")));

            // Add Repositories
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Add Infrastructure Services
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<ILocalizationService, LocalizationService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IFileService, FileService>();

            return services;
        }
    }
}