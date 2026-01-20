using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Data.Seeds;

namespace Infrastructure.Extensions
{
    public static class SeedingExtensions
    {
        public static IServiceCollection AddSeedingServices(this IServiceCollection services)
        {
            // Add Database Seeding Services that exist
            services.AddScoped<IdentitySeeder>();
            services.AddScoped<DatabaseSeeder>();

            return services;
        }
    }
}
