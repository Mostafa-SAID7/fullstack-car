using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using WebAPI.IntegrationTests.Core;
using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Data;
using Domain.Entities.Identity;
using System.Security.Claims;

namespace WebAPI.IntegrationTests.Core;

public class CultureDetectionMiddlewareTests : BaseIntegrationTest
{
    public CultureDetectionMiddlewareTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task CultureDetectionMiddleware_ShouldSetDefaultCulture_WhenNoPreferencesProvided()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/v4/shared/localization/languages");

        // Act
        var response = await UnauthenticatedClient.SendAsync(request);

        // Assert
        Assert.True(response.Headers.Contains("X-Culture"));
        Assert.True(response.Headers.Contains("X-Is-RTL"));
        
        var culture = response.Headers.GetValues("X-Culture").FirstOrDefault();
        var isRtl = response.Headers.GetValues("X-Is-RTL").FirstOrDefault();
        
        Assert.Equal("en-US", culture);
        Assert.Equal("false", isRtl);
    }

    [Fact]
    public async Task CultureDetectionMiddleware_ShouldDetectBrowserLanguage_FromAcceptLanguageHeader()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/v4/shared/localization/languages");
        request.Headers.Add("Accept-Language", "ar-EG,ar;q=0.9,en;q=0.8");

        // Act
        var response = await UnauthenticatedClient.SendAsync(request);

        // Assert
        Assert.True(response.Headers.Contains("X-Culture"));
        Assert.True(response.Headers.Contains("X-Is-RTL"));
        
        var culture = response.Headers.GetValues("X-Culture").FirstOrDefault();
        var isRtl = response.Headers.GetValues("X-Is-RTL").FirstOrDefault();
        
        Assert.Equal("ar-EG", culture);
        Assert.Equal("true", isRtl);
    }

    [Fact]
    public async Task CultureDetectionMiddleware_ShouldMapLanguageToSupportedCulture_WhenExactMatchNotFound()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/v4/shared/localization/languages");
        request.Headers.Add("Accept-Language", "ar,en-US;q=0.9");

        // Act
        var response = await UnauthenticatedClient.SendAsync(request);

        // Assert
        var culture = response.Headers.GetValues("X-Culture").FirstOrDefault();
        var isRtl = response.Headers.GetValues("X-Is-RTL").FirstOrDefault();
        
        Assert.Equal("ar-EG", culture); // Should map 'ar' to 'ar-EG'
        Assert.Equal("true", isRtl);
    }

    [Fact]
    public async Task CultureDetectionMiddleware_ShouldUseUrlParameter_WhenProvided()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/v4/shared/localization/languages?culture=ar-SA");
        request.Headers.Add("Accept-Language", "en-US"); // Different from URL parameter

        // Act
        var response = await UnauthenticatedClient.SendAsync(request);

        // Assert
        var culture = response.Headers.GetValues("X-Culture").FirstOrDefault();
        var isRtl = response.Headers.GetValues("X-Is-RTL").FirstOrDefault();
        
        Assert.Equal("ar-SA", culture); // URL parameter should take priority
        Assert.Equal("true", isRtl);
    }

    [Fact]
    public async Task CultureDetectionMiddleware_ShouldUseUserPreference_WhenAuthenticated()
    {
        // Arrange - Set user preference in database
        using (var scope = Factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            // Ensure the user exists first
            var user = await context.Users.FindAsync(TestUserGuid);
            if (user == null)
            {
                user = new ApplicationUser
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
                    CreatedAt = DateTime.UtcNow,
                    PreferredLanguage = "ar-AE"
                };
                context.Users.Add(user);
            }
            else
            {
                user.PreferredLanguage = "ar-AE";
                context.Users.Update(user);
            }
            
            await context.SaveChangesAsync();
        }

        var request = new HttpRequestMessage(HttpMethod.Get, "/api/v4/shared/localization/languages");
        request.Headers.Add("Accept-Language", "en-US"); // Different from user preference

        // Act
        var response = await Client.SendAsync(request);

        // Assert
        var culture = response.Headers.GetValues("X-Culture").FirstOrDefault();
        var isRtl = response.Headers.GetValues("X-Is-RTL").FirstOrDefault();
        
        Assert.Equal("ar-AE", culture); // User preference should take priority
        Assert.Equal("true", isRtl);
    }

    [Fact]
    public async Task CultureDetectionMiddleware_ShouldFallbackToDefault_WhenUnsupportedCultureProvided()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/v4/shared/localization/languages?culture=fr-FR");

        // Act
        var response = await UnauthenticatedClient.SendAsync(request);

        // Assert
        var culture = response.Headers.GetValues("X-Culture").FirstOrDefault();
        var isRtl = response.Headers.GetValues("X-Is-RTL").FirstOrDefault();
        
        Assert.Equal("en-US", culture); // Should fallback to default
        Assert.Equal("false", isRtl);
    }

    [Theory]
    [InlineData("ar-EG", true)]
    [InlineData("ar-AE", true)]
    [InlineData("ar-SA", true)]
    [InlineData("en-US", false)]
    public async Task CultureDetectionMiddleware_ShouldSetCorrectRTLFlag_ForDifferentCultures(string culture, bool expectedRtl)
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v4/shared/localization/languages?culture={culture}");

        // Act
        var response = await UnauthenticatedClient.SendAsync(request);

        // Assert
        var actualCulture = response.Headers.GetValues("X-Culture").FirstOrDefault();
        var isRtl = response.Headers.GetValues("X-Is-RTL").FirstOrDefault();
        
        Assert.Equal(culture, actualCulture);
        Assert.Equal(expectedRtl.ToString().ToLower(), isRtl);
    }
}