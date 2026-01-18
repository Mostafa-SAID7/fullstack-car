using Application.Features.Media.Podcasts.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Media.Podcasts;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/podcasts/discovery")]
public class PodcastDiscoveryController : ControllerBase
{
    private readonly IMediator _mediator;

    public PodcastDiscoveryController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpGet("trending")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrendingPodcasts([FromQuery] int count = 10, [FromQuery] int days = 7)
    {
        var query = new GetTrendingPodcastsQuery
        {
            Count = count,
            Days = days
        };

        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Trending podcasts retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve trending podcasts"
        });
    }
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchPodcasts([FromQuery] string query = "", [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        // TODO: Implement podcast search
        return Ok(new
        {
            Success = true,
            Data = new object[0],
            Message = "Podcasts search completed successfully"
        });
    }
    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeaturedPodcasts([FromQuery] int count = 10)
    {
        var query = new GetFeaturedPodcastsQuery { Count = count };
        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Featured podcasts retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve featured podcasts"
        });
    }
    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcastCategories()
    {
        var query = new GetPodcastCategoriesQuery();
        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Podcast categories retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve podcast categories"
        });
    }
}


