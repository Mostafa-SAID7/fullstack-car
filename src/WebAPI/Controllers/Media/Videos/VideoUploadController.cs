using Application.Features.Media.Videos.Commands;
using Application.Features.Media.Videos.DTOs.Requests;
using Application.Features.Media.Shared.DTOs.Requests;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media.Videos;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos/upload")]
[Authorize]
public class VideoUploadController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public VideoUploadController(IMediator mediator, IWebHostEnvironment environment, IConfiguration configuration)
    {
        _mediator = mediator;
        _environment = environment;
        _configuration = configuration;
    }

    /// <summary>
    /// Upload a video file
    /// </summary>
    [HttpPost]
    [RequestSizeLimit(2_000_000_000)] // 2GB limit as per requirements
    public async Task<IActionResult> UploadVideo(IFormFile file, [FromForm] Application.Features.Media.Shared.DTOs.Requests.UploadVideoRequest request)
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

        if (file == null || file.Length == 0)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "No file uploaded"
            });
        }

        // Validate file type
        var allowedVideoTypes = new[] { 
            "video/mp4", 
            "video/avi", 
            "video/mov", 
            "video/wmv", 
            "video/webm", 
            "video/quicktime",
            "video/x-msvideo", // AVI alternative MIME type
            "video/3gpp",      // 3GP
            "video/x-ms-wmv"   // WMV alternative MIME type
        };
        
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".mp4", ".avi", ".mov", ".wmv", ".webm", ".3gp" };
        
        if (!allowedVideoTypes.Contains(file.ContentType.ToLower()) && !allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new
            {
                Success = false,
                Message = $"Invalid file type. Allowed types: {string.Join(", ", allowedExtensions)}. Received: {file.ContentType}"
            });
        }

        // Validate file size (2GB max as per requirements)
        const long maxFileSize = 2_000_000_000; // 2GB
        if (file.Length > maxFileSize)
        {
            return BadRequest(new
            {
                Success = false,
                Message = $"File size exceeds 2GB limit. File size: {file.Length / (1024 * 1024)} MB"
            });
        }

        // Validate file name
        if (string.IsNullOrWhiteSpace(file.FileName) || file.FileName.Length > 255)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "Invalid file name"
            });
        }

        // Additional security validation - check for executable extensions
        var dangerousExtensions = new[] { ".exe", ".bat", ".cmd", ".scr", ".pif", ".com" };
        if (dangerousExtensions.Contains(fileExtension))
        {
            return BadRequest(new
            {
                Success = false,
                Message = "File type not allowed for security reasons"
            });
        }

        try
        {
            // Create video record first
            var createCommand = new CreateVideoCommand
            {
                CreatorId = userGuid,
                Request = new CreateVideoRequest
                {
                    Title = request.Title,
                    Description = request.Description,
                    Quality = request.Quality,
                    Tags = request.Tags,
                    IsPublic = request.IsPublic,
                    AllowComments = request.AllowComments
                }
            };

            var createResult = await _mediator.Send(createCommand);
            if (!createResult.IsSuccess)
            {
                return BadRequest(new
                {
                    Success = false,
                    Errors = createResult.Errors,
                    Message = "Failed to create video record"
                });
            }

            // Generate unique filename
            var videoId = createResult.Data.Id;
            var fileName = $"{videoId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            
            // Create upload directory
            var uploadPath = Path.Combine(_environment.WebRootPath, "uploads", "videos");
            Directory.CreateDirectory(uploadPath);
            
            var filePath = Path.Combine(uploadPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update video with file information
            var videoUrl = $"/uploads/videos/{fileName}";
            var updateCommand = new UpdateVideoFileCommand
            {
                VideoId = videoId,
                VideoUrl = videoUrl,
                FileSize = file.Length,
                Duration = TimeSpan.Zero // TODO: Extract from video metadata
            };

            var updateResult = await _mediator.Send(updateCommand);
            if (!updateResult.IsSuccess)
            {
                // Clean up uploaded file if database update fails
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                return BadRequest(new
                {
                    Success = false,
                    Errors = updateResult.Errors,
                    Message = "Failed to update video file information"
                });
            }

            return Ok(new
            {
                Success = true,
                Data = new
                {
                    VideoId = videoId,
                    VideoUrl = videoUrl,
                    FileSize = file.Length,
                    FileName = fileName,
                    UploadedAt = DateTime.UtcNow
                },
                Message = "Video uploaded successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Success = false,
                Message = "An error occurred while uploading the video",
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Upload video with progress tracking (chunked upload)
    /// </summary>
    [HttpPost("chunked")]
    public async Task<IActionResult> UploadVideoChunked(
        [FromForm] IFormFile chunk,
        [FromForm] string uploadId,
        [FromForm] int chunkNumber,
        [FromForm] int totalChunks,
        [FromForm] string fileName,
        [FromForm] Application.Features.Media.Shared.DTOs.Requests.UploadVideoRequest? metadata = null)
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

        if (chunk == null || chunk.Length == 0)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "No chunk uploaded"
            });
        }

        try
        {
            // Create upload directory
            var uploadPath = Path.Combine(_environment.WebRootPath, "uploads", "temp", uploadId);
            Directory.CreateDirectory(uploadPath);

            // Save chunk
            var chunkPath = Path.Combine(uploadPath, $"chunk_{chunkNumber:D4}");
            using (var stream = new FileStream(chunkPath, FileMode.Create))
            {
                await chunk.CopyToAsync(stream);
            }

            // Check if all chunks are uploaded
            var uploadedChunks = Directory.GetFiles(uploadPath, "chunk_*").Length;
            
            if (uploadedChunks == totalChunks)
            {
                // Combine chunks into final file
                var fileExtension = Path.GetExtension(fileName);
                var finalFileName = $"{uploadId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
                var finalPath = Path.Combine(_environment.WebRootPath, "uploads", "videos", finalFileName);
                
                Directory.CreateDirectory(Path.GetDirectoryName(finalPath)!);

                using (var finalStream = new FileStream(finalPath, FileMode.Create))
                {
                    for (int i = 1; i <= totalChunks; i++)
                    {
                        var chunkFilePath = Path.Combine(uploadPath, $"chunk_{i:D4}");
                        if (System.IO.File.Exists(chunkFilePath))
                        {
                            using var chunkStream = new FileStream(chunkFilePath, FileMode.Open);
                            await chunkStream.CopyToAsync(finalStream);
                        }
                    }
                }

                // Clean up temp chunks
                Directory.Delete(uploadPath, true);

                // Create video record if metadata provided
                if (metadata != null)
                {
                    var createCommand = new CreateVideoCommand
                    {
                        CreatorId = userGuid,
                        Request = new CreateVideoRequest
                        {
                            Title = metadata.Title,
                            Description = metadata.Description,
                            Quality = metadata.Quality,
                            Tags = metadata.Tags,
                            IsPublic = metadata.IsPublic,
                            AllowComments = metadata.AllowComments
                        }
                    };

                    var createResult = await _mediator.Send(createCommand);
                    if (createResult.IsSuccess)
                    {
                        var videoUrl = $"/uploads/videos/{finalFileName}";
                        var fileInfo = new FileInfo(finalPath);
                        
                        var updateCommand = new UpdateVideoFileCommand
                        {
                            VideoId = createResult.Data.Id,
                            VideoUrl = videoUrl,
                            FileSize = fileInfo.Length,
                            Duration = TimeSpan.Zero // TODO: Extract from video metadata
                        };

                        var updateResult = await _mediator.Send(updateCommand);
                        if (updateResult.IsSuccess)
                        {
                            return Ok(new
                            {
                                Success = true,
                                Data = new
                                {
                                    VideoId = createResult.Data.Id,
                                    VideoUrl = videoUrl,
                                    FileSize = fileInfo.Length,
                                    FileName = finalFileName,
                                    UploadedAt = DateTime.UtcNow,
                                    IsComplete = true
                                },
                                Message = "Video upload completed successfully"
                            });
                        }
                        else
                        {
                            return BadRequest(new
                            {
                                Success = false,
                                Errors = updateResult.Errors,
                                Message = "Failed to update video file information"
                            });
                        }
                    }
                }

                return Ok(new
                {
                    Success = true,
                    Data = new
                    {
                        FileName = finalFileName,
                        FileSize = new FileInfo(finalPath).Length,
                        IsComplete = true
                    },
                    Message = "File upload completed successfully"
                });
            }

            return Ok(new
            {
                Success = true,
                Data = new
                {
                    ChunkNumber = chunkNumber,
                    TotalChunks = totalChunks,
                    UploadedChunks = uploadedChunks,
                    Progress = (double)uploadedChunks / totalChunks * 100,
                    IsComplete = false
                },
                Message = $"Chunk {chunkNumber} of {totalChunks} uploaded successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Success = false,
                Message = "An error occurred while uploading the chunk",
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Get upload progress
    /// </summary>
    [HttpGet("progress/{uploadId}")]
    public IActionResult GetUploadProgress(string uploadId)
    {
        try
        {
            var uploadPath = Path.Combine(_environment.WebRootPath, "uploads", "temp", uploadId);
            
            if (!Directory.Exists(uploadPath))
            {
                return NotFound(new
                {
                    Success = false,
                    Message = "Upload session not found"
                });
            }

            var uploadedChunks = Directory.GetFiles(uploadPath, "chunk_*").Length;
            
            return Ok(new
            {
                Success = true,
                Data = new
                {
                    UploadId = uploadId,
                    UploadedChunks = uploadedChunks
                },
                Message = "Upload progress retrieved successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Success = false,
                Message = "An error occurred while retrieving upload progress",
                Error = ex.Message
            });
        }
    }
}