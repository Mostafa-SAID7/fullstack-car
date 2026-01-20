using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Application.Features.Identity.Auth.Interfaces;
using Application.Features.Identity.Auth.Services;

namespace Infrastructure.Extensions
{
    public static class IdentityExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
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

            // Core Identity Services that exist
            services.AddScoped<Application.Features.Identity.Auth.Interfaces.IAuthenticationService, Application.Features.Identity.Auth.Services.AuthenticationService>();
            services.AddScoped<IOAuthService, OAuthService>();

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

            return services;
        }
    }
}
