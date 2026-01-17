using Application.Common.Interfaces;
using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.DTOs.Requests;
using Application.Features.Media.Shared.DTOs.Requests;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media.Podcasts;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/podcasts/upload")]
[Authorize]
public class PodcastUploadController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;
    private readonly IFileValidationService _fileValidationService;
    private readonly IMediaFileStorageService _fileStorageService;

    public PodcastUploadController(
        IMediator mediator, 
        IWebHostEnvironment environment, 
        IConfiguration configuration,
        IFileValidationService fileValidationService,
        IMediaFileStorageService fileStorageService)
    {
        _mediator = mediator;
        _environment = environment;
        _configuration = configuration;
        _fileValidationService = fileValidationService;
        _fileStorageService = fileStorageService;
    }
    [HttpPost]
    [RequestSizeLimit(500_000_000)] // 500MB limit as per requirements
    public async Task<IActionResult> UploadPodcast(IFormFile file, [FromForm] UploadPodcastRequest request)
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

        try
        {
            // Validate the uploaded file using the comprehensive validation service
            using var fileStream = file.OpenReadStream();
            var validationResult = await _fileValidationService.ValidateAudioFileAsync(
                fileStream, 
                file.FileName, 
                file.ContentType, 
                file.Length);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = "File validation failed",
                    Errors = validationResult.Errors
                });
            }

            // Upload file using the file storage service
            fileStream.Position = 0; // Reset stream position after validation
            var uploadResult = await _fileStorageService.UploadAudioAsync(
                fileStream, 
                file.FileName, 
                file.ContentType);

            if (!uploadResult.IsSuccess)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = "File upload failed",
                    Error = uploadResult.ErrorMessage
                });
            }

            // Extract metadata from the audio file
            fileStream.Position = 0; // Reset stream position for metadata extraction
            var metadata = await _fileValidationService.ExtractAudioMetadataAsync(fileStream, file.FileName);

            // Create podcast record
            var createCommand = new CreatePodcastCommand
            {
                CreatorId = userGuid,
                Request = new CreatePodcastRequest
                {
                    Title = request.Title,
                    Description = request.Description,
                    Tags = request.Tags,
                    IsPublic = request.IsPublic,
                    AllowComments = request.AllowComments,
                    AllowDownload = request.AllowDownload,
                    EpisodeNumber = request.EpisodeNumber,
                    SeasonNumber = request.SeasonNumber,
                    SeriesId = request.SeriesId,
                    Transcript = request.Transcript
                }
            };

            var createResult = await _mediator.Send(createCommand);
            if (!createResult.IsSuccess)
            {
                // Clean up uploaded file if database creation fails
                await _fileStorageService.DeleteFileAsync(uploadResult.FileUrl!);
                
                return BadRequest(new
                {
                    Success = false,
                    Errors = createResult.Errors,
                    Message = "Failed to create podcast record"
                });
            }

            // Update podcast with file information and metadata
            var updateCommand = new UpdatePodcastFileCommand
            {
                PodcastId = createResult.Data.Id,
                AudioUrl = uploadResult.FileUrl!,
                FileSize = uploadResult.FileSize,
                Duration = metadata.Duration
            };

            var updateResult = await _mediator.Send(updateCommand);
            if (!updateResult.IsSuccess)
            {
                // Clean up uploaded file if database update fails
                await _fileStorageService.DeleteFileAsync(uploadResult.FileUrl!);

                return BadRequest(new
                {
                    Success = false,
                    Errors = updateResult.Errors,
                    Message = "Failed to update podcast file information"
                });
            }

            return Ok(new
            {
                Success = true,
                Data = new
                {
                    PodcastId = createResult.Data.Id,
                    AudioUrl = uploadResult.FileUrl,
                    FileSize = uploadResult.FileSize,
                    FileName = uploadResult.FileName,
                    Duration = metadata.Duration,
                    Format = metadata.Format,
                    Bitrate = metadata.Bitrate,
                    SampleRate = metadata.SampleRate,
                    Channels = metadata.Channels,
                    Title = metadata.Title,
                    Artist = metadata.Artist,
                    Album = metadata.Album,
                    Year = metadata.Year,
                    UploadedAt = uploadResult.UploadedAt,
                    ValidationPassed = true
                },
                Message = "Podcast uploaded and validated successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Success = false,
                Message = "An error occurred while uploading the podcast",
                Error = ex.Message
            });
        }
    }
}