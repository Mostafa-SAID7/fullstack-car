using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.QA
{
    /// <summary>
    /// QA Export API controller serving both Angular and React frontends
    /// Provides data export functionality for reporting and analytics
    /// </summary>
    [Authorize]
    [ApiVersion("7.0")]
    [Route("api/v{version:apiVersion}/qa/export")]
    public class ExportController : BaseController
    {
        private readonly ILogger<ExportController> _logger;

        public ExportController(ILogger<ExportController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Export questions data for reporting
        /// Used by React Dashboard for data export functionality
        /// </summary>
        /// <param name="format">Export format (json, csv, excel)</param>
        /// <param name="dateFrom">Start date for export</param>
        /// <param name="dateTo">End date for export</param>
        /// <returns>Exported data</returns>
        [HttpGet("questions")]
        public async Task<IActionResult> ExportQuestions(
            [FromQuery] string format = "json",
            [FromQuery] string? dateFrom = null,
            [FromQuery] string? dateTo = null)
        {
            try
            {
                // Return mock export data for now
                var exportData = new
                {
                    Format = format,
                    DateFrom = dateFrom,
                    DateTo = dateTo,
                    Questions = new object[0],
                    ExportedAt = DateTime.UtcNow,
                    TotalRecords = 0
                };

                return Ok(exportData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting questions");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}