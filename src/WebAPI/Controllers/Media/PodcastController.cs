using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.Queries;
using Application.Features.Media.Podcasts.DTOs;
using MediatR;

namespace WebAPI.Controllers.Media;

[ApiController]
[Route("api/v7/[controller]")]
[ApiVersion("7.0")]
[Authorize]
public class PodcastController : BaseController
{
    private readonly IMediator _mediator;

    public PodcastController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all podcasts with filtering and pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPodcasts([FromQuery] GetPodcastsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Get podcast by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPodcast(int id)
    {
        var query = new GetPodcastByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Create a new podcast
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreatePodcast([FromBody] CreatePodcastCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetPodcast), new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Update an existing podcast
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePodcast(int id, [FromBody] UpdatePodcastCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Delete a podcast
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePodcast(int id)
    {
        var command = new DeletePodcastCommand { Id = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Upload podcast audio file
    /// </summary>
    [HttpPost("{id}/upload")]
    public async Task<IActionResult> UploadPodcastFile(int id, IFormFile file)
    {
        var command = new UploadPodcastFileCommand 
        { 
            PodcastId = id, 
            File = file 
        };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Get podcasts by category
    /// </summary>
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetPodcastsByCategory(int categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var query = new GetPodcastsByCategoryQuery 
        { 
            CategoryId = categoryId, 
            Page = page, 
            PageSize = pageSize 
        };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Search podcasts
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchPodcasts([FromQuery] SearchPodcastsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Get featured podcasts
    /// </summary>
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedPodcasts([FromQuery] int count = 10)
    {
        var query = new GetFeaturedPodcastsQuery { Count = count };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Get trending podcasts
    /// </summary>
    [HttpGet("trending")]
    public async Task<IActionResult> GetTrendingPodcasts([FromQuery] int count = 10)
    {
        var query = new GetTrendingPodcastsQuery { Count = count };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Subscribe to a podcast
    /// </summary>
    [HttpPost("{id}/subscribe")]
    public async Task<IActionResult> SubscribeToPodcast(int id)
    {
        var command = new SubscribeToPodcastCommand { PodcastId = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Unsubscribe from a podcast
    /// </summary>
    [HttpDelete("{id}/subscribe")]
    public async Task<IActionResult> UnsubscribeFromPodcast(int id)
    {
        var command = new UnsubscribeFromPodcastCommand { PodcastId = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Get user's subscribed podcasts
    /// </summary>
    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetUserSubscriptions()
    {
        var query = new GetUserPodcastSubscriptionsQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Get podcast analytics
    /// </summary>
    [HttpGet("{id}/analytics")]
    public async Task<IActionResult> GetPodcastAnalytics(int id)
    {
        var query = new GetPodcastAnalyticsQuery { PodcastId = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Record podcast play/listen event
    /// </summary>
    [HttpPost("{id}/play")]
    public async Task<IActionResult> RecordPodcastPlay(int id, [FromBody] RecordPodcastPlayCommand command)
    {
        command.PodcastId = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Get podcast categories
    /// </summary>
    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcastCategories()
    {
        var query = new GetPodcastCategoriesQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Get podcast dashboard data for user
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetPodcastDashboard()
    {
        var query = new GetPodcastDashboardQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}