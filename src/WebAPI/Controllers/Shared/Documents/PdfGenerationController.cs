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

    [Route("api/v{version:apiVersion}/pdf/generate")]
    public class PdfGenerationController : BaseController
    {
        private readonly IPdfGenerationService _pdfGenerationService;
        private readonly ILogger<PdfGenerationController> _logger;

        public PdfGenerationController(
            IPdfGenerationService pdfGenerationService,
            ILogger<PdfGenerationController> logger)
        {
            _pdfGenerationService = pdfGenerationService;
            _logger = logger;
        }

        [HttpPost("from-html")]
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

        [HttpPost("from-template")]
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

        [HttpPost("report")]
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

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Anonymous";
        }
    }
}
