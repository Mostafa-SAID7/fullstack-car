using Application.Common.Behaviors;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using System.Reflection;

namespace Application.Common
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
                cfg.AddOpenBehavior(typeof(CachingBehavior<,>));
                cfg.AddOpenBehavior(typeof(CacheInvalidationBehavior<,>));
                // cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
            });

            // Register AI Agent Service
            services.AddHttpClient<Application.Features.AIAgent.Interfaces.IAIAgentService, Application.Features.AIAgent.Services.AIAgentService>();

            return services;
        }
    }
}
