using Application.Common.Interfaces;
using Application.Features.Identity.Auth.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Identity.Core.Services;
using Application.Features.Identity.Security.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Shared.Caching.Services;
using Application.Features.Shared.Email.Interfaces;
using Application.Features.Shared.Email.Services;
using Application.Features.Shared.Notifications.Interfaces;
using Application.Features.Shared.Notifications.Services;
using Application.Features.Shared.Storage.Interfaces;
using Application.Features.Shared.Storage.Services;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Localization.Services;
using Application.Features.Admin.Analytics.Interfaces;
using Application.Features.Admin.Analytics.Services;
using Application.Features.Identity.Auth.Services;
using Application.Features.Identity.OAuth.Interfaces;
using Application.Features.Identity.Auth.Services;
using Application.Features.Community.QA.Interfaces;
using Application.Features.Media.Analytics.Services;
using Application.Features.Community.QA.Services;
using Infrastructure.Services.Analytics;
using Infrastructure.Services.QA;
using Application.Features.Identity.Profile.Interfaces;
using Application.Features.Identity.Profile.Services;
using Application.Features.Identity.Password.Interfaces;
using Application.Features.Identity.Password.Services;
using Application.Features.Identity.Security.Services;
using Application.Features.Media.Shared.Interfaces;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Data.Seeds;
using Infrastructure.Data.Seeds.Management;
using Infrastructure.Data.Seeds.Management.Users;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Media;
using Infrastructure.Common;
using Infrastructure.Services.FileStorage;
using Infrastructure.Services;
using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Shared.Logging.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using AspNet.Security.OAuth.GitHub;
using StackExchange.Redis;
using System.Text;
using System.Security.Claims;
using Amazon.S3;
using Amazon;

