using Application.Features.Media.Analytics.Commands;
using Application.Features.Media.Analytics.Queries;
using Application.Features.Media.Analytics.DTOs;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json;

namespace WebAPI.Controllers.Media.Analytics;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/analytics")]
public class MediaAnalyticsController : BaseController
{
    private readonly ILogger<MediaAnalyticsController> _logger;

    public MediaAnalyticsController(ILogger<MediaAnalyticsController> logger)
    {
        _logger = logger;
    }

    [HttpPost("videos/{videoId:guid}/views")]
    public async Task<IActionResult> TrackVideoView(Guid videoId, [FromBody] TrackVideoViewRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid? userGuid = null;
            
            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var parsedUserId))
            {
                userGuid = parsedUserId;
            }

            var userAgent = Request.Headers["User-Agent"].ToString();
            
            var command = new TrackVideoViewCommand
            {
                VideoId = videoId,
                UserId = userGuid,
                IpAddress = GetClientIpAddress(),
                WatchTimeSeconds = request.WatchTimeSeconds > 0 ? request.WatchTimeSeconds : (int)request.WatchDuration.TotalSeconds,
                CompletionPercentage = request.CompletionPercentage > 0 ? request.CompletionPercentage : (request.IsCompleted ? 100.0 : 0.0),
                UserAgent = userAgent,
                Country = request.Country,
                Quality = request.Quality,
                Device = !string.IsNullOrEmpty(request.Device) ? request.Device : ParseDeviceFromUserAgent(userAgent),
                Browser = ParseBrowserFromUserAgent(userAgent),
                OperatingSystem = ParseOSFromUserAgent(userAgent)
            };

            var result = await Mediator.Send(command);
            return FromResult(result, "Video view tracked successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error tracking video view for VideoId: {VideoId}", videoId);
            return InternalServerError("Failed to track video view", ex.Message);
        }
    }

    [HttpPost("podcasts/{podcastId:guid}/plays")]
    public async Task<IActionResult> TrackPodcastPlay(Guid podcastId, [FromBody] TrackPodcastPlayRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid? userGuid = null;
            
            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var parsedUserId))
            {
                userGuid = parsedUserId;
            }

            var userAgent = Request.Headers["User-Agent"].ToString();
            
            var command = new TrackPodcastPlayCommand
            {
                PodcastId = podcastId,
                UserId = userGuid,
                IpAddress = GetClientIpAddress(),
                ListenTimeSeconds = request.ListenTimeSeconds > 0 ? request.ListenTimeSeconds : (int)request.PlayDuration.TotalSeconds,
                CompletionPercentage = request.CompletionPercentage > 0 ? request.CompletionPercentage : (request.IsCompleted ? 100.0 : 0.0),
                UserAgent = userAgent,
                Country = request.Country,
                PlaybackSpeed = request.PlaybackSpeed,
                Device = !string.IsNullOrEmpty(request.Device) ? request.Device : ParseDeviceFromUserAgent(userAgent),
                Browser = ParseBrowserFromUserAgent(userAgent),
                OperatingSystem = ParseOSFromUserAgent(userAgent)
            };

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

    [HttpGet("videos/{videoId:guid}")]
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

    [HttpGet("podcasts/{podcastId:guid}")]
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

    private string? GetClientIpAddress()
    {
        var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        var realIp = Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(realIp))
        {
            return realIp;
        }

        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }

    private string ParseDeviceFromUserAgent(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent))
            return "Unknown";

        userAgent = userAgent.ToLowerInvariant();

        if (userAgent.Contains("mobile") || userAgent.Contains("android") || userAgent.Contains("iphone"))
            return "Mobile";
        
        if (userAgent.Contains("tablet") || userAgent.Contains("ipad"))
            return "Tablet";
        
        return "Desktop";
    }

    private string ParseBrowserFromUserAgent(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent))
            return "Unknown";

        userAgent = userAgent.ToLowerInvariant();

        if (userAgent.Contains("chrome") && !userAgent.Contains("edg"))
            return "Chrome";
        
        if (userAgent.Contains("firefox"))
            return "Firefox";
        
        if (userAgent.Contains("safari") && !userAgent.Contains("chrome"))
            return "Safari";
        
        if (userAgent.Contains("edg"))
            return "Edge";
        
        return "Other";
    }

    private string ParseOSFromUserAgent(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent))
            return "Unknown";

        userAgent = userAgent.ToLowerInvariant();

        if (userAgent.Contains("windows"))
            return "Windows";
        
        if (userAgent.Contains("mac os") || userAgent.Contains("macos"))
            return "macOS";
        
        if (userAgent.Contains("linux"))
            return "Linux";
        
        if (userAgent.Contains("android"))
            return "Android";
        
        if (userAgent.Contains("ios") || userAgent.Contains("iphone") || userAgent.Contains("ipad"))
            return "iOS";
        
        return "Other";
    }
}
