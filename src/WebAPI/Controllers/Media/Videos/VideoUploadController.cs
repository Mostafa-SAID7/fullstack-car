using Application.Common.Interfaces;
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
public class VideoUploadController : BaseController
{
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly IFileValidationService _fileValidationService;
    private readonly IMediaFileStorageService _fileStorageService;
    private readonly ILogger<VideoUploadController> _logger;

    public VideoUploadController(
        IWebHostEnvironment environment, 
        IConfiguration configuration,
        IFileValidationService fileValidationService,
        IMediaFileStorageService fileStorageService,
        ILogger<VideoUploadController> logger)
    {
        _environment = environment;
        _configuration = configuration;
        _fileValidationService = fileValidationService;
        _fileStorageService = fileStorageService;
        _logger = logger;
    }

    /// <summary>
    /// Upload a video file
    /// </summary>
    [HttpPost]
    [RequestSizeLimit(2_000_000_000)] // 2GB limit as per requirements
    public async Task<IActionResult> UploadVideo(IFormFile file, [FromForm] Application.Features.Media.Shared.DTOs.Requests.UploadVideoRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            // Validate the uploaded file using the comprehensive validation service
            using var fileStream = file.OpenReadStream();
            var validationResult = await _fileValidationService.ValidateVideoFileAsync(
                fileStream, 
                file.FileName, 
                file.ContentType, 
                file.Length);

            if (!validationResult.IsValid)
            {
                return BadRequest("File validation failed", validationResult.Errors);
            }

            // Upload file using the file storage service
            fileStream.Position = 0; // Reset stream position after validation
            var uploadResult = await _fileStorageService.UploadVideoAsync(
                fileStream, 
                file.FileName, 
                file.ContentType);

            if (!uploadResult.IsSuccess)
            {
                return BadRequest("File upload failed", new[] { uploadResult.ErrorMessage ?? "Unknown error" });
            }

            // Extract metadata from the video file
            fileStream.Position = 0; // Reset stream position for metadata extraction
            var metadata = await _fileValidationService.ExtractVideoMetadataAsync(fileStream, file.FileName);

            // Create video record
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

            var createResult = await Mediator.Send(createCommand);
            if (!createResult.IsSuccess)
            {
                // Clean up uploaded file if database creation fails
                await _fileStorageService.DeleteFileAsync(uploadResult.FileUrl!);
                
                return BadRequest("Failed to create video record", createResult.Errors);
            }

            // Update video with file information and metadata
            var updateCommand = new UpdateVideoFileCommand
            {
                VideoId = createResult.Data.Id,
                VideoUrl = uploadResult.FileUrl!,
                FileSize = uploadResult.FileSize,
                Duration = metadata.Duration
            };

            var updateResult = await Mediator.Send(updateCommand);
            if (!updateResult.IsSuccess)
            {
                // Clean up uploaded file if database update fails
                await _fileStorageService.DeleteFileAsync(uploadResult.FileUrl!);

                return BadRequest("Failed to update video file information", updateResult.Errors);
            }

            var responseData = new
            {
                VideoId = createResult.Data.Id,
                VideoUrl = uploadResult.FileUrl,
                FileSize = uploadResult.FileSize,
                FileName = uploadResult.FileName,
                Duration = metadata.Duration,
                Format = metadata.Format,
                Resolution = metadata.Width.HasValue && metadata.Height.HasValue 
                    ? $"{metadata.Width}x{metadata.Height}" 
                    : null,
                UploadedAt = uploadResult.UploadedAt,
                ValidationPassed = true
            };

            return Success(responseData, "Video uploaded and validated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading video");
            return InternalServerError("An error occurred while uploading the video", ex.Message);
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
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("User not authenticated");
            }

            if (chunk == null || chunk.Length == 0)
            {
                return BadRequest("No chunk uploaded");
            }

            if (string.IsNullOrWhiteSpace(uploadId))
            {
                return BadRequest("Upload ID is required");
            }

            if (chunkNumber < 1 || chunkNumber > totalChunks)
            {
                return BadRequest("Invalid chunk number");
            }

            if (totalChunks < 1)
            {
                return BadRequest("Total chunks must be greater than 0");
            }

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
                var tempFilePath = Path.Combine(uploadPath, "combined_temp");
                
                using (var finalStream = new FileStream(tempFilePath, FileMode.Create))
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

                // Validate the combined file
                using var validationStream = new FileStream(tempFilePath, FileMode.Open, FileAccess.Read);
                var fileInfo = new FileInfo(tempFilePath);
                var contentType = GetContentTypeFromFileName(fileName);
                
