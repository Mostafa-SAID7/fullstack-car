using Application.Features.Media.Videos.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Media.Videos;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos/discovery")]
public class VideoDiscoveryController : ControllerBase
{
    private readonly IMediator _mediator;

    public VideoDiscoveryController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpGet("trending")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrendingVideos([FromQuery] int count = 10, [FromQuery] int days = 7)
    {
        var query = new GetTrendingVideosQuery
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
                Message = "Trending videos retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve trending videos"
        });
    }
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchVideos([FromQuery] string query = "", [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        // TODO: Implement video search
        return Ok(new
        {
            Success = true,
            Data = new object[0],
            Message = "Video search completed successfully"
        });
    }
    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeaturedVideos([FromQuery] int count = 10)
    {
        // TODO: Implement featured videos query
        return Ok(new
        {
            Success = true,
            Data = new object[0],
            Message = "Featured videos retrieved successfully"
        });
    }
    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVideoCategories()
    {
        // TODO: Implement video categories query
        return Ok(new
        {
            Success = true,
            Data = new object[0],
            Message = "Video categories retrieved successfully"
        });
    }
}


