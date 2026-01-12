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

namespace WebAPI.IntegrationTests;

public abstract class BaseIntegrationTest : IClassFixture<WebApplicationFactory<Program>>
{
    protected readonly WebApplicationFactory<Program> Factory;
    protected readonly HttpClient Client;
    protected readonly HttpClient UnauthenticatedClient;
    protected readonly string TestUserId = "test-user-id-12345";
    protected readonly string TestAuthToken = "test-token-12345";
    public static readonly Guid TestUserGuid = Guid.Parse("12345678-1234-1234-1234-123456789012");

    protected BaseIntegrationTest(WebApplicationFactory<Program> factory)
    {
        Factory = factory.WithWebHostBuilder(builder =>
        {
            // Set environment to Testing to prevent early exit in Program.cs
            builder.UseEnvironment("Testing");
            
            builder.ConfigureServices(services =>
            {
                // Remove Entity Framework SQL Server services
                var descriptorsToRemove = services.Where(d => 
                    d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                    d.ServiceType == typeof(ApplicationDbContext) ||
                    d.ServiceType == typeof(IApplicationDbContext) ||
                    (d.ServiceType.IsGenericType && d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>))
                ).ToList();

                foreach (var descriptor in descriptorsToRemove)
                {
                    services.Remove(descriptor);
                }

                // Add in-memory database for testing
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDatabase_" + Guid.NewGuid().ToString());
                    options.EnableSensitiveDataLogging();
                });

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

                // Clear existing authentication schemes
                services.PostConfigure<AuthenticationOptions>(options =>
                {
                    options.Schemes.Clear();
                });

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

    private void EnsureTestUserExists()
    {
        try
        {
            using var scope = Factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            // Ensure database is created for in-memory database
            context.Database.EnsureCreated();
            
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
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                };
                
                context.Users.Add(testUser);
                context.SaveChanges();
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
            var claims = new[]
            {
                new System.Security.Claims.Claim(ClaimTypes.Name, "TestUser"),
                new System.Security.Claims.Claim(ClaimTypes.NameIdentifier, BaseIntegrationTest.TestUserGuid.ToString()) // Use consistent test user ID
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