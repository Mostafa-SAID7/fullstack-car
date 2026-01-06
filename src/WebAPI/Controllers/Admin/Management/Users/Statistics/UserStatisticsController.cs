using Application.Features.Admin.Management.Users.Statistics.Queries;
using Application.Features.Admin.Management.Users.Statistics.Models;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Users.Statistics
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/users/statistics")]
    public class UserStatisticsController : BaseController
    {
        private readonly ILogger<UserStatisticsController> _logger;

        public UserStatisticsController(ILogger<UserStatisticsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Admin requested user statistics");

                var query = new GetUserStatisticsQuery
                {
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetUserOverviewStatistics()
        {
            try
            {
                _logger.LogInformation("Admin requested user overview statistics");

                var query = new GetUserOverviewStatisticsQuery();
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user overview statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("growth")]
        public async Task<IActionResult> GetUserGrowthStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string period = "daily")
        {
            try
            {
                _logger.LogInformation("Admin requested user growth statistics");

                var query = new GetUserGrowthStatisticsQuery
                {
                    FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                    ToDate = toDate ?? DateTime.UtcNow,
                    Period = period
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user growth statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("engagement")]
        public async Task<IActionResult> GetUserEngagementStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Admin requested user engagement statistics");

                var query = new GetUserEngagementStatisticsQuery
                {
                    FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                    ToDate = toDate ?? DateTime.UtcNow
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user engagement statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("demographics")]
        public async Task<IActionResult> GetUserDemographics()
        {
            try
            {
                _logger.LogInformation("Admin requested user demographics");

                var query = new GetUserDemographicsQuery();
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user demographics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("retention")]
        public async Task<IActionResult> GetUserRetentionStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Admin requested user retention statistics");

                var query = new GetUserRetentionStatisticsQuery
                {
                    FromDate = fromDate ?? DateTime.UtcNow.AddDays(-90),
                    ToDate = toDate ?? DateTime.UtcNow
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user retention statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportUserStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string format = "csv")
        {
            try
            {
                _logger.LogInformation("Admin requested user statistics export");

                var query = new ExportUserStatisticsQuery
                {
                    FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                    ToDate = toDate ?? DateTime.UtcNow,
                    Format = format
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                {
                    var contentType = format.ToLower() switch
                    {
                        "csv" => "text/csv",
                        "excel" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "pdf" => "application/pdf",
                        _ => "application/octet-stream"
                    };

                    var fileName = $"user-statistics-{DateTime.UtcNow:yyyy-MM-dd}.{format}";
                    return File(result.Data.FileContent, contentType, fileName);
                }

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting user statistics");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}