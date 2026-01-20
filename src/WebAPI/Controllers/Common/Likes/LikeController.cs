using Application.Features.Common.Likes.Commands;
using Application.Features.Common.Likes.DTOs.Requests;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Common.Likes;

[Authorize]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/common/likes")]
public class LikeController : BaseController
{
    private readonly ICurrentUserService _currentUserService;

    public LikeController(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    [HttpPost]
    public async Task<IActionResult> LikeContent([FromBody] LikeRequest request)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Unauthorized("User authentication required");
        }

        if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
        {
            return Unauthorized("Invalid user context");
        }

        var command = new LikeCommand
        {
            ContentId = request.ContentId,
            ContentType = request.ContentType,
            UserId = userGuid
        };

        var result = await Mediator.Send(command);

        if (result.Succeeded)
        {
            return Success("Content liked successfully");
        }

        return BadRequest("Failed to like content", result.Errors);
    }

    [HttpDelete("{contentType}/{contentId}")]
    public async Task<IActionResult> UnlikeContent(Guid contentId, string contentType)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Unauthorized("User authentication required");
        }

        if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
        {
            return Unauthorized("Invalid user context");
        }

        if (!Enum.TryParse<Domain.Enums.Common.ContentType>(contentType, out var parsedContentType))
        {
            return BadRequest("Invalid content type");
        }

        var command = new UnlikeCommand
        {
            ContentId = contentId,
            ContentType = parsedContentType,
            UserId = userGuid
        };

        var result = await Mediator.Send(command);

        if (result.Succeeded)
        {
            return Success("Content unliked successfully");
        }

        return BadRequest("Failed to unlike content", result.Errors);
    }

    [HttpGet("{contentType}/{contentId}/status")]
    public async Task<IActionResult> GetLikeStatus(Guid contentId, string contentType)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Success(new { IsLiked = false }, "Like status retrieved");
        }

        if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
        {
            return Unauthorized("Invalid user context");
        }

        if (!Enum.TryParse<Domain.Enums.Common.ContentType>(contentType, out var parsedContentType))
        {
            return BadRequest("Invalid content type");
        }

        try
        {
            // This would need a query to check like status
            // For now, return a placeholder
            return Success(new { IsLiked = false }, "Like status retrieved");
        }
        catch (Exception)
        {
            return Success(new { IsLiked = false }, "Like status retrieved");
        }
    }
}