using Application.Features.Media.Videos.Commands;
using Application.Features.Media.Videos.DTOs.Requests;
using Application.Features.Media.Videos.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media.Videos;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos")]
[Authorize]
public class VideosController : BaseController
{
    private readonly ILogger<VideosController> _logger;

    public VideosController(ILogger<VideosController> logger)
    {
        _logger = logger;
    }
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetVideos([FromQuery] GetVideosQuery query)
    {
        try
        {
            var result = await Mediator.Send(query);
            
            return FromResult(result, "Videos retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving videos");
            return InternalServerError("Failed to retrieve videos", ex.Message);
        }
    }
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVideo(Guid id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid? userGuid = null;
            
            if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var parsedUserId))
            {
                userGuid = parsedUserId;
            }

            var query = new GetVideoByIdQuery 
            { 
                Id = id,
                UserId = userGuid
            };
            
            var result = await Mediator.Send(query);
            
            return FromResultNotFound(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving video with ID: {VideoId}", id);
            return InternalServerError("Failed to retrieve video", ex.Message);
        }
    }
    [HttpPost]
    public async Task<IActionResult> CreateVideo([FromBody] CreateVideoRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new CreateVideoCommand
            {
                CreatorId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                var location = Url.Action(nameof(GetVideo), new { id = result.Data.Id });
                return FromResultCreated(result, location ?? string.Empty, "Video created successfully");
            }

            return FromResult(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating video");
            return InternalServerError("Failed to create video", ex.Message);
        }
    }
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateVideo(Guid id, [FromBody] UpdateVideoRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new UpdateVideoCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Video updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating video with ID: {VideoId}", id);
            return InternalServerError("Failed to update video", ex.Message);
        }
    }
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteVideo(Guid id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new DeleteVideoCommand
            {
                Id = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Video deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting video with ID: {VideoId}", id);
            return InternalServerError("Failed to delete video", ex.Message);
        }
    }
    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishVideo(Guid id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            var command = new PublishVideoCommand
            {
                Id = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Video published successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing video with ID: {VideoId}", id);
            return InternalServerError("Failed to publish video", ex.Message);
        }
    }
    [HttpGet("my-videos")]
    public async Task<IActionResult> GetMyVideos([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
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

            var query = new GetMyVideosQuery
            {
                UserId = userGuid,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            
            return FromResult(result, "My videos retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user's videos");
            return InternalServerError("Failed to retrieve videos", ex.Message);
        }
    }
    [HttpPost("bulk-delete")]
    public async Task<IActionResult> BulkDeleteVideos([FromBody] BulkDeleteVideosRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            if (request.VideoIds == null || !request.VideoIds.Any())
            {
                return BadRequest("No video IDs provided");
            }

            if (request.VideoIds.Count() > 100)
            {
                return BadRequest("Cannot delete more than 100 videos at once");
            }

            var command = new BulkDeleteVideosCommand
            {
                VideoIds = request.VideoIds,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Bulk delete operation completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing bulk delete operation");
            return InternalServerError("Failed to complete bulk delete operation", ex.Message);
        }
    }
    [HttpPost("bulk-publish")]
    public async Task<IActionResult> BulkPublishVideos([FromBody] BulkPublishVideosRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            if (request.VideoIds == null || !request.VideoIds.Any())
            {
                return BadRequest("No video IDs provided");
            }

            if (request.VideoIds.Count() > 100)
            {
                return BadRequest("Cannot publish more than 100 videos at once");
            }

            var command = new BulkPublishVideosCommand
            {
                VideoIds = request.VideoIds,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Bulk publish operation completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing bulk publish operation");
            return InternalServerError("Failed to complete bulk publish operation", ex.Message);
        }
    }
    [HttpPost("bulk-unpublish")]
    public async Task<IActionResult> BulkUnpublishVideos([FromBody] BulkUnpublishVideosRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            if (request.VideoIds == null || !request.VideoIds.Any())
            {
                return BadRequest("No video IDs provided");
            }

            if (request.VideoIds.Count() > 100)
            {
                return BadRequest("Cannot unpublish more than 100 videos at once");
            }

            var command = new BulkUnpublishVideosCommand
            {
                VideoIds = request.VideoIds,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Bulk unpublish operation completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing bulk unpublish operation");
            return InternalServerError("Failed to complete bulk unpublish operation", ex.Message);
        }
    }
    [HttpPost("bulk-update-metadata")]
    public async Task<IActionResult> BulkUpdateVideoMetadata([FromBody] BulkUpdateVideoMetadataRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            if (request.VideoIds == null || !request.VideoIds.Any())
            {
                return BadRequest("No video IDs provided");
            }

            if (request.VideoIds.Count() > 100)
            {
                return BadRequest("Cannot update more than 100 videos at once");
            }

            var command = new BulkUpdateVideoMetadataCommand
            {
                VideoIds = request.VideoIds,
                UserId = userGuid,
                Metadata = new BulkUpdateVideoMetadata
                {
                    Tags = request.Metadata.Tags,
                    IsPublic = request.Metadata.IsPublic,
                    AllowComments = request.Metadata.AllowComments,
                    Category = request.Metadata.Category
                }
            };

            var result = await Mediator.Send(command);
            
            return FromResult(result, "Bulk update metadata operation completed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing bulk update metadata operation");
            return InternalServerError("Failed to complete bulk update metadata operation", ex.Message);
        }
    }
}


