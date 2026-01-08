using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;
using Application.Features.Media.Videos.DTOs.Requests;
using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Podcasts.DTOs.Requests;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Domain.Enums.Media;
using System.Net;
using System.Net.Http.Headers;
using Application.Features.Identity.Core.Interfaces;

namespace WebAPI.IntegrationTests;

public class MediaCrudTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public MediaCrudTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    private string GetTestJwtToken()
    {
        using var scope = _factory.Services.CreateScope();
        var jwtTokenService = scope.ServiceProvider.GetRequiredService<IJwtTokenService>();
        
        var userId = Guid.NewGuid();
        var email = "test@example.com";
        var fullName = "Test User";
        var roles = new[] { "ContentCreator" };
        
        return jwtTokenService.GenerateAccessToken(userId, email, fullName, roles);
    }

    [Fact]
    public async Task VideosCrud_ShouldWorkCorrectly()
    {
        // Arrange
        var token = GetTestJwtToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreateVideoRequest
        {
            Title = "Test Video",
            Description = "Test Description",
            Quality = VideoQuality.HD_720p,
            Tags = "test,video",
            IsPublic = true,
            AllowComments = true
        };

        // Act & Assert - Create
        var createResponse = await _client.PostAsJsonAsync("/api/v7.0/media/videos", createRequest);
        createResponse.EnsureSuccessStatusCode();
        
        var createContent = await createResponse.Content.ReadAsStringAsync();
        var createResult = JsonSerializer.Deserialize<ApiResponse<VideoDto>>(createContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(createResult);
        Assert.True(createResult.Success);
        Assert.NotNull(createResult.Data);
        Assert.Equal("Test Video", createResult.Data.Title);

        var videoId = createResult.Data.Id;

        // Act & Assert - Read
        var getResponse = await _client.GetAsync($"/api/v7.0/media/videos/{videoId}");
        getResponse.EnsureSuccessStatusCode();
        
        var getContent = await getResponse.Content.ReadAsStringAsync();
        var getResult = JsonSerializer.Deserialize<ApiResponse<VideoDetailsDto>>(getContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(getResult);
        Assert.True(getResult.Success);
        Assert.NotNull(getResult.Data);
        Assert.Equal("Test Video", getResult.Data.Title);
        Assert.Equal(videoId, getResult.Data.Id);

        // Act & Assert - Update
        var updateRequest = new UpdateVideoRequest
        {
            Title = "Updated Test Video",
            Description = "Updated Description",
            Tags = "updated,test,video",
            IsPublic = false,
            AllowComments = false
        };

        var updateResponse = await _client.PutAsJsonAsync($"/api/v7.0/media/videos/{videoId}", updateRequest);
        updateResponse.EnsureSuccessStatusCode();
        
        var updateContent = await updateResponse.Content.ReadAsStringAsync();
        var updateResult = JsonSerializer.Deserialize<ApiResponse<VideoDto>>(updateContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(updateResult);
        Assert.True(updateResult.Success);
        Assert.NotNull(updateResult.Data);
        Assert.Equal("Updated Test Video", updateResult.Data.Title);
        Assert.Equal("Updated Description", updateResult.Data.Description);
        Assert.False(updateResult.Data.IsPublic);
        Assert.False(updateResult.Data.AllowComments);

        // Act & Assert - Delete
        var deleteResponse = await _client.DeleteAsync($"/api/v7.0/media/videos/{videoId}");
        deleteResponse.EnsureSuccessStatusCode();
        
        var deleteContent = await deleteResponse.Content.ReadAsStringAsync();
        var deleteResult = JsonSerializer.Deserialize<ApiResponse<bool>>(deleteContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(deleteResult);
        Assert.True(deleteResult.Success);

        // Verify deletion - should return 404
        var verifyDeleteResponse = await _client.GetAsync($"/api/v7.0/media/videos/{videoId}");
        Assert.Equal(HttpStatusCode.NotFound, verifyDeleteResponse.StatusCode);
    }

    [Fact]
    public async Task PodcastsCrud_ShouldWorkCorrectly()
    {
        // Arrange
        var token = GetTestJwtToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var createRequest = new CreatePodcastRequest
        {
            Title = "Test Podcast",
            Description = "Test Podcast Description",
            Tags = "test,podcast",
            IsPublic = true,
            AllowComments = true,
            AllowDownload = false,
            EpisodeNumber = 1,
            SeasonNumber = 1
        };

        // Act & Assert - Create
        var createResponse = await _client.PostAsJsonAsync("/api/v7.0/media/podcasts", createRequest);
        createResponse.EnsureSuccessStatusCode();
        
        var createContent = await createResponse.Content.ReadAsStringAsync();
        var createResult = JsonSerializer.Deserialize<ApiResponse<PodcastDto>>(createContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(createResult);
        Assert.True(createResult.Success);
        Assert.NotNull(createResult.Data);
        Assert.Equal("Test Podcast", createResult.Data.Title);

        var podcastId = createResult.Data.Id;

        // Act & Assert - Read
        var getResponse = await _client.GetAsync($"/api/v7.0/media/podcasts/{podcastId}");
        getResponse.EnsureSuccessStatusCode();
        
        var getContent = await getResponse.Content.ReadAsStringAsync();
        var getResult = JsonSerializer.Deserialize<ApiResponse<PodcastDetailsDto>>(getContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(getResult);
        Assert.True(getResult.Success);
        Assert.NotNull(getResult.Data);
        Assert.Equal("Test Podcast", getResult.Data.Title);
        Assert.Equal(podcastId, getResult.Data.Id);

        // Act & Assert - Update
        var updateRequest = new UpdatePodcastRequest
        {
            Title = "Updated Test Podcast",
            Description = "Updated Podcast Description",
            Tags = "updated,test,podcast",
            IsPublic = false,
            AllowComments = false,
            AllowDownload = true
        };

        var updateResponse = await _client.PutAsJsonAsync($"/api/v7.0/media/podcasts/{podcastId}", updateRequest);
        updateResponse.EnsureSuccessStatusCode();
        
        var updateContent = await updateResponse.Content.ReadAsStringAsync();
        var updateResult = JsonSerializer.Deserialize<ApiResponse<PodcastDto>>(updateContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(updateResult);
        Assert.True(updateResult.Success);
        Assert.NotNull(updateResult.Data);
        Assert.Equal("Updated Test Podcast", updateResult.Data.Title);
        Assert.Equal("Updated Podcast Description", updateResult.Data.Description);
        Assert.False(updateResult.Data.IsPublic);
        Assert.False(updateResult.Data.AllowComments);
        Assert.True(updateResult.Data.AllowDownload);

        // Act & Assert - Delete
        var deleteResponse = await _client.DeleteAsync($"/api/v7.0/media/podcasts/{podcastId}");
        deleteResponse.EnsureSuccessStatusCode();
        
        var deleteContent = await deleteResponse.Content.ReadAsStringAsync();
        var deleteResult = JsonSerializer.Deserialize<ApiResponse<bool>>(deleteContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        Assert.NotNull(deleteResult);
        Assert.True(deleteResult.Success);

        // Verify deletion - should return 404
        var verifyDeleteResponse = await _client.GetAsync($"/api/v7.0/media/podcasts/{podcastId}");
        Assert.Equal(HttpStatusCode.NotFound, verifyDeleteResponse.StatusCode);
    }

    [Fact]
    public async Task GetVideos_ShouldReturnPaginatedResults()
    {
        // Act
        var response = await _client.GetAsync("/api/v7.0/media/videos?pageNumber=1&pageSize=10");
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ApiResponse<PaginatedList<VideoListDto>>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success, $"Expected Success to be true, but got: {result.Success}. Response: {content}");
        Assert.NotNull(result.Data);
        Assert.True(result.Data.PageNumber >= 1);
        Assert.True(result.Data.TotalCount >= 0);
        Assert.NotNull(result.Data.Items);
    }

    [Fact]
    public async Task GetPodcasts_ShouldReturnPaginatedResults()
    {
        // Act
        var response = await _client.GetAsync("/api/v7.0/media/podcasts?pageNumber=1&pageSize=10");
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ApiResponse<PaginatedList<PodcastListDto>>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        // Assert
        Assert.NotNull(result);
        Assert.True(result.Success, $"Expected Success to be true, but got: {result.Success}. Response: {content}");
        Assert.NotNull(result.Data);
        Assert.True(result.Data.PageNumber >= 1);
        Assert.True(result.Data.TotalCount >= 0);
        Assert.NotNull(result.Data.Items);
    }
}

// Helper classes for test responses
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public List<string>? Errors { get; set; }
}

public class PaginatedList<T>
{
    public List<T> Items { get; set; } = new();
    public int PageNumber { get; set; }
    public int TotalPages { get; set; }
    public int TotalCount { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
}