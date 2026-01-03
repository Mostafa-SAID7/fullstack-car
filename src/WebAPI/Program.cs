using WebAPI.Hubs;
using WebAPI.Hubs.Shared;
using WebAPI.Extensions;
using WebAPI.Middleware;
using Infrastructure.Data.Seeds;
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
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Identity (v1)");
        c.SwaggerEndpoint("/swagger/v2/swagger.json", "Community (v2)");
        c.SwaggerEndpoint("/swagger/v3/swagger.json", "Admin (v3)");
        c.SwaggerEndpoint("/swagger/v4/swagger.json", "Shared (v4)");
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

    // Add custom middleware
    if (app.Environment.IsDevelopment())
    {
        app.UseMiddleware<RequestLoggingMiddleware>();
    }

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
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Application starting - Version: {Version}", Assembly.GetExecutingAssembly().GetName().Version?.ToString());

        try
        {
            var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
            await seeder.InitializeAsync();
            logger.LogInformation("Database initialized successfully");
            
            // Check if seeding is requested via command line argument
            if (args.Contains("--seed-database"))
            {
                logger.LogInformation("Database seeding requested via command line argument");
                await seeder.SeedAsync();
                logger.LogInformation("Database seeding completed successfully");
                
                // Exit after seeding if requested via command line
                logger.LogInformation("Seeding completed. Exiting application.");
                return;
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during database initialization and seeding");
            
            // If seeding was specifically requested, exit with error
            if (args.Contains("--seed-database"))
            {
                logger.LogError("Database seeding failed. Exiting with error code 1.");
                Environment.Exit(1);
            }
            
            // Otherwise, continue with app startup
            logger.LogWarning("Continuing with application startup despite database setup errors");
        }

        logger.LogInformation("Database setup completed - Environment: {Environment}", app.Environment.EnvironmentName);
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