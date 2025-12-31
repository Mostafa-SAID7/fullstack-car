using Application.Common.Interfaces.Documents;
using Application.Common.Interfaces.Logging;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Shared.Documents
{
    [Authorize]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/pdf")]
    public class PdfController : BaseController
    {
        private readonly IPdfGenerationService _pdfGenerationService;
        private readonly IAdvancedLogger<PdfController> _logger;

        public PdfController(
            IPdfGenerationService pdfGenerationService,
            IAdvancedLogger<PdfController> logger)
        {
            _pdfGenerationService = pdfGenerationService;
            _logger = logger;
        }

        [HttpPost("generate-from-html")]
        public async Task<IActionResult> GenerateFromHtml([FromBody] PdfFromHtmlRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "GeneratePdfFromHtml", new { HtmlLength = request.Html?.Length });

                var options = new PdfOptions
                {
                    PageSize = request.PageSize ?? "A4",
                    Orientation = request.Orientation ?? "Portrait",
                    Margins = new MarginOptions
                    {
                        Top = request.MarginTop ?? "1cm",
                        Right = request.MarginRight ?? "1cm",
                        Bottom = request.MarginBottom ?? "1cm",
                        Left = request.MarginLeft ?? "1cm"
                    },
                    EnableJavaScript = request.EnableJavaScript ?? false,
                    EnableImages = request.EnableImages ?? true,
                    Quality = request.Quality ?? 100
                };

                if (!string.IsNullOrEmpty(request.HeaderHtml))
                {
                    options.Header = new HeaderFooterOptions
                    {
                        Html = request.HeaderHtml,
                        Height = request.HeaderHeight ?? "1cm"
                    };
                }

                if (!string.IsNullOrEmpty(request.FooterHtml))
                {
                    options.Footer = new HeaderFooterOptions
                    {
                        Html = request.FooterHtml,
                        Height = request.FooterHeight ?? "1cm",
                        ShowPageNumbers = request.ShowPageNumbers ?? false
                    };
                }

                var result = await _pdfGenerationService.GeneratePdfFromHtmlAsync(request.Html!, options);

                if (result.Success && result.PdfData != null)
                {
                    _logger.LogBusinessEvent("PdfGenerated", new
                    {
                        Method = "FromHtml",
                        FileSize = result.FileSize,
                        PageCount = result.PageCount
                    }, userId);

                    return File(result.PdfData, "application/pdf", request.FileName ?? "document.pdf");
                }

                return BadRequest(new { success = false, errors = result.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF from HTML");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("generate-from-template")]
        public async Task<IActionResult> GenerateFromTemplate([FromBody] PdfFromTemplateRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "GeneratePdfFromTemplate", new { TemplateName = request.TemplateName });

                var options = new PdfOptions
                {
                    PageSize = request.PageSize ?? "A4",
                    Orientation = request.Orientation ?? "Portrait"
                };

                var result = await _pdfGenerationService.GeneratePdfFromTemplateAsync(
                    request.TemplateName!, 
                    request.Model!, 
                    options);

                if (result.Success && result.PdfData != null)
                {
                    _logger.LogBusinessEvent("PdfGenerated", new
                    {
                        Method = "FromTemplate",
                        TemplateName = request.TemplateName,
                        FileSize = result.FileSize,
                        PageCount = result.PageCount
                    }, userId);

                    return File(result.PdfData, "application/pdf", request.FileName ?? "document.pdf");
                }

                return BadRequest(new { success = false, errors = result.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF from template");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("generate-report")]
        public async Task<IActionResult> GenerateReport([FromBody] PdfReportRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogUserAction(userId, "GeneratePdfReport", new { Title = request.Options?.Title });

                var options = new ReportOptions
                {
                    Title = request.Options?.Title ?? "Report",
                    Subtitle = request.Options?.Subtitle,
                    Author = request.Options?.Author ?? "Community Car System",
                    Columns = request.Options?.Columns ?? new List<ReportColumn>(),
                    IncludeHeader = request.Options?.IncludeHeader ?? true,
                    IncludeFooter = request.Options?.IncludeFooter ?? true,
                    AlternateRowColors = request.Options?.AlternateRowColors ?? true
                };

                var result = await _pdfGenerationService.GenerateReportPdfAsync(request.Data!, options);

                if (result.Success && result.PdfData != null)
                {
                    _logger.LogBusinessEvent("PdfReportGenerated", new
                    {
                        Title = options.Title,
                        DataCount = request.Data?.Count(),
                        FileSize = result.FileSize,
                        PageCount = result.PageCount
                    }, userId);

                    return File(result.PdfData, "application/pdf", request.FileName ?? "report.pdf");
                }

                return BadRequest(new { success = false, errors = result.Errors });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF report");
                return StatusCode(500, "Internal server error");
            }
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

    public class PdfFromHtmlRequest
    {
        public string? Html { get; set; }
        public string? FileName { get; set; }
        public string? PageSize { get; set; }
        public string? Orientation { get; set; }
        public string? MarginTop { get; set; }
        public string? MarginRight { get; set; }
        public string? MarginBottom { get; set; }
        public string? MarginLeft { get; set; }
        public string? HeaderHtml { get; set; }
        public string? HeaderHeight { get; set; }
        public string? FooterHtml { get; set; }
        public string? FooterHeight { get; set; }
        public bool? ShowPageNumbers { get; set; }
        public bool? EnableJavaScript { get; set; }
        public bool? EnableImages { get; set; }
        public int? Quality { get; set; }
    }

    public class PdfFromTemplateRequest
    {
        public string? TemplateName { get; set; }
        public object? Model { get; set; }
        public string? FileName { get; set; }
        public string? PageSize { get; set; }
        public string? Orientation { get; set; }
    }

    public class PdfReportRequest
    {
        public IEnumerable<object>? Data { get; set; }
        public ReportOptions? Options { get; set; }
        public string? FileName { get; set; }
    }

    public class WatermarkOptionsRequest
    {
        public string? Position { get; set; }
        public float? Opacity { get; set; }
        public int? FontSize { get; set; }
        public string? FontColor { get; set; }
        public float? Rotation { get; set; }
    }
}