using Infrastructure.Extensions;
using Application.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebAPI.Filters;
using Application.Features.Shared.Chat.Interfaces;
using Application.Features.Shared.Chat.Services;
using Application.Features.Shared.Notifications.Services;
using Application.Features.Shared.Caching.Services;
using Infrastructure.Common;

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

            // Add Response Caching with advanced configuration
            services.AddResponseCaching(options =>
            {
                options.MaximumBodySize = 64 * 1024 * 1024; // 64MB
                options.UseCaseSensitivePaths = false;
            });

            // Add Output Caching with custom policies
            services.AddOutputCache(options =>
            {
                var cacheSettings = configuration.GetSection("CacheSettings").Get<CacheSettings>() ?? new CacheSettings();
                
                options.DefaultExpirationTimeSpan = TimeSpan.FromSeconds(cacheSettings.OutputCacheDefaultExpiration);
                options.MaximumBodySize = 64 * 1024 * 1024; // 64MB
                options.UseCaseSensitivePaths = false;

                // Add named policies
                options.AddPolicy("ShortCache", builder => 
                    builder.Expire(TimeSpan.FromMinutes(1)));
                
                options.AddPolicy("MediumCache", builder => 
                    builder.Expire(TimeSpan.FromMinutes(5)));
                
                options.AddPolicy("LongCache", builder => 
                    builder.Expire(TimeSpan.FromMinutes(30)));

                options.AddPolicy("UserSpecific", builder => 
                    builder.Expire(TimeSpan.FromMinutes(5))
                           .VaryByValue(context => new KeyValuePair<string, string>("Authorization", context.Request.Headers["Authorization"].ToString())));

                options.AddPolicy("LocalizationCache", builder => 
                    builder.Expire(TimeSpan.FromHours(1))
                           .VaryByValue(context => new KeyValuePair<string, string>("Accept-Language", context.Request.Headers["Accept-Language"].ToString())));
            });

            // Register caching policy services (commented out - missing implementations)
            // services.AddSingleton<IResponseCachingPolicyService, ResponseCachingPolicyService>();
            // services.AddSingleton<CustomOutputCachePolicy>();

            // Add HttpContextAccessor for CurrentUserService
            services.AddHttpContextAccessor();

            // CORS: Allow all origins for development and production
            services.AddCors(options =>
            {
                options.AddPolicy(
                    "AllowAngularApp",
                    policy =>
                    {
                        policy.SetIsOriginAllowed(_ => true) // Allow all origins
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
            services.AddScoped<Application.Features.Shared.Notifications.Interfaces.INotificationService, Application.Features.Shared.Notifications.Services.NotificationService>();
            services.AddScoped<Application.Features.Shared.Chat.Interfaces.IChatNotificationService, Application.Features.Shared.Chat.Services.ChatNotificationService>();

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
                    new { Version = "v6", Title = "Marketplace API (v6)" },
                    new { Version = "v7", Title = "Media API (v7)" }
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

                // Use full type names for schema IDs to avoid conflicts
                options.CustomSchemaIds(type => type.FullName?.Replace("+", "."));

                // Resolve conflicting actions by preferring the more specific controller
                options.ResolveConflictingActions(apiDescriptions =>
                {
                    // Prefer controllers with more specific routes (longer paths)
                    return apiDescriptions.OrderByDescending(x => x.RelativePath?.Length ?? 0).First();
                });

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