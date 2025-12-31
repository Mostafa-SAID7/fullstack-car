using Application.Features.Shared.Logging.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    public abstract class BaseAnalyticsController : BaseController
    {
        protected readonly IAdvancedLogger _logger;

        protected BaseAnalyticsController(IAdvancedLogger logger)
        {
            _logger = logger;
        }

        protected string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }

        protected IActionResult HandleResult<T>(Application.Common.Models.Result<T> result)
        {
            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        protected IActionResult HandleException(Exception ex, string operation)
        {
            _logger.LogError(ex, $"Error in {operation}");
            return StatusCode(500, "Internal server error");
        }
    }
}