namespace Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Add DbContext
            // Add DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

            // Add Repositories
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

            // Add Media Repositories
            services.AddScoped<IVideoRepository, VideoRepository>();
            services.AddScoped<IPodcastRepository, PodcastRepository>();
            services.AddScoped<IMediaAnalyticsRepository, MediaAnalyticsRepository>();

            // Add Identity with custom entities
            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;

                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = true;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // Core Identity Services
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();

            // Organized Identity Services
            services.AddScoped<Application.Features.Identity.Auth.Interfaces.IAuthenticationService, Application.Features.Identity.Auth.Services.AuthenticationService>();
            services.AddScoped<IOAuthService, OAuthService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IPasswordService, PasswordService>();
            services.AddScoped<ISecurityService, SecurityService>();

            // Localization Services
            services.AddScoped<ILocalizationProvider, LocalizationProvider>();
            services.AddScoped<ILanguageDetector, LanguageDetector>();
            services.AddScoped<ICultureInfoProvider, CultureInfoProvider>();

            services.AddScoped<Application.Features.Shared.Email.Interfaces.IEmailService, EmailService>();
            services.AddScoped<IFileService, FileService>();

            // Analytics Services
            services.Configure<AnalyticsSettings>(configuration.GetSection("AnalyticsSettings"));
            services.AddScoped<IUserAnalyticsService, UserAnalyticsService>();
            services.AddScoped<IContentAnalyticsService, ContentAnalyticsService>();
            services.AddScoped<IEngagementAnalyticsService, EngagementAnalyticsService>();
            services.AddScoped<ISystemAnalyticsService, SystemAnalyticsService>();
            services.AddScoped<ISecurityAnalyticsService, SecurityAnalyticsService>();
            services.AddScoped<IPerformanceAnalyticsService, PerformanceAnalyticsService>();
            services.AddScoped<IAnalyticsService, AnalyticsService>();

            // Caching Services
            services.Configure<Application.Features.Shared.Caching.Models.CacheSettings>(configuration.GetSection("CacheSettings"));
            services.AddMemoryCache(options =>
            {
                var cacheSettings = configuration.GetSection("CacheSettings").Get<Application.Features.Shared.Caching.Models.CacheSettings>() ?? new Application.Features.Shared.Caching.Models.CacheSettings();
                options.SizeLimit = cacheSettings.MaxMemoryCacheSize * 1024 * 1024; // Convert MB to bytes
                options.CompactionPercentage = cacheSettings.CompactionPercentage / 100.0;
                options.ExpirationScanFrequency = TimeSpan.FromSeconds(cacheSettings.ScanFrequencySeconds);
            });

            var cacheSettings = configuration.GetSection("CacheSettings").Get<Application.Features.Shared.Caching.Models.CacheSettings>() ?? new Application.Features.Shared.Caching.Models.CacheSettings();
            if (cacheSettings.Enabled && cacheSettings.UseRedis)
            {
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = cacheSettings.RedisConnectionString;
                    options.InstanceName = cacheSettings.RedisKeyPrefix;
                });

                // Add Redis connection for advanced operations
                services.AddSingleton<IConnectionMultiplexer>(provider =>
                {
                    var connectionString = cacheSettings.RedisConnectionString;
                    var configuration = ConfigurationOptions.Parse(connectionString);
                    configuration.ConnectTimeout = cacheSettings.RedisConnectTimeout;
                    configuration.CommandMap = CommandMap.Create(new HashSet<string> { "INFO", "CONFIG", "CLUSTER", "PING", "ECHO", "CLIENT" }, available: false);
                    return ConnectionMultiplexer.Connect(configuration);
                });
            }
            else
            {
                services.AddDistributedMemoryCache();
            }

            // Register caching services
            services.AddSingleton<ICacheKeyBuilder, CacheKeyBuilder>();
            services.AddSingleton<ICacheService, CacheService>();
            services.AddSingleton<IAdvancedCacheService, AdvancedCacheService>();
            services.AddSingleton<ICacheInvalidationStrategy, CacheInvalidationStrategy>();

            // Logging Services
            services.AddTransient(typeof(IAppLogger<>), typeof(AppLogger<>));

            // Add JWT Authentication
            var secret = configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
            var issuer = configuration["JwtSettings:Issuer"] ?? "CommunityCar";
            var audience = configuration["JwtSettings:Audience"] ?? "CommunityCar";

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = configuration.GetValue<bool>("JwtSettings:RequireHttpsMetadata", true);
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                    ClockSkew = TimeSpan.Zero,
                    RoleClaimType = "role"
                };
            })
            .AddGoogle(options =>
            {
                options.ClientId = configuration["Authentication:Google:ClientId"] ?? "placeholder";
                options.ClientSecret = configuration["Authentication:Google:ClientSecret"] ?? "placeholder";
            })
            .AddGitHub(options =>
            {
                options.ClientId = configuration["Authentication:GitHub:ClientId"] ?? "placeholder";
                options.ClientSecret = configuration["Authentication:GitHub:ClientSecret"] ?? "placeholder";
                options.Scope.Add("user:email");
            })
            .AddFacebook(options =>
            {
                options.ClientId = configuration["Authentication:Facebook:ClientId"] ?? "placeholder";
                options.ClientSecret = configuration["Authentication:Facebook:ClientSecret"] ?? "placeholder";
                options.Scope.Add("email");
                options.Fields.Add("name");
                options.Fields.Add("email");
            });

            // Media Services
            services.AddScoped<Application.Features.Media.Shared.Interfaces.IMediaService, Application.Features.Media.Shared.Services.MediaService>();

            // QA Services
            services.Configure<QASearchOptions>(configuration.GetSection(QASearchOptions.SectionName));
            services.Configure<DuplicatePreventionOptions>(configuration.GetSection(DuplicatePreventionOptions.SectionName));
            services.AddScoped<IContentQualityService, ContentQualityService>();
            services.AddScoped<IQAService, QAService>();
            services.AddScoped<IQASearchService, QASearchService>();
            services.AddScoped<IDuplicatePreventionService, DuplicatePreventionService>();
            services.AddScoped<IReputationService, ReputationService>();
            services.AddSingleton<IQAHubService, QAHubService>();
            services.AddSingleton<IQAConnectionManager, QAConnectionManager>();
            services.AddHostedService<QAConnectionManager>(provider => 
                (QAConnectionManager)provider.GetRequiredService<IQAConnectionManager>());
            services.AddScoped<IExpertService, ExpertService>();
            
            // QA Health Monitoring Services
            services.AddScoped<IQAHealthMonitoringService, QAHealthMonitoringService>();
            services.AddScoped<IQAAlertService, QAAlertService>();
            services.AddScoped<IQAUserSatisfactionService, QAUserSatisfactionService>();
            services.AddHostedService<QAHealthMonitorBackgroundService>();
            
            // QA Performance Optimization Services
            services.Configure<QAPerformanceOptions>(configuration.GetSection(QAPerformanceOptions.SectionName));
            services.Configure<QAConnectionOptions>(configuration.GetSection(QAConnectionOptions.SectionName));
            services.Configure<QASearchPerformanceOptions>(configuration.GetSection(QASearchPerformanceOptions.SectionName));
            services.Configure<QACdnOptions>(configuration.GetSection(QACdnOptions.SectionName));
            services.Configure<QAStaticAssetOptions>(configuration.GetSection(QAStaticAssetOptions.SectionName));
            services.Configure<QAPerformanceMonitoringOptions>(configuration.GetSection(QAPerformanceMonitoringOptions.SectionName));
            
            services.AddScoped<IQAQueryOptimizationService, QAQueryOptimizationService>();
            services.AddScoped<IQAConnectionOptimizationService, QAConnectionOptimizationService>();
            services.AddScoped<IQASearchOptimizationService, QASearchOptimizationService>();
            services.AddScoped<IQACdnOptimizationService, QACdnOptimizationService>();
            services.AddScoped<IQAStaticAssetOptimizationService, QAStaticAssetOptimizationService>();
            services.AddHostedService<QAPerformanceMonitoringService>();
            
            // Domain Services
            services.AddScoped<Domain.Services.IExpertIdentificationService, Domain.Services.ExpertIdentificationService>();
            services.AddScoped<Domain.Services.IReputationService, Domain.Services.ReputationDomainService>();

            // File Storage Configuration
            services.Configure<FileStorageSettings>(configuration.GetSection(FileStorageSettings.SectionName));
            
            // File Storage Services
            services.AddScoped<LocalFileStorageService>();
            services.AddScoped<AzureBlobStorageService>();
            services.AddScoped<AmazonS3StorageService>();
            services.AddScoped<FileStorageFactory>();
            services.AddScoped<IMediaFileStorageService, MediaFileStorageServiceWrapper>();
            services.AddScoped<IFileValidationService, FileValidationService>();
            services.AddScoped<IThumbnailService, ThumbnailService>();
            services.AddScoped<ICdnService, CdnService>();

            // Amazon S3 Client (if using S3)
            var fileStorageSettings = configuration.GetSection(FileStorageSettings.SectionName).Get<FileStorageSettings>();
            if (fileStorageSettings?.Provider?.ToLowerInvariant() == "amazons3" && fileStorageSettings.AmazonS3 != null)
            {
                services.AddScoped<IAmazonS3>(provider =>
                {
                    var config = new AmazonS3Config
                    {
                        RegionEndpoint = RegionEndpoint.GetBySystemName(fileStorageSettings.AmazonS3.Region ?? "us-east-1")
                    };

                    if (!string.IsNullOrEmpty(fileStorageSettings.AmazonS3.AccessKey) && 
                        !string.IsNullOrEmpty(fileStorageSettings.AmazonS3.SecretKey))
                    {
                        return new AmazonS3Client(fileStorageSettings.AmazonS3.AccessKey, fileStorageSettings.AmazonS3.SecretKey, config);
                    }
                    else
                    {
                        return new AmazonS3Client(config); // Use default credentials
                    }
                });
            }
            else
            {
                // Register a dummy S3 client for dependency injection when not using S3
                services.AddScoped<IAmazonS3>(provider => null!);
            }

            // HTTP Client for CDN operations
            services.AddHttpClient<CdnService>();

            // Add Database Seeding Services
            services.AddScoped<IdentitySeeder>();
            services.AddScoped<CommunitySocialSeeder>();
            services.AddScoped<CommunityContentSeeder>();
            services.AddScoped<CommunityKnowledgeSeeder>();
            services.AddScoped<CommunityMapsSeeder>();
            services.AddScoped<MarketplaceSeeder>();
            services.AddScoped<AdminSeeder>();
            services.AddScoped<NotificationSeeder>();
            services.AddScoped<MediaSeeder>();
            services.AddScoped<QASeedDataService>();
            
            // Management Seeders
            services.AddScoped<UserManagementSeeder>();
            services.AddScoped<UserRolesSeeder>();
            services.AddScoped<UserPermissionsSeeder>();
            services.AddScoped<ManagementSeeder>();
            
            services.AddScoped<DatabaseSeeder>();

            // Register analytics services
            services.AddScoped<IMediaAnalyticsService, MediaAnalyticsService>();

            // Register background services
            services.AddHostedService<RefreshTokenCleanupService>();
            services.AddHostedService<AnalyticsAggregationService>();
            services.AddHostedService<AnalyticsValidationService>();

            return services;
        }
    }
}
