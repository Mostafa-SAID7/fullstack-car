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
public class VideosController : ControllerBase
{
    private readonly IMediator _mediator;

    public VideosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all videos with filtering and pagination
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetVideos([FromQuery] GetVideosQuery query)
    {
        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Videos retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve videos"
        });
    }

    /// <summary>
    /// Get a specific video by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVideo(Guid id)
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
        
        var result = await _mediator.Send(query);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Video retrieved successfully"
            });
        }

        return NotFound(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Video not found"
        });
    }

    /// <summary>
    /// Create a new video
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateVideo([FromBody] CreateVideoRequest request)
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

        var command = new CreateVideoCommand
        {
            CreatorId = userGuid,
            Request = request
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return CreatedAtAction(
                nameof(GetVideo),
                new { id = result.Data.Id },
                new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Video created successfully"
                });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to create video"
        });
    }

    /// <summary>
    /// Update an existing video
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateVideo(Guid id, [FromBody] UpdateVideoRequest request)
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

        var command = new UpdateVideoCommand
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
                Message = "Video updated successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to update video"
        });
    }

    /// <summary>
    /// Delete a video
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteVideo(Guid id)
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

        var command = new DeleteVideoCommand
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
                Message = "Video deleted successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to delete video"
        });
    }

    /// <summary>
    /// Publish a video
    /// </summary>
    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishVideo(Guid id)
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

        var command = new PublishVideoCommand
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
                Message = "Video published successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to publish video"
        });
    }

    /// <summary>
    /// Get user's own videos
    /// </summary>
    [HttpGet("my-videos")]
    public async Task<IActionResult> GetMyVideos([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
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

        var query = new GetMyVideosQuery
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
                Message = "My videos retrieved successfully"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to retrieve videos"
        });
    }

    /// <summary>
    /// Bulk delete videos
    /// </summary>
    [HttpPost("bulk-delete")]
    public async Task<IActionResult> BulkDeleteVideos([FromBody] BulkDeleteVideosRequest request)
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

        if (request.VideoIds == null || !request.VideoIds.Any())
        {
            return BadRequest(new
            {
                Success = false,
                Message = "No video IDs provided"
            });
        }

        var command = new BulkDeleteVideosCommand
        {
            VideoIds = request.VideoIds,
            UserId = userGuid
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Bulk delete operation completed"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to complete bulk delete operation"
        });
    }

    /// <summary>
    /// Bulk publish videos
    /// </summary>
    [HttpPost("bulk-publish")]
    public async Task<IActionResult> BulkPublishVideos([FromBody] BulkPublishVideosRequest request)
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

        if (request.VideoIds == null || !request.VideoIds.Any())
        {
            return BadRequest(new
            {
                Success = false,
                Message = "No video IDs provided"
            });
        }

        var command = new BulkPublishVideosCommand
        {
            VideoIds = request.VideoIds,
            UserId = userGuid
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Bulk publish operation completed"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to complete bulk publish operation"
        });
    }

    /// <summary>
    /// Bulk unpublish videos
    /// </summary>
    [HttpPost("bulk-unpublish")]
    public async Task<IActionResult> BulkUnpublishVideos([FromBody] BulkUnpublishVideosRequest request)
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

        if (request.VideoIds == null || !request.VideoIds.Any())
        {
            return BadRequest(new
            {
                Success = false,
                Message = "No video IDs provided"
            });
        }

        var command = new BulkUnpublishVideosCommand
        {
            VideoIds = request.VideoIds,
            UserId = userGuid
        };

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Bulk unpublish operation completed"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to complete bulk unpublish operation"
        });
    }

    /// <summary>
    /// Bulk update video metadata
    /// </summary>
    [HttpPost("bulk-update-metadata")]
    public async Task<IActionResult> BulkUpdateVideoMetadata([FromBody] BulkUpdateVideoMetadataRequest request)
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

        if (request.VideoIds == null || !request.VideoIds.Any())
        {
            return BadRequest(new
            {
                Success = false,
                Message = "No video IDs provided"
            });
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

        var result = await _mediator.Send(command);
        
        if (result.IsSuccess)
        {
            return Ok(new
            {
                Success = true,
                Data = result.Data,
                Message = "Bulk update metadata operation completed"
            });
        }

        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors,
            Message = "Failed to complete bulk update metadata operation"
        });
    }
}