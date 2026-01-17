using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.DTOs.Requests;
using Application.Features.Media.Podcasts.Queries;
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

        var command = new SubscribeToPodcastCommand
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
                Message = "Subscribed to podcast successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to subscribe to podcast"
        });
    }
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

        var command = new UnsubscribeFromPodcastCommand
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
                Message = "Unsubscribed from podcast successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to unsubscribe from podcast"
        });
    }
    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetUserSubscriptions([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
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

        var query = new GetUserPodcastSubscriptionsQuery
        {
            UserId = userGuid,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "User subscriptions retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve subscriptions"
        });
    }
}