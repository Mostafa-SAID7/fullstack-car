using Application.Common.Behaviors;
using Application.Features.Media.Shared.Interfaces;
using Application.Features.Media.Shared.Services;
using Application.Features.Community.QA.Services;
using Domain.Services;
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

            // Register domain services
            services.AddScoped<IMediaDomainService, MediaDomainService>();
            
            // Register media services
            services.AddScoped<IMediaService, MediaService>();

            // QA services are registered in Infrastructure layer

            return services;
        }
    }
}
