using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.DTOs.Requests;
using Application.Features.Media.Shared.DTOs.Requests;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media.Podcasts;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/podcasts/interactions")]
[Authorize]
public class PodcastInteractionController : ControllerBase
{
    private readonly IMediator _mediator;

    public PodcastInteractionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Like a podcast
    /// </summary>
    [HttpPost("{id:guid}/like")]
    public async Task<IActionResult> LikePodcast(Guid id)
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

        var command = new LikePodcastCommand
        {
            PodcastId = id,
            UserId = userGuid
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Message = "Podcast liked successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to like podcast"
        });
    }

    /// <summary>
    /// Add a comment to a podcast
    /// </summary>
    [HttpPost("{id:guid}/comments")]
    public async Task<IActionResult> AddComment(Guid id, [FromBody] AddPodcastCommentRequest request)
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

        var command = new AddPodcastCommentCommand
        {
            PodcastId = id,
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

    /// <summary>
    /// Subscribe to a podcast
    /// </summary>
    [HttpPost("{id:guid}/subscribe")]
    public async Task<IActionResult> SubscribeToPodcast(Guid id)
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

        // TODO: Implement podcast subscription
        return Ok(new
        {
            Success = true,
            Message = "Subscribed to podcast successfully"
        });
    }

    /// <summary>
    /// Unsubscribe from a podcast
    /// </summary>
    [HttpDelete("{id:guid}/subscribe")]
    public async Task<IActionResult> UnsubscribeFromPodcast(Guid id)
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

        // TODO: Implement podcast unsubscription
        return Ok(new
        {
            Success = true,
            Message = "Unsubscribed from podcast successfully"
        });
    }

    /// <summary>
    /// Get user's podcast subscriptions
    /// </summary>
    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetUserSubscriptions()
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

        // TODO: Implement user subscriptions query
        return Ok(new
        {
            Success = true,
            Data = new object[0],
            Message = "User subscriptions retrieved successfully"
        });
    }
}