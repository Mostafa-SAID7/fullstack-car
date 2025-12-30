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
            services.AddScoped<IChatNotificationService, ChatNotificationService>();

            // Add API Versioning
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new Asp.Versioning.ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
                options.ApiVersionReader = new Asp.Versioning.UrlSegmentApiVersionReader();
            })
            .AddMvc()
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

            return services;
        }

        public static IServiceCollection AddSwaggerServices(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                // Defined versions
                var versions = new[]
                {
                    new { Version = "v1", Title = "Identity API (v1)" },
                    new { Version = "v2", Title = "Community API (v2)" },
                    new { Version = "v3", Title = "Admin API (v3)" },
                    new { Version = "v4", Title = "Shared API (v4)" },
                    new { Version = "v5", Title = "AI Agent API (v5)" }
                };

                foreach (var v in versions)
                {
                    options.SwaggerDoc(v.Version, new Microsoft.OpenApi.Models.OpenApiInfo
                    {
                        Title = v.Title,
                        Version = v.Version,
                        Description = $"Community Car API - {v.Title}",
                    });
                }

                // Use simple type names for schema IDs for cleaner Swagger documentation
                options.CustomSchemaIds(type => type.Name);

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