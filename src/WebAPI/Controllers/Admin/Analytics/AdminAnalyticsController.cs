using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Analytics.Queries;
using Application.Features.Admin.Analytics.DTOs.Requests;
using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Commands;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/analytics")]
    public class AdminAnalyticsController : BaseController
    {
        private readonly ILogger<AdminAnalyticsController> _logger;

        public AdminAnalyticsController(ILogger<AdminAnalyticsController> logger)
        {
            _logger = logger;
        }
        [HttpGet]
        public async Task<IActionResult> GetAnalytics([FromQuery] GetAdvancedAnalyticsQuery query)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewAdvancedAnalytics", query);
                
                var analytics = await Mediator.Send(query);
                
                if (analytics.Succeeded)
                    return Ok(analytics.Data);

                return BadRequest(analytics.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting advanced analytics");
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPost("export")]
        public async Task<IActionResult> ExportAnalytics([FromBody] ExportAnalyticsRequest request)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ExportAnalytics", request);

                var command = new ExportAnalyticsCommand
                {
                    Request = request,
                    AdminId = Guid.Parse(GetCurrentUserId())
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(new { Message = "Export request processed", Export = result.Data });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }
    }
}


