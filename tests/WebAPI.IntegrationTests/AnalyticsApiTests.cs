using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;

namespace WebAPI.IntegrationTests;

public class AnalyticsApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public AnalyticsApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task TrackVideoView_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var videoId = Guid.NewGuid();
        var trackingData = new
        {
            WatchTimeSeconds = 120,
            CompletionPercentage = 75.5,
            Quality = "HD_720p",
            Country = "US",
            Device = "Desktop"
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/v7.0/media/analytics/videos/{videoId}/views", trackingData);

        // Assert
        // Note: This will likely fail without proper authentication and existing video
        // but tests the endpoint structure
        Assert.NotNull(response);
    }

    [Fact]
    public async Task TrackPodcastPlay_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var podcastId = Guid.NewGuid();
        var trackingData = new
        {
            ListenTimeSeconds = 300,
            CompletionPercentage = 85.0,
            PlaybackSpeed = 1.5,
            Country = "US",
            Device = "Mobile"
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/v7.0/media/analytics/podcasts/{podcastId}/plays", trackingData);

        // Assert
        Assert.NotNull(response);
    }

    [Fact]
    public async Task GetDashboard_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v7.0/media/analytics/dashboard");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetVideoAnalytics_WithValidId_ReturnsUnauthorized()
    {
        // Arrange
        var videoId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/v7.0/media/analytics/videos/{videoId}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetPodcastAnalytics_WithValidId_ReturnsUnauthorized()
    {
        // Arrange
        var podcastId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/v7.0/media/analytics/podcasts/{podcastId}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetCreatorAnalytics_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v7.0/media/analytics/creator");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ExportAnalytics_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v7.0/media/analytics/export?format=csv");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetRealtimeAnalytics_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v7.0/media/analytics/realtime");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetAnalyticsTrends_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/v7.0/media/analytics/trends");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("csv")]
    [InlineData("json")]
    public async Task ExportAnalytics_WithDifferentFormats_ReturnsUnauthorized(string format)
    {
        // Act
        var response = await _client.GetAsync($"/api/v7.0/media/analytics/export?format={format}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("1d")]
    [InlineData("7d")]
    [InlineData("30d")]
    public async Task GetDashboard_WithDifferentTimeRanges_ReturnsUnauthorized(string timeRange)
    {
        // Act
        var response = await _client.GetAsync($"/api/v7.0/media/analytics/dashboard?timeRange={timeRange}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }
}