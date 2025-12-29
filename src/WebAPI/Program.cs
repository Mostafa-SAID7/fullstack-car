using WebAPI.Hubs;
using WebAPI.Extensions;
using WebAPI.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddWebAPIServices(builder.Configuration);
builder.Services.AddSwaggerServices();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Community Car API V1");
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
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();