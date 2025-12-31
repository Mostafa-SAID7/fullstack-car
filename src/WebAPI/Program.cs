using WebAPI.Hubs;
using WebAPI.Hubs.Shared;
using WebAPI.Extensions;
using WebAPI.Middleware;
using Infrastructure.Data.Seeds;
using Application.Features.Shared.Caching.Services;
using Application.Features.Shared.Logging.Services;
using Application.Features.Shared.Logging.Interfaces;
using Microsoft.Extensions.Options;
using Serilog;
using NLog.Web;
using System.Reflection;

try
{
    Log.Information("Starting Community Car API");

    var builder = WebApplication.CreateBuilder(args);

    // Configure Serilog
    Log.Logger = new LoggerConfiguration()
        .ReadFrom.Configuration(builder.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithMachineName()
        .Enrich.WithProcessId()
        .Enrich.WithThreadId()
        .CreateLogger();

    // Configure logging
    builder.Host.UseSerilog();
    builder.Host.UseNLog();

    // Add Application Insights
    if (!string.IsNullOrEmpty(builder.Configuration.GetConnectionString("ApplicationInsights")))
    {
        builder.Services.AddApplicationInsightsTelemetry(builder.Configuration);
    }

    // Add services to the container
    builder.Services.AddWebAPIServices(builder.Configuration);
    builder.Services.AddSwaggerServices();

    // Register advanced logging services
    builder.Services.AddScoped(typeof(IAdvancedLogger<>), typeof(AdvancedLogger<>));

    // Configure Localization
    builder.Services.Configure<RequestLocalizationOptions>(options =>
    {
        var localizationSettings = builder.Configuration.GetSection("Localization");
        var defaultCulture = localizationSettings["DefaultRequestCulture"] ?? "en-US";
        var supportedCultures = localizationSettings.GetSection("SupportedCultures").Get<string[]>() ?? new[] { "en-US" };

        options.SetDefaultCulture(defaultCulture)
               .AddSupportedCultures(supportedCultures)
               .AddSupportedUICultures(supportedCultures);

        options.FallBackToParentCultures = true;
        options.FallBackToParentUICultures = true;
    });

    var app = builder.Build();

    // Configure the HTTP request pipeline
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Identity (v1)");
        c.SwaggerEndpoint("/swagger/v2/swagger.json", "Community (v2)");
        c.SwaggerEndpoint("/swagger/v3/swagger.json", "Admin (v3)");
        c.SwaggerEndpoint("/swagger/v4/swagger.json", "Shared (v4)");
        c.SwaggerEndpoint("/swagger/v5/swagger.json", "AI Agent (v5)");
        c.RoutePrefix = string.Empty;
        c.InjectStylesheet("/swagger-ui/custom.css");
    });

    if (!app.Environment.IsDevelopment())
    {
        app.UseHsts();
    }

    app.UseStaticFiles();
    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }

    // Add advanced logging middleware
    app.UseMiddleware<AdvancedLoggingMiddleware>();

    app.UseResponseCaching();

    // Configure output caching with custom policy
    app.UseOutputCache();

    // Add custom caching middleware
    app.Use(async (context, next) =>
    {
        var policyService = context.RequestServices.GetService<IResponseCachingPolicyService>();
        if (policyService?.ShouldCacheResponse(context) == true)
        {
            var duration = policyService.GetCacheDuration(context);
            var varyByHeaders = policyService.GetVaryByHeaders(context);
            var varyByQueryKeys = policyService.GetVaryByQueryKeys(context);

            context.Response.Headers.CacheControl = $"public, max-age={duration.TotalSeconds}";
            
            if (varyByHeaders.Any())
            {
                context.Response.Headers.Vary = string.Join(", ", varyByHeaders);
            }
        }
        
        await next();
    });

    app.UseCors("AllowAngularApp");

    app.UseMiddleware<AntiforgeryMiddleware>();

    // Add custom middleware
    if (app.Environment.IsDevelopment())
    {
        app.UseMiddleware<RequestLoggingMiddleware>();
    }

    // Add cache invalidation middleware
    app.UseMiddleware<CacheInvalidationMiddleware>();

    // Localization Middleware
    var localizationOptions = app.Services.GetService<IOptions<RequestLocalizationOptions>>();
    if (localizationOptions != null)
    {
        app.UseRequestLocalization(localizationOptions.Value);
    }

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    // Add SignalR hubs
    app.MapHub<NotificationHub>("/hubs/notifications");
    app.MapHub<ChatHub>("/hubs/chat");

    // Initialize and seed database
    using (var scope = app.Services.CreateScope())
    {
        var logger = scope.ServiceProvider.GetRequiredService<IAdvancedLogger<Program>>();
        logger.LogSystemHealth("Application", "Starting", new { Version = Assembly.GetExecutingAssembly().GetName().Version?.ToString() });

        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
        await seeder.InitializeAsync();
        await seeder.SeedAsync();

        logger.LogSystemHealth("Database", "Initialized", new { Environment = app.Environment.EnvironmentName });
    }

    Log.Information("Community Car API started successfully");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}