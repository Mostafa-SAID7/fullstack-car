using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Hosting;
using Infrastructure.Data.Seeds;
using Application.Common.Interfaces.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Text.Json;

namespace WebAPI.IntegrationTests.Core;

public abstract class BaseIntegrationTest : IClassFixture<WebApplicationFactory<Program>>
{
    protected readonly WebApplicationFactory<Program> Factory;
    protected readonly HttpClient Client;
    protected readonly HttpClient UnauthenticatedClient;
    protected readonly string TestUserId = "test-user-id-12345";
    protected readonly string TestAuthToken = "test-token-12345";
    public static readonly Guid TestUserGuid = Guid.Parse("12345678-1234-1234-1234-123456789012");
    public static readonly Guid SecondTestUserGuid = Guid.Parse("87654321-4321-4321-4321-210987654321");

    protected BaseIntegrationTest(WebApplicationFactory<Program> factory)
    {
        Factory = factory.WithWebHostBuilder(builder =>
        {
            // Set environment to Testing to prevent early exit in Program.cs
            builder.UseEnvironment("Testing");
            
            // Use a custom configuration that doesn't include SQL Server
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["ConnectionStrings:DefaultConnection"] = "Data Source=:memory:",
                    ["JwtSettings:Secret"] = "test-secret-key-for-testing-purposes-only-12345",
                    ["JwtSettings:Issuer"] = "TestIssuer",
                    ["JwtSettings:Audience"] = "TestAudience"
                });
            });
            
            builder.ConfigureServices(services =>
            {
                // Remove all Entity Framework related services to avoid conflicts
                var descriptorsToRemove = new List<ServiceDescriptor>();
                
                foreach (var service in services.ToList())
                {
                    // Remove all EF Core services
                    if (service.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                        service.ServiceType == typeof(ApplicationDbContext) ||
                        service.ServiceType == typeof(IApplicationDbContext) ||
                        (service.ServiceType.IsGenericType && service.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>)) ||
                        (service.ImplementationType?.FullName?.Contains("SqlServer") == true) ||
                        (service.ServiceType.FullName?.Contains("SqlServer") == true) ||
                        (service.ServiceType.FullName?.Contains("EntityFramework") == true) ||
                        (service.ServiceType.Name.Contains("DbContext")) ||
                        (service.ImplementationType?.Name.Contains("DbContext") == true))
                    {
                        descriptorsToRemove.Add(service);
                    }
                }

                foreach (var descriptor in descriptorsToRemove)
                {
                    services.Remove(descriptor);
                }

                // Clear any remaining EF Core services
                services.RemoveAll<DbContextOptions>();
                services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
                services.RemoveAll<ApplicationDbContext>();
                services.RemoveAll<IApplicationDbContext>();

                // Remove background services that might cause database conflicts
                services.RemoveAll<Infrastructure.Services.QA.QAPerformanceMonitoringService>();
                services.RemoveAll<Infrastructure.Services.QA.QAHealthMonitorBackgroundService>();
                services.RemoveAll<Infrastructure.Services.QA.QAConnectionManager>();
                services.RemoveAll<Infrastructure.Services.RefreshTokenCleanupService>();
                services.RemoveAll<Infrastructure.Services.Analytics.AnalyticsAggregationService>();
                services.RemoveAll<Infrastructure.Services.Analytics.AnalyticsValidationService>();
                
                // Remove all hosted services to prevent background processing during tests
                var hostedServices = services.Where(s => 
                    typeof(Microsoft.Extensions.Hosting.IHostedService).IsAssignableFrom(s.ServiceType) ||
                    typeof(Microsoft.Extensions.Hosting.BackgroundService).IsAssignableFrom(s.ServiceType ?? s.ImplementationType)
                ).ToList();
                
                foreach (var service in hostedServices)
                {
                    services.Remove(service);
                }

                // Add in-memory database for testing with a fixed name to ensure consistency across requests
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDatabase_Shared");
                    options.EnableSensitiveDataLogging();
                }, ServiceLifetime.Scoped);

                // Re-register the interface
                services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

                // Remove existing authentication services to avoid conflicts
                var authServicesToRemove = services.Where(s => 
                    s.ServiceType == typeof(Microsoft.AspNetCore.Authentication.IAuthenticationService) ||
                    s.ServiceType == typeof(Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider) ||
                    s.ServiceType == typeof(Microsoft.AspNetCore.Authentication.IAuthenticationHandlerProvider)
                ).ToList();

                foreach (var service in authServicesToRemove)
                {
                    services.Remove(service);
                }

                // Add test authentication as the only scheme
                services.AddAuthentication("Test")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>("Test", options => { });
                
                // Set test authentication as default
                services.Configure<AuthenticationOptions>(options =>
                {
                    options.DefaultAuthenticateScheme = "Test";
                    options.DefaultChallengeScheme = "Test";
                    options.DefaultScheme = "Test";
                });
            });
        });
        
        // Authenticated client (default)
        Client = Factory.CreateClient();
        Client.DefaultRequestHeaders.Add("X-Test-Auth", "true");
        
        // Unauthenticated client
        UnauthenticatedClient = Factory.CreateClient();
        
        // Ensure test user exists in database after clients are created
        EnsureTestUserExists();
    }

    /// <summary>
    /// Helper method to deserialize API response data from the standard API wrapper format
    /// </summary>
    protected static T? DeserializeApiResponseData<T>(string responseContent)
    {
        var apiResponse = JsonSerializer.Deserialize<JsonElement>(responseContent, 
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        var dataElement = apiResponse.GetProperty("data");
        return JsonSerializer.Deserialize<T>(dataElement.GetRawText(), 
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    private void EnsureTestUserExists()
    {
        try
        {
            using var scope = Factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            // Ensure database is created for in-memory database
            context.Database.EnsureCreated();
            
            // Initialize QA system tables and seed data
            InitializeQASystemData(context);
            
            // Check if test user already exists
            var existingUser = context.Users.FirstOrDefault(u => u.Id == TestUserGuid);
            if (existingUser == null)
            {
                var testUser = new ApplicationUser
                {
                    Id = TestUserGuid,
                    UserName = "TestUser",
                    Email = "testuser@test.com",
                    EmailConfirmed = true,
                    NormalizedUserName = "TESTUSER",
                    NormalizedEmail = "TESTUSER@TEST.COM",
                    SecurityStamp = Guid.NewGuid().ToString(),
                    ConcurrencyStamp = Guid.NewGuid().ToString(),
                    FirstName = "Test",
                    LastName = "User",
                    IsActive = true,
                    Status = Domain.Enums.Identity.UserStatus.Active,
                    CreatedAt = DateTime.UtcNow
                };
                
                context.Users.Add(testUser);
                
                try
                {
                    context.SaveChanges();
                }
                catch (ArgumentException ex) when (ex.Message.Contains("An item with the same key has already been added"))
                {
                    // User was already created by another test, clear the change tracker and continue
                    context.ChangeTracker.Clear();
                }
            }

            // Check if second test user already exists
            var existingSecondUser = context.Users.FirstOrDefault(u => u.Id == SecondTestUserGuid);
            if (existingSecondUser == null)
            {
                var secondTestUser = new ApplicationUser
                {
                    Id = SecondTestUserGuid,
                    UserName = "SecondTestUser",
                    Email = "secondtestuser@test.com",
                    EmailConfirmed = true,
                    NormalizedUserName = "SECONDTESTUSER",
                    NormalizedEmail = "SECONDTESTUSER@TEST.COM",
                    SecurityStamp = Guid.NewGuid().ToString(),
                    ConcurrencyStamp = Guid.NewGuid().ToString(),
                    FirstName = "Second",
                    LastName = "User",
                    IsActive = true,
                    Status = Domain.Enums.Identity.UserStatus.Active,
                    CreatedAt = DateTime.UtcNow
                };
                
                context.Users.Add(secondTestUser);
                
                try
                {
                    context.SaveChanges();
                }
                catch (ArgumentException ex) when (ex.Message.Contains("An item with the same key has already been added"))
                {
                    // User was already created by another test, clear the change tracker and continue
                    context.ChangeTracker.Clear();
                }
            }
            
            // Check if reputation record already exists for second user
            var existingReputation = context.UserReputations.FirstOrDefault(ur => ur.UserId == SecondTestUserGuid);
            if (existingReputation == null && existingSecondUser == null) // Only add if user was just created
            {
                var secondUserReputation = new Domain.Entities.Community.QA.UserReputation
                {
                    Id = Guid.NewGuid(),
                    UserId = SecondTestUserGuid,
                    ReputationScore = 200, // Sufficient for downvoting
                    QuestionsAsked = 0,
                    AnswersGiven = 0,
                    AcceptedAnswers = 0,
                    UpvotesReceived = 20, // 20 upvotes * 10 points = 200 points
                    DownvotesReceived = 0,
                    BadgesEarned = "[]",
                    ExpertiseAreas = "[]",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                
                context.UserReputations.Add(secondUserReputation);
                
                try
                {
                    context.SaveChanges();
                }
                catch (ArgumentException ex) when (ex.Message.Contains("An item with the same key has already been added"))
                {
                    // Reputation was already created, clear the change tracker and continue
                    context.ChangeTracker.Clear();
                }
            }
        }
        catch (ObjectDisposedException)
        {
            // If the service provider is disposed, we'll create the user later when needed
            // This can happen during test cleanup
        }
        catch (Exception ex)
        {
            // Log the exception but don't fail the test setup
            System.Diagnostics.Debug.WriteLine($"Failed to create test user: {ex.Message}");
        }
    }

    private void InitializeQASystemData(ApplicationDbContext context)
    {
        try
        {
            // Create QA Categories if they don't exist
            if (!context.QACategories.Any())
            {
                var categories = new[]
                {
                    new Domain.Entities.Community.QA.QACategory
                    {
                        Id = Guid.NewGuid(),
                        Name = "Web Development",
                        Description = "Frontend and backend web development questions",
                        IconUrl = "/icons/web-dev.svg",
                        Color = "#3B82F6",
                        QuestionCount = 0,
                        ExpertCount = 0,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Domain.Entities.Community.QA.QACategory
                    {
                        Id = Guid.NewGuid(),
                        Name = "Database Design",
                        Description = "SQL, NoSQL, database architecture and optimization",
                        IconUrl = "/icons/database.svg",
                        Color = "#8B5CF6",
                        QuestionCount = 0,
                        ExpertCount = 0,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Domain.Entities.Community.QA.QACategory
                    {
                        Id = Guid.NewGuid(),
                        Name = "Testing",
                        Description = "Software testing, QA, and test automation",
                        IconUrl = "/icons/testing.svg",
                        Color = "#F59E0B",
                        QuestionCount = 0,
                        ExpertCount = 0,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.QACategories.AddRange(categories);
                context.SaveChanges();
            }

            // Create QA Tags if they don't exist
            if (!context.QATags.Any())
            {
                var webDevCategory = context.QACategories.First(c => c.Name == "Web Development");
                var dbCategory = context.QACategories.First(c => c.Name == "Database Design");
                var testingCategory = context.QACategories.First(c => c.Name == "Testing");

                var tags = new[]
                {
                    new Domain.Entities.Community.QA.QATag
                    {
                        Id = Guid.NewGuid(),
                        Name = "javascript",
                        Description = "JavaScript programming language",
                        UsageCount = 0,
                        CategoryId = webDevCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Domain.Entities.Community.QA.QATag
                    {
                        Id = Guid.NewGuid(),
                        Name = "react",
                        Description = "React.js frontend framework",
                        UsageCount = 0,
                        CategoryId = webDevCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Domain.Entities.Community.QA.QATag
                    {
                        Id = Guid.NewGuid(),
                        Name = "sql-server",
                        Description = "Microsoft SQL Server database",
                        UsageCount = 0,
                        CategoryId = dbCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Domain.Entities.Community.QA.QATag
                    {
                        Id = Guid.NewGuid(),
                        Name = "integration-test",
                        Description = "Integration testing",
                        UsageCount = 0,
                        CategoryId = testingCategory.Id,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.QATags.AddRange(tags);
                context.SaveChanges();
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to initialize QA system data: {ex.Message}");
        }
    }
}

public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Check if this request should be authenticated
        if (Request.Headers.ContainsKey("X-Test-Auth"))
        {
            // Check if a specific user ID is provided
            var userId = WebAPI.IntegrationTests.Core.BaseIntegrationTest.TestUserGuid.ToString(); // Default user
            if (Request.Headers.ContainsKey("X-Test-User-Id"))
            {
                userId = Request.Headers["X-Test-User-Id"].FirstOrDefault() ?? userId;
            }

            var claims = new[]
            {
                new System.Security.Claims.Claim(ClaimTypes.Name, "TestUser"),
                new System.Security.Claims.Claim(ClaimTypes.NameIdentifier, userId)
            };

            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, "Test");

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }

        // Return no result for unauthenticated requests
        return Task.FromResult(AuthenticateResult.NoResult());
    }
}