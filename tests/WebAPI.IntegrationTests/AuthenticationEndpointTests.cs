using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text;
using System.Text.Json;
using Xunit;
using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Common.Models;

namespace WebAPI.IntegrationTests
{
    public class AuthenticationEndpointTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public AuthenticationEndpointTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ShouldReturnFailureResult()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Email = "nonexistent@example.com",
                Password = "wrongpassword"
            };

            var json = JsonSerializer.Serialize(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/v1/auth/login", content);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var responseContent = await response.Content.ReadAsStringAsync();
            
            // Try to deserialize as a simple object first to check the structure
            var jsonDocument = JsonDocument.Parse(responseContent);
            var root = jsonDocument.RootElement;
            
            // Check if it has the expected properties
            Assert.True(root.TryGetProperty("succeeded", out var succeededProperty) || 
                       root.TryGetProperty("Succeeded", out succeededProperty));
            Assert.False(succeededProperty.GetBoolean());
            
            Assert.True(root.TryGetProperty("errors", out var errorsProperty) || 
                       root.TryGetProperty("Errors", out errorsProperty));
            Assert.True(errorsProperty.GetArrayLength() > 0);
        }

        [Fact]
        public async Task Register_WithInvalidData_ShouldReturnValidationErrors()
        {
            // Arrange
            var registerRequest = new RegisterRequest
            {
                Email = "invalid-email", // Invalid email format
                Password = "123", // Too short password
                ConfirmPassword = "456", // Passwords don't match
                FirstName = "",
                LastName = ""
            };

            var json = JsonSerializer.Serialize(registerRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/v1/auth/register", content);

            // Assert - Should return BadRequest for validation errors
            Assert.True(response.StatusCode == HttpStatusCode.BadRequest || response.StatusCode == HttpStatusCode.OK);
            
            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.NotEmpty(responseContent);
            
            // If it's OK status, check the result structure for failure
            if (response.StatusCode == HttpStatusCode.OK)
            {
                var jsonDocument = JsonDocument.Parse(responseContent);
                var root = jsonDocument.RootElement;
                
                Assert.True(root.TryGetProperty("succeeded", out var succeededProperty) || 
                           root.TryGetProperty("Succeeded", out succeededProperty));
                Assert.False(succeededProperty.GetBoolean());
            }
        }

        [Fact]
        public async Task RefreshToken_WithInvalidToken_ShouldReturnFailureResult()
        {
            // Arrange
            var refreshTokenRequest = new RefreshTokenRequest
            {
                RefreshToken = "invalid-refresh-token"
            };

            var json = JsonSerializer.Serialize(refreshTokenRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/v1/auth/refresh-token", content);

            // Assert - Should return BadRequest for invalid token
            Assert.True(response.StatusCode == HttpStatusCode.BadRequest || response.StatusCode == HttpStatusCode.OK);
            
            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.NotEmpty(responseContent);
            
            // If it's OK status, check the result structure for failure
            if (response.StatusCode == HttpStatusCode.OK)
            {
                var jsonDocument = JsonDocument.Parse(responseContent);
                var root = jsonDocument.RootElement;
                
                Assert.True(root.TryGetProperty("succeeded", out var succeededProperty) || 
                           root.TryGetProperty("Succeeded", out succeededProperty));
                Assert.False(succeededProperty.GetBoolean());
            }
        }

        [Fact]
        public async Task Logout_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Act
            var response = await _client.PostAsync("/api/v1/auth/logout", null);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task RevokeToken_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            // Arrange
            var json = JsonSerializer.Serialize("some-token");
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/v1/auth/revoke-token", content);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}