using Application.Features.Media.Analytics.Commands;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media.Analytics;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/analytics")]
public class MediaAnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public MediaAnalyticsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Track video view
    /// </summary>
    [HttpPost("video/{videoId:guid}/view")]
    public async Task<IActionResult> TrackVideoView(Guid videoId, [FromBody] TrackVideoViewRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Guid? userGuid = null;
        
        if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var parsedUserId))
        {
            userGuid = parsedUserId;
        }

        var command = new TrackVideoViewCommand
        {
            VideoId = videoId,
            UserId = userGuid,
            IpAddress = GetClientIpAddress(),
            WatchTimeSeconds = (int)request.WatchDuration.TotalSeconds,
            CompletionPercentage = request.IsCompleted ? 100.0 : 0.0,
            UserAgent = Request.Headers["User-Agent"].ToString(),
            Country = request.Country
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Message = "Video view tracked successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to track video view"
        });
    }

    /// <summary>
    /// Track podcast play
    /// </summary>
    [HttpPost("podcast/{podcastId:guid}/play")]
    public async Task<IActionResult> TrackPodcastPlay(Guid podcastId, [FromBody] TrackPodcastPlayRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Guid? userGuid = null;
        
        if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var parsedUserId))
        {
            userGuid = parsedUserId;
        }

        var command = new TrackPodcastPlayCommand
        {
            PodcastId = podcastId,
            UserId = userGuid,
            IpAddress = GetClientIpAddress(),
            ListenTimeSeconds = (int)request.PlayDuration.TotalSeconds,
            CompletionPercentage = request.IsCompleted ? 100.0 : 0.0,
            UserAgent = Request.Headers["User-Agent"].ToString(),
            Country = request.Country
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Message = "Podcast play tracked successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to track podcast play"
        });
    }

    private string? GetClientIpAddress()
    {
        // Try to get IP from X-Forwarded-For header (for load balancers/proxies)
        var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        // Try to get IP from X-Real-IP header
        var realIp = Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(realIp))
        {
            return realIp;
        }

        // Fall back to connection remote IP
        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}

// Request DTOs for analytics
public class TrackVideoViewRequest
{
    public TimeSpan WatchDuration { get; set; }
    public bool IsCompleted { get; set; }
    public string? Country { get; set; }
}

public class TrackPodcastPlayRequest
{
    public TimeSpan PlayDuration { get; set; }
    public bool IsCompleted { get; set; }
    public string? Country { get; set; }
}