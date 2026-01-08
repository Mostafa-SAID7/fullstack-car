using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.DTOs.Requests;
using Application.Features.Media.Podcasts.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media.Podcasts;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/podcasts")]
[Authorize]
public class PodcastsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PodcastsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all podcasts with filtering and pagination
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcasts([FromQuery] GetPodcastsQuery query)
    {
        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Podcasts retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve podcasts"
        });
    }

    /// <summary>
    /// Get a specific podcast by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcast(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Guid? userGuid = null;
        
        if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var parsedUserId))
        {
            userGuid = parsedUserId;
        }

        var query = new GetPodcastByIdQuery 
        { 
            Id = id,
            UserId = userGuid
        };
        
        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Podcast retrieved successfully"
            });
        }

        return NotFound(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Podcast not found"
        });
    }

    /// <summary>
    /// Create a new podcast
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreatePodcast([FromBody] CreatePodcastRequest request)
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

        var command = new CreatePodcastCommand
        {
            CreatorId = userGuid,
            Request = request
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return CreatedAtAction(
                nameof(GetPodcast),
                new { id = result.Data.Id },
                new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Podcast created successfully"
                });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to create podcast"
        });
    }

    /// <summary>
    /// Update an existing podcast
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePodcast(Guid id, [FromBody] UpdatePodcastRequest request)
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

        var command = new UpdatePodcastCommand
        {
            Id = id,
            UserId = userGuid,
            Request = request
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Podcast updated successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to update podcast"
        });
    }

    /// <summary>
    /// Delete a podcast
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePodcast(Guid id)
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

        var command = new DeletePodcastCommand
        {
            Id = id,
            UserId = userGuid
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Message = "Podcast deleted successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to delete podcast"
        });
    }

    /// <summary>
    /// Publish a podcast
    /// </summary>
    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishPodcast(Guid id)
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

        var command = new PublishPodcastCommand
        {
            Id = id,
            UserId = userGuid
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Podcast published successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to publish podcast"
        });
    }

    /// <summary>
    /// Get user's own podcasts
    /// </summary>
    [HttpGet("my-podcasts")]
    public async Task<IActionResult> GetMyPodcasts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
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

        var query = new GetMyPodcastsQuery
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
                Message = "My podcasts retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve podcasts"
        });
    }
}