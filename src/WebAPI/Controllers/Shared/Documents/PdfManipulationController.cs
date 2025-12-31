using Application.Features.Shared.Documents.Interfaces;
using Application.Features.Shared.Documents.Models;
using Application.Features.Shared.Documents.DTOs.Requests;
using Application.Features.Shared.Logging.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Shared.Documents
{
    [Authorize]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/pdf/manipulate")]
    public class PdfManipulationController : BaseController
    {
        private readonly IPdfGenerationService _pdfGenerationService;
        private readonly IAdvancedLogger<PdfManipulationController> _logger;

        public PdfManipulationController(
            IPdfGenerationService pdfGenerationService,
            IAdvancedLogger<PdfManipulationController> logger)
        {
            _pdfGenerationService = pdfGenerationService;
            _logger = logger;
        }

        [HttpPost("merge")]
        public async Task<IActionResult> MergePdfs(IFormFileCollection pdfFiles)
        {
            try
            {
                if (pdfFiles == null || pdfFiles.Count < 2)
                {
                    return BadRequest("At least 2 PDF files are required for merging");
                }

                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "MergePdfs", new { FileCount = pdfFiles.Count });

                var pdfStreams = new List<Stream>();
                foreach (var file in pdfFiles)
                {
                    if (file.ContentType != "application/pdf")
                    {
                        return BadRequest($"File {file.FileName} is not a PDF");
                    }
                    pdfStreams.Add(file.OpenReadStream());
                }

                var result = await _pdfGenerationService.MergePdfsAsync(pdfStreams);

                if (result.Success && result.PdfData != null)
                {
                    _logger.LogBusinessEvent("PdfsMerged", new
                    {
                        InputFileCount = pdfFiles.Count,
                        OutputFileSize = result.FileSize,
                        OutputPageCount = result.PageCount
                    }, userId);

                    return File(result.PdfData, "application/pdf", "merged-document.pdf");
                }

                return BadRequest(new { success = false, errors = result.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error merging PDFs");
                return StatusCode(500, "Internal server error");
            }
            finally
            {
                // Clean up streams
                foreach (var file in pdfFiles)
                {
                    file.OpenReadStream().Dispose();
                }
            }
        }

        [HttpPost("add-watermark")]
        public async Task<IActionResult> AddWatermark(IFormFile pdfFile, [FromForm] string watermarkText, [FromForm] WatermarkOptionsRequest? options = null)
        {
            try
            {
                if (pdfFile == null || pdfFile.ContentType != "application/pdf")
                {
                    return BadRequest("A valid PDF file is required");
                }

                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "AddWatermarkToPdf", new { FileName = pdfFile.FileName, WatermarkText = watermarkText });

                var watermarkOptions = new WatermarkOptions
                {
                    Position = options?.Position ?? "Center",
                    Opacity = options?.Opacity ?? 0.3f,
                    FontSize = options?.FontSize ?? 48,
                    FontColor = options?.FontColor ?? "#cccccc",
                    Rotation = options?.Rotation ?? 45f
                };

                using var pdfStream = pdfFile.OpenReadStream();
                var result = await _pdfGenerationService.AddWatermarkToPdfAsync(pdfStream, watermarkText, watermarkOptions);

                if (result.Success && result.PdfData != null)
                {
                    _logger.LogBusinessEvent("WatermarkAdded", new
                    {
                        OriginalFileName = pdfFile.FileName,
                        WatermarkText = watermarkText,
                        FileSize = result.FileSize
                    }, userId);

                    return File(result.PdfData, "application/pdf", $"watermarked-{pdfFile.FileName}");
                }

                return BadRequest(new { success = false, errors = result.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding watermark to PDF");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Anonymous";
        }
    }
}