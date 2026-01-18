using WebAPI.Services;

namespace WebAPI.Extensions
{
    public static class StylesServiceExtensions
    {
        public static IServiceCollection AddStylesServices(this IServiceCollection services)
        {
            services.AddScoped<IPredefinedStylesService, PredefinedStylesService>();
            
            return services;
        }
    }
}