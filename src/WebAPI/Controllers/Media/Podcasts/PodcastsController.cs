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
public class PodcastsController : BaseController
{
    private readonly ILogger<PodcastsController> _logger;

    public PodcastsController(ILogger<PodcastsController> logger)
    {
        _logger = logger;
    }
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcasts([FromQuery] GetPodcastsQuery query)
    {
        try
        {
            var result = await Mediator.Send(query);
            
            return FromResult(result, "Podcasts retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving podcasts");
            return InternalServerError("Failed to retrieve podcasts", ex.Message);
        }
    }
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcast(Guid id)
    {
        try
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
            
            var result = await Mediator.Send(query);
            
            return FromResultNotFound(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving podcast with ID: {PodcastId}", id);
            return InternalServerError("Failed to retrieve podcast", ex.Message);
        }
    }
    [HttpPost]
    public async Task<IActionResult> CreatePodcast([FromBody] CreatePodcastRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new CreatePodcastCommand
            {
                CreatorId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                var location = Url.Action(nameof(GetPodcast), new { id = result.Data.Id });
                return FromResultCreated(result, location ?? string.Empty, "Podcast created successfully");
            }

            return FromResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating podcast");
            return InternalServerError("Failed to create podcast", ex.Message);
        }
    }
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePodcast(Guid id, [FromBody] UpdatePodcastRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new UpdatePodcastCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Podcast updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating podcast with ID: {PodcastId}", id);
            return InternalServerError("Failed to update podcast", ex.Message);
        }
    }
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePodcast(Guid id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new DeletePodcastCommand
            {
                Id = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Podcast deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting podcast with ID: {PodcastId}", id);
            return InternalServerError("Failed to delete podcast", ex.Message);
        }
    }
    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishPodcast(Guid id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new PublishPodcastCommand
            {
                Id = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Podcast published successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing podcast with ID: {PodcastId}", id);
            return InternalServerError("Failed to publish podcast", ex.Message);
        }
    }
    [HttpGet("my-podcasts")]
    public async Task<IActionResult> GetMyPodcasts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            if (pageNumber < 1)
            {
                return BadRequest("Page number must be greater than 0");
            }

            if (pageSize < 1 || pageSize > 100)
            {
                return BadRequest("Page size must be between 1 and 100");
            }

            var query = new GetMyPodcastsQuery
            {
                UserId = userGuid,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            
            return FromResult(result, "My podcasts retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user's podcasts");
            return InternalServerError("Failed to retrieve podcasts", ex.Message);
        }
    }
}