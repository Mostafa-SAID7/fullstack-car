using WebAPI.Hubs;
using WebAPI.Hubs.Shared;
using WebAPI.Extensions;
using WebAPI.Middleware;
using Infrastructure.Data.Seeds;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

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

app.UseResponseCaching();
app.UseOutputCache();

app.UseCors("AllowAngularApp");

app.UseMiddleware<AntiforgeryMiddleware>();

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
// ...

app.MapHub<NotificationHub>("/hubs/notifications");
app.MapHub<ChatHub>("/hubs/chat");

// Initialize and seed database
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.InitializeAsync();
    await seeder.SeedAsync();
}

app.Run();