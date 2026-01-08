using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace WebAPI.IntegrationTests;

public class VideoUploadEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public VideoUploadEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Add test authentication and set it as default
                services.AddAuthentication("Test")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>("Test", options => { });
                
                // Override the default authentication scheme
                services.Configure<AuthenticationOptions>(options =>
                {
                    options.DefaultAuthenticateScheme = "Test";
                    options.DefaultChallengeScheme = "Test";
                });
            });
        });
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task VideoUpload_WithInvalidFile_ShouldReturnBadRequest()
    {
        // Arrange
        var content = new MultipartFormDataContent();
        
        // Add a text file instead of video
        var fileContent = new ByteArrayContent(Encoding.UTF8.GetBytes("This is not a video file"));
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/plain");
        content.Add(fileContent, "file", "test.txt");
        
        // Add form data
        content.Add(new StringContent("Test Video"), "Title");
        content.Add(new StringContent("Test Description"), "Description");
        content.Add(new StringContent("HD"), "Quality");
        content.Add(new StringContent("true"), "IsPublic");
        content.Add(new StringContent("true"), "AllowComments");

        // Act
        var response = await _client.PostAsync("/api/v7.0/media/videos/upload", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.Contains("validation failed", responseContent.ToLower());
    }

    [Fact]
    public async Task VideoUpload_WithExcessiveFileSize_ShouldReturnBadRequest()
    {
        // Arrange
        var content = new MultipartFormDataContent();
        
        // Create a small file but claim it's 3GB
        var fileContent = new ByteArrayContent(new byte[1000]);
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("video/mp4");
        fileContent.Headers.ContentLength = 3_000_000_000L; // 3GB
        content.Add(fileContent, "file", "test.mp4");
        
        // Add form data
        content.Add(new StringContent("Test Video"), "Title");
        content.Add(new StringContent("Test Description"), "Description");
        content.Add(new StringContent("HD"), "Quality");
        content.Add(new StringContent("true"), "IsPublic");
        content.Add(new StringContent("true"), "AllowComments");

        // Act
        var response = await _client.PostAsync("/api/v7.0/media/videos/upload", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.Contains("validation failed", responseContent.ToLower());
    }
}

public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
        : base(options, logger, encoder, clock)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "TestUser"),
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        };

        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Test");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}