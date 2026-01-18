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
[Route("api/v{version:apiVersion}/media/podcast-series")]
[Authorize]
public class PodcastSeriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PodcastSeriesController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcastSeries([FromQuery] GetPodcastSeriesQuery query)
    {
        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Podcast series retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve podcast series"
        });
    }
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcastSeriesById(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Guid? userGuid = null;
        
        if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var parsedUserId))
        {
            userGuid = parsedUserId;
        }

        var query = new GetPodcastSeriesByIdQuery 
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
                Message = "Podcast series retrieved successfully"
            });
        }

        return NotFound(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Podcast series not found"
        });
    }
    [HttpPost]
    public async Task<IActionResult> CreatePodcastSeries([FromBody] CreatePodcastSeriesRequest request)
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

        var command = new CreatePodcastSeriesCommand
        {
            CreatorId = userGuid,
            Request = request
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return CreatedAtAction(
                nameof(GetPodcastSeries),
                new { id = result.Data.Id },
                new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Podcast series created successfully"
                });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to create podcast series"
        });
    }
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePodcastSeries(Guid id, [FromBody] UpdatePodcastSeriesRequest request)
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

        var command = new UpdatePodcastSeriesCommand
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
                Message = "Podcast series updated successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to update podcast series"
        });
    }
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePodcastSeries(Guid id)
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

        var command = new DeletePodcastSeriesCommand
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
                Message = "Podcast series deleted successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to delete podcast series"
        });
    }
}


