using System.Security.Claims;

namespace Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Add DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection")));

            // Add Repositories
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();

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
            services.AddScoped<IAuthenticationService, AuthenticationService>();
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
            services.Configure<CacheSettings>(configuration.GetSection("CacheSettings"));
            services.AddMemoryCache(options =>
            {
                var cacheSettings = configuration.GetSection("CacheSettings").Get<CacheSettings>() ?? new CacheSettings();
                options.SizeLimit = cacheSettings.MaxMemoryCacheSize * 1024 * 1024; // Convert MB to bytes
                options.CompactionPercentage = cacheSettings.CompactionPercentage / 100.0;
                options.ExpirationScanFrequency = TimeSpan.FromSeconds(cacheSettings.ScanFrequencySeconds);
            });

            var cacheSettings = configuration.GetSection("CacheSettings").Get<CacheSettings>() ?? new CacheSettings();
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
            services.AddScoped<ICacheManagerService, CacheManagerService>();
            services.AddSingleton<IResponseCachingPolicyService, ResponseCachingPolicyService>();

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

            // AI Agent Service
            services.AddHttpClient<IAIAgentService, Application.Features.AIAgent.Services.AIAgentService>();

            // Add Database Seeder & Individual Seeders
            services.AddScoped<DatabaseSeeder>();
            services.AddScoped<IdentitySeeder>();
            services.AddScoped<CommunitySeeder>();
            services.AddScoped<GroupsSeeder>();
            services.AddScoped<PostsSeeder>();
            services.AddScoped<ReviewsSeeder>();
            services.AddScoped<SocialSeeder>();
            services.AddScoped<GuidesSeeder>();
            services.AddScoped<SharedSeeder>();
            services.AddScoped<AnalyticsSeeder>();

            return services;
        }
    }
}