using Microsoft.Extensions.DependencyInjection;
using Application.Common.Interfaces;
using Infrastructure.Services;
using Domain.Interfaces;

namespace Infrastructure.Extensions
{
    public static class CommonExtensions
    {
        public static IServiceCollection AddCommonInfrastructureServices(this IServiceCollection services)
        {
            // Domain Event Dispatcher
            services.AddScoped<IDomainEventDispatcher, DomainEventDispatcher>();

            // Add SignalR
            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
                options.KeepAliveInterval = TimeSpan.FromSeconds(15);
                options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
            });

            return services;
        }
    }
}
