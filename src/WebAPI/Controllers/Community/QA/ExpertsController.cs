using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.QA
{
    /// <summary>
    /// QA Experts API controller serving both Angular and React frontends
    /// Provides expert management and assignment functionality
    /// </summary>
    [Authorize]
    [ApiVersion("7.0")]
    [Route("api/v{version:apiVersion}/qa/experts")]
    public class ExpertsController : BaseController
    {
        private readonly ILogger<ExpertsController> _logger;

        public ExpertsController(ILogger<ExpertsController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get paginated list of QA experts
        /// Used by React Dashboard for expert management
        /// </summary>
        /// <param name="pageSize">Number of experts per page</param>
        /// <returns>Paginated list of experts</returns>
        [HttpGet]
        public async Task<IActionResult> GetExperts([FromQuery] int pageSize = 15)
        {
            try
            {
                // Return mock experts data for now
                var experts = new
                {
                    Experts = new object[0],
                    TotalCount = 0,
                    PageSize = pageSize,
                    CurrentPage = 1
                };

                return Ok(experts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving experts");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}