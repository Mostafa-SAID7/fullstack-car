using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Application.Features.Community.Events.Services;
using Infrastructure.Services.Community;
using Infrastructure.Common;

namespace Infrastructure.Extensions
{
    public static class CommunityExtensions
    {
        public static IServiceCollection AddCommunityServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Community Services that exist
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<IExpertService, ExpertService>();
            
            // Domain Services
            services.AddScoped<Domain.Services.IExpertIdentificationService, Application.Features.Community.QA.Services.ExpertIdentificationService>();

            return services;
        }
    }
}
