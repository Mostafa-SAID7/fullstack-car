using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Infrastructure.Data.Seeds;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("🚀 Testing Entity-Based Database Seeding...");

        try
        {
            var host = Host.CreateDefaultBuilder(args)
                .ConfigureServices((context, services) =>
                {
                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseSqlServer("Server=localhost;Database=CCarDb;Trusted_Connection=true;TrustServerCertificate=true;"));

                    services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
                    {
                        options.Password.RequireDigit = false;
                        options.Password.RequireLowercase = false;
                        options.Password.RequireNonAlphanumeric = false;
                        options.Password.RequireUppercase = false;
                        options.Password.RequiredLength = 6;
                        options.User.RequireUniqueEmail = true;
                    })
                    .AddEntityFrameworkStores<ApplicationDbContext>()
                    .AddDefaultTokenProviders();

                    services.AddScoped<DatabaseSeeder>();
                    services.AddLogging(builder => builder.AddConsole().SetMinimumLevel(LogLevel.Information));
                })
                .Build();

            using var scope = host.Services.CreateScope();
            var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();

            Console.WriteLine("Initializing database...");
            await seeder.InitializeAsync();

            Console.WriteLine("Seeding database...");
            await seeder.SeedAsync();

            Console.WriteLine("✅ Seeding completed successfully!");

            // Show results
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var userCount = await context.Users.CountAsync();
            var groupCount = await context.Groups.CountAsync();
            var postCount = await context.Posts.CountAsync();
            var commentCount = await context.Comments.CountAsync();
            var notificationCount = await context.Notifications.CountAsync();

            Console.WriteLine($"\n📊 Results:");
            Console.WriteLine($"Users: {userCount}");
            Console.WriteLine($"Groups: {groupCount}");
            Console.WriteLine($"Posts: {postCount}");
            Console.WriteLine($"Comments: {commentCount}");
            Console.WriteLine($"Notifications: {notificationCount}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
}