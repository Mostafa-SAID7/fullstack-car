using Infrastructure.Hubs;
using WebAPI.Hubs.Shared;
using WebAPI.Extensions;
using WebAPI.Middleware;
using Infrastructure.Data.Seeds;
using Infrastructure.Data;
using Microsoft.Extensions.Options;
using Serilog;
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

    // Configure Host Options to handle background service exceptions gracefully
    builder.Services.Configure<HostOptions>(options =>
    {
        options.BackgroundServiceExceptionBehavior = BackgroundServiceExceptionBehavior.Ignore;
        options.ServicesStartConcurrently = true;
        options.ServicesStopConcurrently = true;
    });

    // Add Application Insights
    if (!string.IsNullOrEmpty(builder.Configuration.GetConnectionString("ApplicationInsights")))
    {
        builder.Services.AddApplicationInsightsTelemetry(builder.Configuration);
    }

    // Add services to the container
    builder.Services.AddWebAPIServices(builder.Configuration);
    builder.Services.AddSwaggerServices();

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
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Identity API (v1)");
        c.SwaggerEndpoint("/swagger/v2/swagger.json", "Community API (v2)");
        c.SwaggerEndpoint("/swagger/v3/swagger.json", "Admin API (v3)");
        c.SwaggerEndpoint("/swagger/v4/swagger.json", "Shared API (v4)");
        c.SwaggerEndpoint("/swagger/v6/swagger.json", "Marketplace API (v6)");
        c.SwaggerEndpoint("/swagger/v7/swagger.json", "Media API (v7)");
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

    app.UseResponseCaching();
    app.UseOutputCache();

    app.UseCors("AllowAngularApp");
    app.UseRouting();

    // Add custom middleware
    app.UseGlobalExceptionHandler(); // Add global exception handler first
    
    if (app.Environment.IsDevelopment())
    {
        app.UseMiddleware<RequestLoggingMiddleware>();
    }

    // Add JWT validation middleware
    app.UseMiddleware<JwtValidationMiddleware>();

    app.UseAuthentication();
    app.UseAuthorization();

    // Enhanced Culture Detection Middleware (after authentication so user preferences work)
    app.UseMiddleware<CultureDetectionMiddleware>();

    app.MapControllers();

    // Add SignalR hubs
    app.MapHub<NotificationHub>("/hubs/notificationHub");
    app.MapHub<ChatHub>("/hubs/chat");
    app.MapHub<QAHub>("/hubs/qa");
    app.MapHub<GroupHub>("/hubs/groups");
    app.MapHub<EventHub>("/hubs/events");

    // Initialize and seed database (skip for Testing environment)
    if (!app.Environment.IsEnvironment("Testing"))
    {
        using (var scope = app.Services.CreateScope())
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Application starting - Version: {Version}", Assembly.GetExecutingAssembly().GetName().Version?.ToString());

            try
            {
                // First, try to ensure the database exists
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                
                // Test database connectivity
                var canConnect = await context.Database.CanConnectAsync();
                if (!canConnect)
                {
                    logger.LogWarning("Cannot connect to database. Attempting to create database...");
                    await context.Database.EnsureCreatedAsync();
                }

                var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
                await seeder.InitializeAsync();
                logger.LogInformation("Database initialized successfully");
                
                // Check if seeding is requested via command line argument
                if (args.Contains("--seed-database"))
                {
                    logger.LogInformation("Database seeding requested via command line argument");
                    await seeder.SeedAsync();
                    logger.LogInformation("Database seeding completed successfully");
                    
                    // Exit after seeding if requested via command line (but not during testing)
                    if (!app.Environment.IsEnvironment("Testing"))
                    {
                        logger.LogInformation("Seeding completed. Exiting application.");
                        return;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during database initialization and seeding");
                
                // If seeding was specifically requested, exit with error (but not during testing)
                if (args.Contains("--seed-database") && !app.Environment.IsEnvironment("Testing"))
                {
                    logger.LogError("Database seeding failed. Exiting with error code 1.");
                    Environment.Exit(1);
                }
                
                // Otherwise, continue with app startup
                logger.LogWarning("Continuing with application startup despite database setup errors");
            }

            logger.LogInformation("Database setup completed - Environment: {Environment}", app.Environment.EnvironmentName);
        }
    }
    else
    {
        // For Testing environment, just log that we're starting
        using (var scope = app.Services.CreateScope())
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Application starting in Testing environment - Version: {Version}", Assembly.GetExecutingAssembly().GetName().Version?.ToString());
            logger.LogInformation("Skipping database initialization for Testing environment");
        }
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

// Make Program class accessible for testing
public partial class Program { }
