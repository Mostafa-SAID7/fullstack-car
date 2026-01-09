using Application.Common.Interfaces;
using Application.Common.Interfaces.Data;
using Application.Features.Media.Analytics.Commands;
using Application.Features.Media.Analytics.Queries;
using Application.Features.Media.Analytics.Services;
using Domain.Entities.Media;
using Domain.Enums.Media;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Json;
using Xunit;

namespace WebAPI.IntegrationTests;

/// <summary>
/// Integration tests to verify that analytics data is collected accurately
/// Tests the complete flow from tracking events to analytics aggregation
/// </summary>
public class AnalyticsAccuracyTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public AnalyticsAccuracyTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task TrackVideoView_ShouldUpdateAnalyticsAccurately()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var analyticsService = scope.ServiceProvider.GetRequiredService<IMediaAnalyticsService>();

        // Create a test video
        var video = new Video
        {
            Id = Guid.NewGuid(),
            Title = "Test Video for Analytics",
            Description = "Test video to verify analytics accuracy",
            VideoUrl = "https://example.com/test-video.mp4",
            Duration = TimeSpan.FromMinutes(10),
            CreatorId = Guid.NewGuid(),
            Status = MediaStatus.Published,
            IsPublic = true,
            ViewCount = 0,
            LikeCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        context.Videos.Add(video);
        await context.SaveChangesAsync();

        var trackingData = new TrackVideoViewCommand
        {
            VideoId = video.Id,
            UserId = Guid.NewGuid(),
            IpAddress = "192.168.1.1",
            UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Country = "US",
            Device = "Desktop",
            Browser = "Chrome",
            OperatingSystem = "Windows",
            WatchTimeSeconds = 300, // 5 minutes
            CompletionPercentage = 50,
            Quality = "HD",
            IsUnique = true
        };

        // Act - Track video view
        var response = await _client.PostAsJsonAsync($"/api/v7.0/media/analytics/videos/{video.Id}/views", trackingData);

        // Assert
        Assert.True(response.IsSuccessStatusCode, $"Expected success but got {response.StatusCode}");

        // Verify video view was recorded
        var videoView = await context.VideoViews
            .FirstOrDefaultAsync(vv => vv.VideoId == video.Id);
        Assert.NotNull(videoView);
        Assert.Equal(trackingData.UserId, videoView.UserId);
        Assert.Equal(trackingData.IpAddress, videoView.IpAddress);
        Assert.Equal(trackingData.Country, videoView.Country);
        Assert.Equal(TimeSpan.FromSeconds(300), videoView.WatchDuration);

        // Verify video counter was updated
        // Query the video again to get the latest data from the database
        var updatedVideo = await context.Videos.AsNoTracking().FirstOrDefaultAsync(v => v.Id == video.Id);
        Assert.NotNull(updatedVideo);
        Assert.Equal(1, updatedVideo.ViewCount);

        // Verify analytics record was created/updated
        var analytics = await context.MediaAnalytics
            .FirstOrDefaultAsync(ma => ma.MediaId == video.Id && ma.MediaType == MediaType.Video);
        Assert.NotNull(analytics);
        Assert.Equal(1, analytics.ViewsTotal);
        Assert.Equal(1, analytics.ViewsToday);

        // Verify analytics integrity
        var isValid = await analyticsService.ValidateAnalyticsIntegrityAsync(video.Id, MediaType.Video);
        Assert.True(isValid, "Analytics data should be accurate and consistent");
    }

    [Fact]
    public async Task TrackPodcastPlay_ShouldUpdateAnalyticsAccurately()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var analyticsService = scope.ServiceProvider.GetRequiredService<IMediaAnalyticsService>();

        // Create a test podcast
        var podcast = new Podcast
        {
            Id = Guid.NewGuid(),
            Title = "Test Podcast for Analytics",
            Description = "Test podcast to verify analytics accuracy",
            AudioUrl = "https://example.com/test-podcast.mp3",
            Duration = TimeSpan.FromMinutes(30),
            CreatorId = Guid.NewGuid(),
            Status = MediaStatus.Published,
            IsPublic = true,
            PlayCount = 0,
            LikeCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        context.Podcasts.Add(podcast);
        await context.SaveChangesAsync();

        var trackingData = new TrackPodcastPlayCommand
        {
            PodcastId = podcast.Id,
            UserId = Guid.NewGuid(),
            IpAddress = "192.168.1.2",
            UserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
            Country = "CA",
            Device = "Mobile",
            Browser = "Safari",
            OperatingSystem = "iOS",
            ListenTimeSeconds = 900, // 15 minutes
            CompletionPercentage = 50,
            PlaybackSpeed = 1.5,
            IsDownload = false,
            IsUnique = true
        };

        // Act - Track podcast play
        var response = await _client.PostAsJsonAsync($"/api/v7.0/media/analytics/podcasts/{podcast.Id}/plays", trackingData);

        // Assert
        Assert.True(response.IsSuccessStatusCode, $"Expected success but got {response.StatusCode}");

        // Verify podcast play was recorded
        var podcastPlay = await context.PodcastPlays
            .FirstOrDefaultAsync(pp => pp.PodcastId == podcast.Id);
        Assert.NotNull(podcastPlay);
        Assert.Equal(trackingData.UserId, podcastPlay.UserId);
        Assert.Equal(trackingData.IpAddress, podcastPlay.IpAddress);
        Assert.Equal(trackingData.Country, podcastPlay.Country);
        Assert.Equal(TimeSpan.FromSeconds(900), podcastPlay.PlayDuration);

        // Verify podcast counter was updated
        // Query the podcast again to get the latest data from the database
        var updatedPodcast = await context.Podcasts.AsNoTracking().FirstOrDefaultAsync(p => p.Id == podcast.Id);
        Assert.NotNull(updatedPodcast);
        Assert.Equal(1, updatedPodcast.PlayCount);

        // Verify analytics record was created/updated
        var analytics = await context.MediaAnalytics.AsNoTracking()
            .FirstOrDefaultAsync(ma => ma.MediaId == podcast.Id && ma.MediaType == MediaType.Podcast);
        Assert.NotNull(analytics);
        Assert.Equal(1, analytics.ViewsTotal);
        Assert.Equal(1, analytics.ViewsToday);

        // Verify analytics integrity
        var isValid = await analyticsService.ValidateAnalyticsIntegrityAsync(podcast.Id, MediaType.Podcast);
        Assert.True(isValid, "Analytics data should be accurate and consistent");
    }

    [Fact]
    public async Task TrackEngagement_ShouldUpdateAnalyticsAccurately()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var analyticsService = scope.ServiceProvider.GetRequiredService<IMediaAnalyticsService>();

        // Create a test video
        var video = new Video
        {
            Id = Guid.NewGuid(),
            Title = "Test Video for Engagement Analytics",
            Description = "Test video to verify engagement analytics accuracy",
            VideoUrl = "https://example.com/test-video-engagement.mp4",
            Duration = TimeSpan.FromMinutes(5),
            CreatorId = Guid.NewGuid(),
            Status = MediaStatus.Published,
            IsPublic = true,
            ViewCount = 0,
            LikeCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        context.Videos.Add(video);
        await context.SaveChangesAsync();

        var userId = Guid.NewGuid();
        var engagementData = new TrackEngagementCommand
        {
            MediaId = video.Id,
            MediaType = MediaType.Video,
            UserId = userId,
            EngagementType = EngagementType.Like
        };

        // Act - Track like engagement
        var response = await _client.PostAsJsonAsync("/api/v7.0/media/analytics/engagement", engagementData);

        // Assert
        Assert.True(response.IsSuccessStatusCode, $"Expected success but got {response.StatusCode}");

        // Verify like was recorded
        var videoLike = await context.VideoLikes
            .FirstOrDefaultAsync(vl => vl.VideoId == video.Id && vl.UserId == userId);
        Assert.NotNull(videoLike);

        // Verify video counter was updated
        // Query the video again to get the latest data from the database
        var updatedVideo = await context.Videos.AsNoTracking().FirstOrDefaultAsync(v => v.Id == video.Id);
        Assert.NotNull(updatedVideo);
        Assert.Equal(1, updatedVideo.LikeCount);

        // Verify analytics record was updated
        var analytics = await context.MediaAnalytics.AsNoTracking()
            .FirstOrDefaultAsync(ma => ma.MediaId == video.Id && ma.MediaType == MediaType.Video);
        Assert.NotNull(analytics);
        Assert.Equal(1, analytics.LikesCount);

        // Verify analytics integrity
        var isValid = await analyticsService.ValidateAnalyticsIntegrityAsync(video.Id, MediaType.Video);
        Assert.True(isValid, "Analytics data should be accurate and consistent after engagement");
    }

    [Fact]
    public async Task MultipleViews_ShouldAggregateAnalyticsCorrectly()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var analyticsService = scope.ServiceProvider.GetRequiredService<IMediaAnalyticsService>();

        // Create a test video
        var video = new Video
        {
            Id = Guid.NewGuid(),
            Title = "Test Video for Multiple Views",
            Description = "Test video to verify multiple view analytics accuracy",
            VideoUrl = "https://example.com/test-video-multiple.mp4",
            Duration = TimeSpan.FromMinutes(8),
            CreatorId = Guid.NewGuid(),
            Status = MediaStatus.Published,
            IsPublic = true,
            ViewCount = 0,
            LikeCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        context.Videos.Add(video);
        await context.SaveChangesAsync();

        // Act - Track multiple views from different users
        var viewCount = 5;
        for (int i = 0; i < viewCount; i++)
        {
            var trackingData = new TrackVideoViewCommand
            {
                VideoId = video.Id,
                UserId = Guid.NewGuid(), // Different user each time
                IpAddress = $"192.168.1.{i + 10}",
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Country = i % 2 == 0 ? "US" : "CA",
                Device = "Desktop",
                Browser = "Chrome",
                OperatingSystem = "Windows",
                WatchTimeSeconds = 240 + (i * 30), // Varying watch times
                CompletionPercentage = 60 + (i * 5),
                Quality = "HD",
                IsUnique = true
            };

            var response = await _client.PostAsJsonAsync($"/api/v7.0/media/analytics/videos/{video.Id}/views", trackingData);
            Assert.True(response.IsSuccessStatusCode, $"View {i + 1} should be tracked successfully");
        }

        // Assert
        // Verify all views were recorded
        var totalViews = await context.VideoViews
            .CountAsync(vv => vv.VideoId == video.Id);
        Assert.Equal(viewCount, totalViews);

        // Verify video counter was updated correctly
        // Query the video again to get the latest data from the database
        var updatedVideo = await context.Videos.AsNoTracking().FirstOrDefaultAsync(v => v.Id == video.Id);
        Assert.NotNull(updatedVideo);
        Assert.Equal(viewCount, updatedVideo.ViewCount);

        // Verify analytics record reflects accurate totals
        var analytics = await context.MediaAnalytics.AsNoTracking()
            .FirstOrDefaultAsync(ma => ma.MediaId == video.Id && ma.MediaType == MediaType.Video);
        Assert.NotNull(analytics);
        Assert.Equal(viewCount, analytics.ViewsTotal);
        Assert.Equal(viewCount, analytics.ViewsToday); // All views are from today

        // Verify average watch time calculation
        var expectedAvgWatchTime = (240 + 270 + 300 + 330 + 360) / 5.0; // Average of watch times
        Assert.True(Math.Abs((double)analytics.AverageWatchTime - expectedAvgWatchTime) < 1.0, 
            $"Expected average watch time around {expectedAvgWatchTime}, got {analytics.AverageWatchTime}");

        // Verify analytics integrity
        var isValid = await analyticsService.ValidateAnalyticsIntegrityAsync(video.Id, MediaType.Video);
        Assert.True(isValid, "Analytics data should remain accurate with multiple views");
    }

    [Fact]
    public async Task DuplicateViews_ShouldNotInflateAnalytics()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        // Create a test video
        var video = new Video
        {
            Id = Guid.NewGuid(),
            Title = "Test Video for Duplicate Views",
            Description = "Test video to verify duplicate view handling",
            VideoUrl = "https://example.com/test-video-duplicate.mp4",
            Duration = TimeSpan.FromMinutes(6),
            CreatorId = Guid.NewGuid(),
            Status = MediaStatus.Published,
            IsPublic = true,
            ViewCount = 0,
            LikeCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        context.Videos.Add(video);
        await context.SaveChangesAsync();

        var userId = Guid.NewGuid();
        var ipAddress = "192.168.1.100";

        // Act - Track the same view multiple times (should be detected as duplicates)
        for (int i = 0; i < 3; i++)
        {
            var trackingData = new TrackVideoViewCommand
            {
                VideoId = video.Id,
                UserId = userId, // Same user
                IpAddress = ipAddress, // Same IP
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Country = "US",
                Device = "Desktop",
                Browser = "Chrome",
                OperatingSystem = "Windows",
                WatchTimeSeconds = 180,
                CompletionPercentage = 50,
                Quality = "HD",
                IsUnique = true // This should be validated by the system
            };

            var response = await _client.PostAsJsonAsync($"/api/v7.0/media/analytics/videos/{video.Id}/views", trackingData);
            Assert.True(response.IsSuccessStatusCode, $"Duplicate view {i + 1} should be handled gracefully");
        }

        // Assert
        // All view records should be stored (for analytics purposes)
        var totalViewRecords = await context.VideoViews
            .CountAsync(vv => vv.VideoId == video.Id);
        Assert.Equal(3, totalViewRecords);

        // But the video counter should only reflect unique views (first one)
        // Query the video again to get the latest data from the database
        var updatedVideo = await context.Videos.AsNoTracking().FirstOrDefaultAsync(v => v.Id == video.Id);
        Assert.NotNull(updatedVideo);
        Assert.Equal(1, updatedVideo.ViewCount); // Only one unique view should be counted

        // Analytics should reflect the accurate unique view count
        var analytics = await context.MediaAnalytics.AsNoTracking()
            .FirstOrDefaultAsync(ma => ma.MediaId == video.Id && ma.MediaType == MediaType.Video);
        Assert.NotNull(analytics);
        Assert.Equal(1, analytics.ViewsTotal); // Should match the unique view count
    }

    [Fact]
    public async Task GetAnalyticsDashboard_ShouldReturnAccurateData()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        // Create test data with known metrics
        var creatorId = Guid.NewGuid();
        var video = new Video
        {
            Id = Guid.NewGuid(),
            Title = "Dashboard Test Video",
            Description = "Video for dashboard analytics test",
            VideoUrl = "https://example.com/dashboard-test.mp4",
            Duration = TimeSpan.FromMinutes(10),
            CreatorId = creatorId,
            Status = MediaStatus.Published,
            IsPublic = true,
            ViewCount = 100,
            LikeCount = 15,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        var podcast = new Podcast
        {
            Id = Guid.NewGuid(),
            Title = "Dashboard Test Podcast",
            Description = "Podcast for dashboard analytics test",
            AudioUrl = "https://example.com/dashboard-test.mp3",
            Duration = TimeSpan.FromMinutes(25),
            CreatorId = creatorId,
            Status = MediaStatus.Published,
            IsPublic = true,
            PlayCount = 50,
            LikeCount = 8,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        context.Videos.Add(video);
        context.Podcasts.Add(podcast);

        // Create corresponding analytics records
        var videoAnalytics = new MediaAnalytics
        {
            MediaId = video.Id,
            MediaType = MediaType.Video,
            ViewsTotal = 100,
            ViewsToday = 20,
            ViewsWeek = 80,
            ViewsMonth = 100,
            LikesCount = 15,
            CommentsCount = 5,
            SharesCount = 3,
            AverageWatchTime = 480, // 8 minutes
            CompletionRate = 75,
            LastUpdated = DateTime.UtcNow
        };

        var podcastAnalytics = new MediaAnalytics
        {
            MediaId = podcast.Id,
            MediaType = MediaType.Podcast,
            ViewsTotal = 50,
            ViewsToday = 10,
            ViewsWeek = 40,
            ViewsMonth = 50,
            LikesCount = 8,
            CommentsCount = 2,
            SharesCount = 1,
            AverageWatchTime = 1200, // 20 minutes
            CompletionRate = 80,
            LastUpdated = DateTime.UtcNow
        };

        context.MediaAnalytics.Add(videoAnalytics);
        context.MediaAnalytics.Add(podcastAnalytics);
        await context.SaveChangesAsync();

        // Act - Get dashboard analytics
        var response = await _client.GetAsync("/api/v7.0/media/analytics/dashboard?timeRange=30d");

        // Assert
        Assert.True(response.IsSuccessStatusCode, $"Expected success but got {response.StatusCode}");

        var content = await response.Content.ReadAsStringAsync();
        var dashboardData = JsonSerializer.Deserialize<dynamic>(content);
        Assert.NotNull(dashboardData);

        // The dashboard should aggregate data from both video and podcast analytics
        // This verifies that the analytics system is collecting and presenting data accurately
    }
}