using WebAPI.Extensions;
using WebAPI.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddWebAPIServices(builder.Configuration);
builder.Services.AddSwaggerServices();

// Add Application and Infrastructure services (these would be defined in respective layers)
// builder.Services.AddApplicationServices();
// builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Community Car API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

// Add custom middleware
if (app.Environment.IsDevelopment())
{
    app.UseMiddleware<RequestLoggingMiddleware>();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Add SignalR hubs
// app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();