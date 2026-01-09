using Application.Common.Interfaces;
using Application.Features.Media.Analytics.Services;
using Domain.Enums.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Analytics;

/// <summary>
/// Background service that validates and corrects analytics data integrity
/// Runs periodically to ensure analytics data remains accurate
/// </summary>
public class AnalyticsValidationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AnalyticsValidationService> _logger;
    private readonly TimeSpan _validationInterval = TimeSpan.FromHours(1); // Run every hour

    public AnalyticsValidationService(
        IServiceProvider serviceProvider,
        ILogger<AnalyticsValidationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Analytics Validation Service started");

        // Wait 5 minutes before first run to allow system to stabilize
        await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ValidateAnalyticsIntegrity(stoppingToken);
                await Task.Delay(_validationInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Expected when cancellation is requested
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during analytics validation");
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // Wait before retrying
            }
        }

        _logger.LogInformation("Analytics Validation Service stopped");
    }

    private async Task ValidateAnalyticsIntegrity(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var analyticsService = scope.ServiceProvider.GetRequiredService<IMediaAnalyticsService>();

        _logger.LogDebug("Starting analytics integrity validation");

        var validationResults = new List<ValidationResult>();

        // Validate video analytics
        var videoAnalytics = await context.MediaAnalytics
            .Where(ma => ma.MediaType == MediaType.Video)
            .ToListAsync(cancellationToken);

        foreach (var analytics in videoAnalytics)
        {
            var isValid = await analyticsService.ValidateAnalyticsIntegrityAsync(
                analytics.MediaId, 
                MediaType.Video, 
                cancellationToken);

            validationResults.Add(new ValidationResult
            {
                MediaId = analytics.MediaId,
                MediaType = MediaType.Video,
                IsValid = isValid,
                LastUpdated = analytics.LastUpdated
            });
        }

        // Validate podcast analytics
        var podcastAnalytics = await context.MediaAnalytics
            .Where(ma => ma.MediaType == MediaType.Podcast)
            .ToListAsync(cancellationToken);

        foreach (var analytics in podcastAnalytics)
        {
            var isValid = await analyticsService.ValidateAnalyticsIntegrityAsync(
                analytics.MediaId, 
                MediaType.Podcast, 
                cancellationToken);

            validationResults.Add(new ValidationResult
            {
                MediaId = analytics.MediaId,
                MediaType = MediaType.Podcast,
                IsValid = isValid,
                LastUpdated = analytics.LastUpdated
            });
        }

        // Check for missing analytics records
        await CheckForMissingAnalytics(context, analyticsService, cancellationToken);

        // Log validation summary
        var totalValidated = validationResults.Count;
        var invalidCount = validationResults.Count(r => !r.IsValid);
        var validCount = totalValidated - invalidCount;

        if (totalValidated > 0)
        {
            _logger.LogInformation(
                "Analytics validation completed: {Valid}/{Total} valid records, {Invalid} corrected",
                validCount, totalValidated, invalidCount);
        }
        else
        {
            _logger.LogDebug("No analytics records to validate");
        }
    }

    private async Task CheckForMissingAnalytics(
        IApplicationDbContext context, 
        IMediaAnalyticsService analyticsService, 
        CancellationToken cancellationToken)
    {
        // Check for videos without analytics
        var videosWithoutAnalytics = await context.Videos
            .Where(v => !v.IsDeleted && 
                       !context.MediaAnalytics.Any(ma => ma.MediaId == v.Id && ma.MediaType == MediaType.Video))
            .Select(v => v.Id)
            .ToListAsync(cancellationToken);

        foreach (var videoId in videosWithoutAnalytics)
        {
            await analyticsService.GetOrCreateAnalyticsAsync(videoId, MediaType.Video, cancellationToken);
            _logger.LogInformation("Created missing analytics record for video {VideoId}", videoId);
        }

        // Check for podcasts without analytics
        var podcastsWithoutAnalytics = await context.Podcasts
            .Where(p => !p.IsDeleted && 
                       !context.MediaAnalytics.Any(ma => ma.MediaId == p.Id && ma.MediaType == MediaType.Podcast))
            .Select(p => p.Id)
            .ToListAsync(cancellationToken);

        foreach (var podcastId in podcastsWithoutAnalytics)
        {
            await analyticsService.GetOrCreateAnalyticsAsync(podcastId, MediaType.Podcast, cancellationToken);
            _logger.LogInformation("Created missing analytics record for podcast {PodcastId}", podcastId);
        }

        if (videosWithoutAnalytics.Any() || podcastsWithoutAnalytics.Any())
        {
            _logger.LogInformation(
                "Created {VideoCount} video and {PodcastCount} podcast analytics records",
                videosWithoutAnalytics.Count, podcastsWithoutAnalytics.Count);
        }
    }

    private class ValidationResult
    {
        public Guid MediaId { get; set; }
        public MediaType MediaType { get; set; }
        public bool IsValid { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}