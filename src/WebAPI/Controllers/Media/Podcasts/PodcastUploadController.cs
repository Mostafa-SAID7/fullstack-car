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

    public PodcastUploadController(IMediator mediator, IWebHostEnvironment environment, IConfiguration configuration)
    {
        _mediator = mediator;
        _environment = environment;
        _configuration = configuration;
    }

    /// <summary>
    /// Upload a podcast audio file
    /// </summary>
    [HttpPost]
    [RequestSizeLimit(200_000_000)] // 200MB limit
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

        // Validate file type
        var allowedAudioTypes = new[] { "audio/mp3", "audio/wav", "audio/aac", "audio/ogg", "audio/m4a", "audio/mpeg" };
        if (!allowedAudioTypes.Contains(file.ContentType.ToLower()))
        {
            return BadRequest(new
            {
                Success = false,
                Message = "Invalid file type. Only audio files are allowed."
            });
        }

        // Validate file size (200MB max)
        if (file.Length > 200_000_000)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "File size exceeds 200MB limit"
            });
        }

        try
        {
            // Create podcast record first
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
                return BadRequest(new
                {
                    Success = false,
                    Errors = createResult.Errors,
                    Message = "Failed to create podcast record"
                });
            }

            // Generate unique filename
            var podcastId = createResult.Data.Id;
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{podcastId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            
            // Create upload directory
            var uploadPath = Path.Combine(_environment.WebRootPath, "uploads", "podcasts");
            Directory.CreateDirectory(uploadPath);
            
            var filePath = Path.Combine(uploadPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Update podcast with file information
            var audioUrl = $"/uploads/podcasts/{fileName}";
            var updateCommand = new UpdatePodcastFileCommand
            {
                PodcastId = podcastId,
                AudioUrl = audioUrl,
                FileSize = file.Length,
                Duration = TimeSpan.Zero // TODO: Extract from audio metadata
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
                    Message = "Failed to update podcast file information"
                });
            }

            return Ok(new
            {
                Success = true,
                Data = new
                {
                    PodcastId = podcastId,
                    AudioUrl = audioUrl,
                    FileSize = file.Length,
                    FileName = fileName
                },
                Message = "Podcast uploaded successfully"
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