                var validationResult = await _fileValidationService.ValidateVideoFileAsync(
                    validationStream, 
                    fileName, 
                    contentType, 
                    fileInfo.Length);

                if (!validationResult.IsValid)
                {
                    // Clean up temp files
                    Directory.Delete(uploadPath, true);
                    
                    return BadRequest("File validation failed", validationResult.Errors);
                }

                // Upload validated file using storage service
                validationStream.Position = 0;
                var uploadResult = await _fileStorageService.UploadVideoAsync(
                    validationStream, 
                    fileName, 
                    contentType);

                if (!uploadResult.IsSuccess)
                {
                    // Clean up temp files
                    Directory.Delete(uploadPath, true);
                    
                    return BadRequest("File upload failed", new[] { uploadResult.ErrorMessage ?? "Unknown error" });
                }

                // Extract metadata
                validationStream.Position = 0;
                var extractedMetadata = await _fileValidationService.ExtractVideoMetadataAsync(validationStream, fileName);

                // Clean up temp files
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

                    var createResult = await Mediator.Send(createCommand);
                    if (createResult.IsSuccess)
                    {
                        var updateCommand = new UpdateVideoFileCommand
                        {
                            VideoId = createResult.Data.Id,
                            VideoUrl = uploadResult.FileUrl!,
                            FileSize = uploadResult.FileSize,
                            Duration = extractedMetadata.Duration
                        };

                        var updateResult = await Mediator.Send(updateCommand);
                        if (updateResult.IsSuccess)
                        {
                            var completeResponseData = new
                            {
                                VideoId = createResult.Data.Id,
                                VideoUrl = uploadResult.FileUrl,
                                FileSize = uploadResult.FileSize,
                                FileName = uploadResult.FileName,
                                Duration = extractedMetadata.Duration,
                                Format = extractedMetadata.Format,
                                Resolution = extractedMetadata.Width.HasValue && extractedMetadata.Height.HasValue 
                                    ? $"{extractedMetadata.Width}x{extractedMetadata.Height}" 
                                    : null,
                                UploadedAt = uploadResult.UploadedAt,
                                IsComplete = true,
                                ValidationPassed = true
                            };

                            return Success(completeResponseData, "Video upload completed and validated successfully");
                        }
                        else
                        {
                            // Clean up uploaded file if database update fails
                            await _fileStorageService.DeleteFileAsync(uploadResult.FileUrl!);
                            
                            return BadRequest("Failed to update video file information", updateResult.Errors);
                        }
                    }
                    else
                    {
                        // Clean up uploaded file if database creation fails
                        await _fileStorageService.DeleteFileAsync(uploadResult.FileUrl!);
                        
                        return BadRequest("Failed to create video record", createResult.Errors);
                    }
                }

                var fileCompleteResponseData = new
                {
                    FileName = uploadResult.FileName,
                    FileSize = uploadResult.FileSize,
                    Duration = extractedMetadata.Duration,
                    Format = extractedMetadata.Format,
                    IsComplete = true,
                    ValidationPassed = true
                };

                return Success(fileCompleteResponseData, "File upload completed and validated successfully");
            }

            var progressResponseData = new
            {
                ChunkNumber = chunkNumber,
                TotalChunks = totalChunks,
                UploadedChunks = uploadedChunks,
                Progress = (double)uploadedChunks / totalChunks * 100,
                IsComplete = false
            };

            return Success(progressResponseData, $"Chunk {chunkNumber} of {totalChunks} uploaded successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading chunk {ChunkNumber} for upload {UploadId}", chunkNumber, uploadId);
            return InternalServerError("An error occurred while uploading the chunk", ex.Message);
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
            if (string.IsNullOrWhiteSpace(uploadId))
            {
                return BadRequest("Upload ID is required");
            }

            var uploadPath = Path.Combine(_environment.WebRootPath, "uploads", "temp", uploadId);
            
            if (!Directory.Exists(uploadPath))
            {
                return NotFound("Upload session not found");
            }

            var uploadedChunks = Directory.GetFiles(uploadPath, "chunk_*").Length;
            
            var progressData = new
            {
                UploadId = uploadId,
                UploadedChunks = uploadedChunks
            };

            return Success(progressData, "Upload progress retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving upload progress for upload {UploadId}", uploadId);
            return InternalServerError("An error occurred while retrieving upload progress", ex.Message);
        }
    }

    private string GetContentTypeFromFileName(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".mp4" => "video/mp4",
            ".avi" => "video/avi",
            ".mov" => "video/mov",
            ".webm" => "video/webm",
            ".wmv" => "video/x-ms-wmv",
            ".3gp" => "video/3gpp",
            _ => "video/mp4" // Default fallback
        };
    }
}