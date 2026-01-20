using Application.Features.Common.Views.Commands;
using Application.Features.Common.Views.DTOs.Requests;
using Application.Features.Common.Views.Queries;
using Application.Features.Identity.Core.Interfaces;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Common.Views;

[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/common/views")]
public class ViewController : BaseController
{
    private readonly ICurrentUserService _currentUserService;

    public ViewController(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    [HttpPost("track")]
    [AllowAnonymous]
    public async Task<IActionResult> TrackView([FromBody] TrackViewRequest request)
    {
        Guid? userId = null;
        if (_currentUserService.IsAuthenticated && !string.IsNullOrEmpty(_currentUserService.UserId))
        {
            Guid.TryParse(_currentUserService.UserId, out var userGuid);
            userId = userGuid;
        }

        // Get IP address from request
        var ipAddress = request.IpAddress ?? HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = request.UserAgent ?? HttpContext.Request.Headers["User-Agent"].ToString();

        var command = new TrackViewCommand(
            request.ContentId,
            request.ContentType,
            userId,
            ipAddress,
            userAgent
        );

        var result = await Mediator.Send(command);

        if (result.Succeeded)
        {
            return Success("View tracked successfully");
        }

        return BadRequest("Failed to track view", result.Errors);
    }

    [HttpGet("{contentType}/{contentId}/stats")]
    [AllowAnonymous]
    [OutputCache(Duration = 300, Tags = new[] { "Views", "ViewStats" })]
    public async Task<IActionResult> GetViewStats(
        Guid contentId, 
        string contentType,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        if (!Enum.TryParse<ContentType>(contentType, out var parsedContentType))
        {
            return BadRequest("Invalid content type");
        }

        var query = new GetViewStatsQuery(
            contentId,
            parsedContentType,
            startDate,
            endDate
        );

        var result = await Mediator.Send(query);

        if (result.Succeeded)
        {
            return Success(result.Data, "View statistics retrieved successfully");
        }

        return BadRequest("Failed to retrieve view statistics", result.Errors);
    }

    [HttpGet("{contentType}/{contentId}/count")]
    [AllowAnonymous]
    [OutputCache(Duration = 60, Tags = new[] { "Views", "ViewCount" })]
    public async Task<IActionResult> GetViewCount(Guid contentId, string contentType)
    {
        if (!Enum.TryParse<ContentType>(contentType, out var parsedContentType))
        {
            return BadRequest("Invalid content type");
        }

        var query = new GetViewStatsQuery(contentId, parsedContentType);
        var result = await Mediator.Send(query);

        if (result.Succeeded)
        {
            return Success(new { ViewCount = result.Data.TotalViews }, "View count retrieved successfully");
        }

        return BadRequest("Failed to retrieve view count", result.Errors);
    }

    [HttpGet("content/{contentType}")]
    [Authorize]
    [OutputCache(Duration = 120, Tags = new[] { "Views", "ContentViews" })]
    public async Task<IActionResult> GetContentViews(
        string contentType,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Unauthorized("User authentication required");
        }

        if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
        {
            return Unauthorized("Invalid user context");
        }

        if (!Enum.TryParse<ContentType>(contentType, out var parsedContentType))
        {
            return BadRequest("Invalid content type");
        }

        try
        {
            var query = new GetContentViewsQuery(
                Guid.Empty, // This would need to be updated based on requirements
                parsedContentType,
                page,
                pageSize
            );

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                return Success(result.Data, "Content views retrieved successfully");
            }

            return BadRequest("Failed to retrieve content views", result.Errors);
        }
        catch (Exception)
        {
            return BadRequest("Failed to retrieve content views");
        }
    }
}