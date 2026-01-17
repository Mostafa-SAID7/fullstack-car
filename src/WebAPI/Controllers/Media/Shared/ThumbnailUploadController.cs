using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Media.Shared;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/thumbnails")]
[Authorize]
public class ThumbnailUploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public ThumbnailUploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }
    [HttpPost("upload")]
    [RequestSizeLimit(10_000_000)] // 10MB limit
    public async Task<IActionResult> UploadThumbnail(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "No file uploaded"
            });
        }

        // Validate file type
        var allowedImageTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
        if (!allowedImageTypes.Contains(file.ContentType.ToLower()))
        {
            return BadRequest(new
            {
                Success = false,
                Message = "Invalid file type. Only image files are allowed."
            });
        }

        // Validate file size (10MB max)
        if (file.Length > 10_000_000)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "File size exceeds 10MB limit"
            });
        }

        try
        {
            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"thumb_{Guid.NewGuid()}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            
            // Create upload directory
            var uploadPath = Path.Combine(_environment.WebRootPath, "uploads", "thumbnails");
            Directory.CreateDirectory(uploadPath);
            
            var filePath = Path.Combine(uploadPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var thumbnailUrl = $"/uploads/thumbnails/{fileName}";

            return Ok(new
            {
                Success = true,
                Data = new
                {
                    ThumbnailUrl = thumbnailUrl,
                    FileName = fileName
                },
                Message = "Thumbnail uploaded successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Success = false,
                Message = "An error occurred while uploading the thumbnail",
                Error = ex.Message
            });
        }
    }
}