using Application.Features.Media.Videos.Commands;
using Application.Features.Media.Videos.DTOs.Requests;
using Application.Features.Media.Shared.DTOs.Requests;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media.Videos;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos/interactions")]
[Authorize]
public class VideoInteractionController : BaseController
{
    private readonly ILogger<VideoInteractionController> _logger;

    public VideoInteractionController(ILogger<VideoInteractionController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Like or dislike a video
    /// </summary>
    [HttpPost("{id:guid}/like")]
    public async Task<IActionResult> LikeVideo(Guid id, [FromBody] LikeVideoRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new LikeVideoCommand
            {
                VideoId = id,
                UserId = userGuid,
                IsLike = request.IsLike
            };

            var result = await Mediator.Send(command);
            
            var message = request.IsLike ? "Video liked successfully" : "Video disliked successfully";
            return FromResult(result, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing like/dislike for video {VideoId}", id);
            return InternalServerError("Failed to process like/dislike", ex.Message);
        }
    }

    /// <summary>
    /// Add a comment to a video
    /// </summary>
    [HttpPost("{id:guid}/comments")]
    public async Task<IActionResult> AddComment(Guid id, [FromBody] AddVideoCommentRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return BadRequest("Comment content is required");
            }

            if (request.Content.Length > 1000)
            {
                return BadRequest("Comment content cannot exceed 1000 characters");
            }

            var command = new AddVideoCommentCommand
            {
                VideoId = id,
                UserId = userGuid,
                Content = request.Content,
                ParentCommentId = request.ParentCommentId
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Comment added successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding comment to video {VideoId}", id);
            return InternalServerError("Failed to add comment", ex.Message);
        }
    }
}