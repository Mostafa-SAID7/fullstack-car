using Application.Features.Media.Analytics.Commands;
using Application.Features.Media.Analytics.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/analytics-legacy")]
public class AnalyticsController : BaseController
{
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(ILogger<AnalyticsController> logger)
    {
        _logger = logger;
    }
    [HttpPost("videos/{videoId}/views")]
    public async Task<IActionResult> TrackVideoView(Guid videoId, [FromBody] TrackVideoViewCommand command)
    {
        try
        {
            // Set the video ID from the route
            command.VideoId = videoId;

            // Debug logging
            _logger.LogInformation("TrackVideoView - Original UserId: {UserId}, IsAuthenticated: {IsAuthenticated}", 
                command.UserId, User.Identity?.IsAuthenticated);

            // Try to get authenticated user ID, but don't override if already set (for test scenarios)
            // This allows both authenticated and anonymous tracking for accurate analytics
            if (!command.UserId.HasValue && User.Identity?.IsAuthenticated == true)
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var userGuid))
                {
                    command.UserId = userGuid;
                    _logger.LogInformation("TrackVideoView - Set UserId from claims: {UserId}", command.UserId);
                }
            }

            _logger.LogInformation("TrackVideoView - Final UserId: {UserId}", command.UserId);

            var result = await Mediator.Send(command);

            return FromResult(result, "Video view tracked successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error tracking video view for VideoId: {VideoId}", videoId);
            return InternalServerError("Failed to track video view", ex.Message);
        }
    }
    [HttpPost("podcasts/{podcastId}/plays")]
    public async Task<IActionResult> TrackPodcastPlay(Guid podcastId, [FromBody] TrackPodcastPlayCommand command)
    {
        try
        {
            // Set the podcast ID from the route
            command.PodcastId = podcastId;

            // Try to get authenticated user ID, but don't override if already set (for test scenarios)
            // This allows both authenticated and anonymous tracking for accurate analytics
            if (command.UserId == null && User.Identity?.IsAuthenticated == true)
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var userGuid))
                {
                    command.UserId = userGuid;
                }
            }

            var result = await Mediator.Send(command);

            return FromResult(result, "Podcast play tracked successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error tracking podcast play for PodcastId: {PodcastId}", podcastId);
            return InternalServerError("Failed to track podcast play", ex.Message);
        }
    }
    [HttpPost("engagement")]
    [Authorize]
    public async Task<IActionResult> TrackEngagement([FromBody] TrackEngagementCommand command)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            command.UserId = userGuid;
            var result = await Mediator.Send(command);

            return FromResult(result, "Engagement tracked successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error tracking engagement");
            return InternalServerError("Failed to track engagement", ex.Message);
        }
    }
    [HttpGet("dashboard")]
    [Authorize]
    public async Task<IActionResult> GetDashboard([FromQuery] GetAnalyticsDashboardQuery query)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var userGuid))
            {
                query.UserId = userGuid;
            }

            var result = await Mediator.Send(query);

            return FromResult(result, "Dashboard data retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving dashboard data");
            return InternalServerError("Failed to retrieve dashboard data", ex.Message);
        }
    }
    [HttpGet("videos/{videoId}")]
    [Authorize]
    public async Task<IActionResult> GetVideoAnalytics(Guid videoId, [FromQuery] GetVideoAnalyticsQuery query)
    {
        try
        {
            query.VideoId = videoId;
            var result = await Mediator.Send(query);

            return FromResult(result, "Video analytics retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving video analytics for VideoId: {VideoId}", videoId);
            return InternalServerError("Failed to retrieve video analytics", ex.Message);
        }
    }
    [HttpGet("podcasts/{podcastId}")]
    [Authorize]
    public async Task<IActionResult> GetPodcastAnalytics(Guid podcastId, [FromQuery] GetPodcastAnalyticsQuery query)
    {
        try
        {
            query.PodcastId = podcastId;
            var result = await Mediator.Send(query);

            return FromResult(result, "Podcast analytics retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving podcast analytics for PodcastId: {PodcastId}", podcastId);
            return InternalServerError("Failed to retrieve podcast analytics", ex.Message);
        }
    }
    [HttpGet("creator")]
    [Authorize]
    public async Task<IActionResult> GetCreatorAnalytics([FromQuery] GetCreatorAnalyticsQuery query)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            query.CreatorId = userGuid;
            var result = await Mediator.Send(query);

            return FromResult(result, "Creator analytics retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving creator analytics");
            return InternalServerError("Failed to retrieve creator analytics", ex.Message);
        }
    }
    [HttpGet("export")]
    [Authorize]
    public async Task<IActionResult> ExportAnalytics([FromQuery] ExportAnalyticsQuery query)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var userGuid))
            {
                query.UserId = userGuid;
            }

            var result = await Mediator.Send(query);

            if (!result.IsSuccess)
            {
                return FromResult(result);
            }

            var exportData = result.Data;
            var contentType = query.Format.ToLower() switch
            {
                "csv" => "text/csv",
                "json" => "application/json",
                "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                _ => "application/octet-stream"
            };

            var fileName = $"analytics-export-{DateTime.UtcNow:yyyyMMdd-HHmmss}.{query.Format.ToLower()}";

            return File(exportData.Data, contentType, fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting analytics data");
            return InternalServerError("Failed to export analytics data", ex.Message);
        }
    }
    [HttpGet("realtime")]
    [Authorize]
    public async Task<IActionResult> GetRealtimeAnalytics([FromQuery] GetRealtimeAnalyticsQuery query)
    {
        try
        {
            var result = await Mediator.Send(query);

            return FromResult(result, "Real-time analytics retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving real-time analytics");
            return InternalServerError("Failed to retrieve real-time analytics", ex.Message);
        }
    }
    [HttpGet("trends")]
    [Authorize]
    public async Task<IActionResult> GetAnalyticsTrends([FromQuery] GetAnalyticsTrendsQuery query)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var userGuid))
            {
                query.UserId = userGuid;
            }

            var result = await Mediator.Send(query);

            return FromResult(result, "Analytics trends retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving analytics trends");
            return InternalServerError("Failed to retrieve analytics trends", ex.Message);
        }
    }
}