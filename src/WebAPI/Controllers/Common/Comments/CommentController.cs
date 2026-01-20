using Application.Features.Common.Comments.Commands;
using Application.Features.Common.Comments.DTOs.Requests;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Common.Comments;

[Authorize]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/common/comments")]
public class CommentController : BaseController
{
    private readonly ICurrentUserService _currentUserService;

    public CommentController(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateComment([FromBody] CreateCommentRequest request)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Unauthorized("User authentication required");
        }

        if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
        {
            return Unauthorized("Invalid user context");
        }

        var command = new CreateCommentCommand
        {
            ContentId = request.ContentId,
            ContentType = request.ContentType,
            UserId = userGuid,
            Content = request.Content,
            ParentCommentId = request.ParentCommentId
        };

        var result = await Mediator.Send(command);

        if (result.Succeeded)
        {
            return Created(string.Empty, new { message = "Comment created successfully" });
        }

        return BadRequest("Failed to create comment", result.Errors);
    }

    [HttpGet("{contentType}/{contentId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetComments(
        Guid contentId, 
        string contentType,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool includeReplies = true)
    {
        if (!Enum.TryParse<Domain.Enums.Common.ContentType>(contentType, out var parsedContentType))
        {
            return BadRequest("Invalid content type");
        }

        try
        {
            // This would need a query implementation
            // For now, return empty result
            return Success(new { Items = new List<object>(), TotalCount = 0 }, "Comments retrieved successfully");
        }
        catch (Exception)
        {
            return BadRequest("Failed to retrieve comments");
        }
    }
}