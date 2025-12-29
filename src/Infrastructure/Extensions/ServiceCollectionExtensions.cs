using Infrastructure.Data;
using Infrastructure.Repositories;
using Infrastructure.Services.Identity;
using Infrastructure.Services.Localization;
using Infrastructure.Services.Communication;
using Infrastructure.Services.Storage;
using Infrastructure.Services.Caching;
using Infrastructure.Common;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Domain.Interfaces;
using Application.Common.Interfaces.Identity;
using Application.Common.Interfaces.Localization;
using Application.Common.Interfaces.Communication;
using Application.Common.Interfaces.Storage;
using Application.Common.Interfaces.Caching;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

            // Add Identity
            services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;

                options.User.RequireUniqueEmail = true;

                options.SignIn.RequireConfirmedEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // Infrastructure Services
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();

            // Localization Services
            services.AddScoped<ILocalizationProvider, LocalizationProvider>();
            services.AddScoped<ILanguageDetector, LanguageDetector>();
            services.AddScoped<ICultureInfoProvider, CultureInfoProvider>();

            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IFileService, FileService>();

            // Caching Services
            services.Configure<CacheSettings>(configuration.GetSection("CacheSettings"));
            services.AddMemoryCache();

            var cacheSettings = configuration.GetSection("CacheSettings").Get<CacheSettings>() ?? new CacheSettings();
            if (cacheSettings.Enabled && cacheSettings.UseRedis)
            {
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = cacheSettings.RedisConnectionString;
                });
            }
            else
            {
                services.AddDistributedMemoryCache();
            }

            services.AddSingleton<ICacheService, CacheService>();

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
                    RoleClaimType = "role" // Ensure role claims are correctly mapped
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
            });

            return services;
        }
    }
}