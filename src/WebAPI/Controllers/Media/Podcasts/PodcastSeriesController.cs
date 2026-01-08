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

    /// <summary>
    /// Get all podcast series with filtering and pagination
    /// </summary>
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

    /// <summary>
    /// Create a new podcast series
    /// </summary>
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
}