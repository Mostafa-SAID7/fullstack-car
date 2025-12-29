using WebAPI.Hubs;
using WebAPI.Hubs.Shared;
using WebAPI.Extensions;
using WebAPI.Middleware;
using Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddWebAPIServices(builder.Configuration);
builder.Services.AddSwaggerServices();

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
});

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseResponseCaching();
app.UseOutputCache();

app.UseCors("AllowAngularApp");

app.UseMiddleware<AntiforgeryMiddleware>();

// Add custom middleware
if (app.Environment.IsDevelopment())
{
    app.UseMiddleware<RequestLoggingMiddleware>();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Add SignalR hubs
// ...

app.MapHub<NotificationHub>("/hubs/notifications");
app.MapHub<ChatHub>("/hubs/chat");

using (var scope = app.Services.CreateScope())
{
    var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
    await initialiser.InitialiseAsync();
    await initialiser.SeedAsync();
}

app.Run();