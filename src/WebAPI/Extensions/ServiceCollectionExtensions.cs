using Infrastructure.Extensions;
using Application.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAPI.Filters;
using Application.Common.Interfaces.Communication;
using WebAPI.Services.Communication;

namespace WebAPI.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddWebAPIServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Add Infrastructure Services
            services.AddInfrastructureServices(configuration);

            // Add Application Services
            services.AddApplicationServices();

            // Add Response Caching
            services.AddResponseCaching();

            // Add Output Caching
            services.AddOutputCache();

            // Add HttpContextAccessor for CurrentUserService
            services.AddHttpContextAccessor();

            var corsSettings = configuration.GetSection("CorsSettings");
            var allowedOrigins = corsSettings.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

            services.AddCors(options =>
            {
                options.AddPolicy(
                    "AllowAngularApp",
                    policy =>
                    {
                        policy.WithOrigins(allowedOrigins)
                               .AllowAnyHeader()
                               .AllowAnyMethod()
                               .AllowCredentials();
                    });
            });

            // Add Data Protection
            services.AddDataProtection();

            // Add Anti-Forgery
            services.AddAntiforgery(options =>
            {
                options.HeaderName = "X-XSRF-TOKEN";
            });

            // Add Controllers with global filters
            services.AddControllers(options =>
            {
                options.Filters.Add<SanitizeInputFilter>();
            });

            // Add Authorization
            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy =>
                    policy.RequireRole("Admin"));

                options.AddPolicy(
                    "ModeratorOrAdmin",
                    policy => policy.RequireRole("Admin", "Moderator"));

                // Policy-based authorization example
                options.AddPolicy("MustBeActiveUser", policy =>
                    policy.RequireAuthenticatedUser()
                          .RequireClaim("isActive", "True"));

                // Advanced policy with custom requirement (placeholder)
                options.AddPolicy("AtLeast18", policy =>
                    policy.RequireClaim("Age", "18", "19", "20", "21")); // Simplified for demo
            });

            // Add HttpClient for external services
            services.AddHttpClient();

            // Add SignalR for real-time features
            services.AddSignalR();

            // Add Communication Services
            services.AddScoped<INotificationService, NotificationService>();

            return services;
        }

        public static IServiceCollection AddSwaggerServices(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc(
                    "v1",
                    new Microsoft.OpenApi.Models.OpenApiInfo
                    {
                        Title = "Community Car API",
                        Version = "v1",
                        Description = "A robust API for the Community Car platform, featuring AI-powered agents, real-time communications, and secure identity management.",
                        Contact = new Microsoft.OpenApi.Models.OpenApiContact
                        {
                            Name = "Community Car Team",
                            Email = "support@communitycar.com"
                        },
                        License = new Microsoft.OpenApi.Models.OpenApiLicense
                        {
                            Name = "MIT",
                            Url = new Uri("https://opensource.org/licenses/MIT")
                        }
                    });

                // Use full type names for schema IDs to avoid naming conflicts
                options.CustomSchemaIds(type => type.FullName);

                // Add JWT authentication to Swagger
                options.AddSecurityDefinition(
                    "Bearer",
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                    {
                        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                        Name = "Authorization",
                        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                        Scheme = "Bearer",
                        BearerFormat = "JWT"
                    });

                options.AddSecurityRequirement(
                    new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                    {
                        {
                            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                            {
                                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                                {
                                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                    Id = "Bearer",
                                }
                            },
                            Array.Empty<string>()
                        },
                    });

                // Add XSRF Token support to Swagger UI (optional but helpful if Swagger tests need it)
                options.AddSecurityDefinition("XSRF-TOKEN", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Description = "Anti-forgery token header",
                    Name = "X-XSRF-TOKEN",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
                });
            });

            return services;
        }
    }
}