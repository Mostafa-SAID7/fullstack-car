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
public class VideoInteractionController : ControllerBase
{
    private readonly IMediator _mediator;

    public VideoInteractionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Like or dislike a video
    /// </summary>
    [HttpPost("{id:guid}/like")]
    public async Task<IActionResult> LikeVideo(Guid id, [FromBody] LikeVideoRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized(new
            {
                Success = false,
                Message = "User not authenticated"
            });
        }

        var command = new LikeVideoCommand
        {
            VideoId = id,
            UserId = userGuid,
            IsLike = request.IsLike
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Message = request.IsLike ? "Video liked successfully" : "Video disliked successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to process like/dislike"
        });
    }

    /// <summary>
    /// Add a comment to a video
    /// </summary>
    [HttpPost("{id:guid}/comments")]
    public async Task<IActionResult> AddComment(Guid id, [FromBody] AddVideoCommentRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized(new
            {
                Success = false,
                Message = "User not authenticated"
            });
        }

        var command = new AddVideoCommentCommand
        {
            VideoId = id,
            UserId = userGuid,
            Content = request.Content,
            ParentCommentId = request.ParentCommentId
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Comment added successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to add comment"
        });
    }
}