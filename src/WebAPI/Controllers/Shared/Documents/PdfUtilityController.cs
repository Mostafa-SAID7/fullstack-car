using Application.Features.Shared.Documents.Interfaces;
using Application.Features.Shared.Logging.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Shared.Documents
{
    [Authorize]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/pdf/utility")]
    public class PdfUtilityController : BaseController
    {
        private readonly IPdfGenerationService _pdfGenerationService;
        private readonly ILogger<PdfUtilityController> _logger;

        public PdfUtilityController(
            IPdfGenerationService pdfGenerationService,
            ILogger<PdfUtilityController> logger)
        {
            _pdfGenerationService = pdfGenerationService;
            _logger = logger;
        }

        [HttpPost("extract-pages-as-images")]
        public async Task<IActionResult> ExtractPagesAsImages(IFormFile pdfFile, [FromForm] int dpi = 150)
        {
            try
            {
                if (pdfFile == null || pdfFile.ContentType != "application/pdf")
                {
                    return BadRequest("A valid PDF file is required");
                }

                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "ExtractPdfPagesAsImages", new { FileName = pdfFile.FileName, Dpi = dpi });

                using var pdfStream = pdfFile.OpenReadStream();
                var images = await _pdfGenerationService.ExtractPdfPagesAsImagesAsync(pdfStream, dpi);

                _logger.LogBusinessEvent("PdfPagesExtracted", new
                {
                    OriginalFileName = pdfFile.FileName,
                    PageCount = images.Count,
                    Dpi = dpi
                }, userId);

                // Return as ZIP file containing all images
                using var zipStream = new MemoryStream();
                using (var archive = new System.IO.Compression.ZipArchive(zipStream, System.IO.Compression.ZipArchiveMode.Create, true))
                {
                    for (int i = 0; i < images.Count; i++)
                    {
                        var entry = archive.CreateEntry($"page-{i + 1}.png");
                        using var entryStream = entry.Open();
                        await entryStream.WriteAsync(images[i]);
                    }
                }

                zipStream.Position = 0;
                return File(zipStream.ToArray(), "application/zip", $"{Path.GetFileNameWithoutExtension(pdfFile.FileName)}-pages.zip");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting PDF pages as images");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("get-info")]
        public async Task<IActionResult> GetPdfInfo(IFormFile pdfFile)
        {
            try
            {
                if (pdfFile == null || pdfFile.ContentType != "application/pdf")
                {
                    return BadRequest("A valid PDF file is required");
                }

                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "GetPdfInfo", new { FileName = pdfFile.FileName });

                using var pdfStream = pdfFile.OpenReadStream();
                var pdfInfo = await _pdfGenerationService.GetPdfInfoAsync(pdfStream);

                return Ok(new
                {
                    success = true,
                    fileName = pdfFile.FileName,
                    pageCount = pdfInfo.PageCount,
                    fileSize = pdfInfo.FileSize,
                    title = pdfInfo.Title,
                    author = pdfInfo.Author,
                    subject = pdfInfo.Subject,
                    creationDate = pdfInfo.CreationDate,
                    modificationDate = pdfInfo.ModificationDate,
                    metadata = pdfInfo.Metadata
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PDF info");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Anonymous";
        }
    }
}


