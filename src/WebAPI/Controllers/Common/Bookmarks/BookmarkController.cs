using Application.Features.Common.Bookmarks.Commands;
using Application.Features.Common.Bookmarks.DTOs.Requests;
using Application.Features.Common.Bookmarks.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Common.Bookmarks;

[Authorize]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/common/bookmarks")]
public class BookmarkController : BaseController
{
    private readonly ICurrentUserService _currentUserService;

    public BookmarkController(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    [HttpPost]
    public async Task<IActionResult> ToggleBookmark([FromBody] BookmarkRequest request)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Unauthorized("User authentication required");
        }

        if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
        {
            return Unauthorized("Invalid user context");
        }

        var command = new BookmarkCommand(
            request.ContentId,
            request.ContentType,
            userGuid,
            request.Notes
        );

        var result = await Mediator.Send(command);

        if (result.Succeeded)
        {
            return Success("Bookmark toggled successfully");
        }

        return BadRequest("Failed to toggle bookmark", result.Errors);
    }

    [HttpDelete("{contentType}/{contentId}")]
    public async Task<IActionResult> RemoveBookmark(Guid contentId, string contentType)
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

        var command = new RemoveBookmarkCommand
        {
            UserId = userGuid,
            ContentId = contentId,
            ContentType = parsedContentType
        };

        var result = await Mediator.Send(command);

        if (result.Succeeded)
        {
            return Success("Bookmark removed successfully");
        }

        return BadRequest("Failed to remove bookmark", result.Errors);
    }

    [HttpGet("user")]
    [OutputCache(Duration = 30, Tags = new[] { "Bookmarks", "UserBookmarks" })]
    public async Task<IActionResult> GetUserBookmarks([FromQuery] GetUserBookmarksQuery query)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Unauthorized("User authentication required");
        }

        if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
        {
            return Unauthorized("Invalid user context");
        }

        query.UserId = userGuid;
        var result = await Mediator.Send(query);

        if (result.Succeeded)
        {
            return Success(result.Data, "User bookmarks retrieved successfully");
        }

        return BadRequest("Failed to retrieve user bookmarks", result.Errors);
    }

    [HttpGet("{contentType}/{contentId}/status")]
    [OutputCache(Duration = 60, Tags = new[] { "Bookmarks", "BookmarkStatus" })]
    public async Task<IActionResult> GetBookmarkStatus(Guid contentId, string contentType)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Success(new { IsBookmarked = false }, "Bookmark status retrieved");
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
            var bookmarks = await Mediator.Send(new GetUserBookmarksQuery 
            { 
                UserId = userGuid,
                ContentType = parsedContentType,
                PageSize = 1
            });

            if (bookmarks.Succeeded && bookmarks.Data.Items.Any(b => b.ContentId == contentId))
            {
                var bookmark = bookmarks.Data.Items.First(b => b.ContentId == contentId);
                return Success(new 
                { 
                    IsBookmarked = true,
                    BookmarkedAt = bookmark.CreatedAt,
                    Notes = bookmark.Notes
                }, "Bookmark status retrieved");
            }

            return Success(new { IsBookmarked = false }, "Bookmark status retrieved");
        }
        catch (Exception)
        {
            return Success(new { IsBookmarked = false }, "Bookmark status retrieved");
        }
    }
}