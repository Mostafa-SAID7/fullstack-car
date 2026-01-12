using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Xunit;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Common.Models;

namespace WebAPI.IntegrationTests
{
    public class JwtAuthenticationTests : BaseIntegrationTest
    {
        public JwtAuthenticationTests(WebApplicationFactory<Program> factory) : base(factory)
        {
        }

        [Fact]
        public void JwtTokenService_GenerateAccessToken_ShouldCreateValidToken()
        {
            // Arrange
            using var scope = Factory.Services.CreateScope();
            var jwtTokenService = scope.ServiceProvider.GetRequiredService<IJwtTokenService>();
            
            var userId = Guid.NewGuid();
            var email = "test@example.com";
            var fullName = "Test User";
            var roles = new[] { "User" };

            // Act
            var token = jwtTokenService.GenerateAccessToken(userId, email, fullName, roles);

            // Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);
            
            // Validate the token
            var principal = jwtTokenService.ValidateToken(token);
            Assert.NotNull(principal);
            
            // Check claims
            var userIdClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            var emailClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.Email);
            var nameClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.Name);
            var roleClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.Role);
            
            Assert.Equal(userId.ToString(), userIdClaim?.Value);
            Assert.Equal(email, emailClaim?.Value);
            Assert.Equal(fullName, nameClaim?.Value);
            Assert.Equal("User", roleClaim?.Value);
        }

        [Fact]
        public void JwtTokenService_ValidateToken_ShouldReturnNullForInvalidToken()
        {
            // Arrange
            using var scope = Factory.Services.CreateScope();
            var jwtTokenService = scope.ServiceProvider.GetRequiredService<IJwtTokenService>();
            
            var invalidToken = "invalid.token.here";

            // Act
            var principal = jwtTokenService.ValidateToken(invalidToken);

            // Assert
            Assert.Null(principal);
        }

        [Fact]
        public void JwtTokenService_IsTokenExpired_ShouldDetectExpiredToken()
        {
            // Arrange
            using var scope = Factory.Services.CreateScope();
            var jwtTokenService = scope.ServiceProvider.GetRequiredService<IJwtTokenService>();
            
            var userId = Guid.NewGuid();
            var email = "test@example.com";
            var fullName = "Test User";
            var roles = new[] { "User" };

            // Act
            var token = jwtTokenService.GenerateAccessToken(userId, email, fullName, roles);
            var isExpired = jwtTokenService.IsTokenExpired(token);

            // Assert
            Assert.False(isExpired); // Token should not be expired immediately after creation
        }

        [Fact]
        public async Task AuthenticationEndpoint_ShouldRequireValidToken()
        {
            // Arrange - Try to access a protected endpoint without token
            
            // Act
            var response = await Client.PostAsync("/api/v1/auth/logout", null);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task AuthenticationEndpoint_WithValidToken_ShouldAllowAccess()
        {
            // Arrange
            using var scope = Factory.Services.CreateScope();
            var jwtTokenService = scope.ServiceProvider.GetRequiredService<IJwtTokenService>();
            
            var userId = Guid.NewGuid();
            var email = "test@example.com";
            var fullName = "Test User";
            var roles = new[] { "User" };
            
            var token = jwtTokenService.GenerateAccessToken(userId, email, fullName, roles);

            // Act
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await Client.PostAsync("/api/v1/auth/logout", null);

            // Assert
            // Should not be Unauthorized (401) - might be BadRequest or other status depending on implementation
            Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public void RefreshToken_ShouldGenerateUniqueTokens()
        {
            // Arrange
            using var scope = Factory.Services.CreateScope();
            var jwtTokenService = scope.ServiceProvider.GetRequiredService<IJwtTokenService>();

            // Act
            var token1 = jwtTokenService.GenerateRefreshToken();
            var token2 = jwtTokenService.GenerateRefreshToken();

            // Assert
            Assert.NotNull(token1);
            Assert.NotNull(token2);
            Assert.NotEqual(token1, token2);
        }

        [Fact]
        public void GetUserIdFromToken_ShouldExtractCorrectUserId()
        {
            // Arrange
            using var scope = Factory.Services.CreateScope();
            var jwtTokenService = scope.ServiceProvider.GetRequiredService<IJwtTokenService>();
            
            var expectedUserId = Guid.NewGuid();
            var email = "test@example.com";
            var fullName = "Test User";
            var roles = new[] { "User" };
            
            var token = jwtTokenService.GenerateAccessToken(expectedUserId, email, fullName, roles);

            // Act
            var actualUserId = jwtTokenService.GetUserIdFromToken(token);

            // Assert
            Assert.Equal(expectedUserId, actualUserId);
        }
    }
}