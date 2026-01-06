using Application.Features.Admin.Management.Customers.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Customers.Analytics;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/admin/customers/analytics")]
public class CustomerAnalyticsController : BaseController
{
    private readonly ILogger<CustomerAnalyticsController> _logger;

    public CustomerAnalyticsController(ILogger<CustomerAnalyticsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("behavior")]
    public async Task<IActionResult> GetCustomerBehavior(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] Domain.Enums.Admin.Management.CustomerType? type = null)
    {
        try
        {
            var query = new GetCustomerBehaviorAnalyticsQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-3),
                ToDate = toDate ?? DateTime.UtcNow,
                CustomerType = type
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer behavior analytics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("lifetime-value")]
    public async Task<IActionResult> GetLifetimeValueAnalysis(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] int topCount = 100)
    {
        try
        {
            var query = new GetCustomerLifetimeValueQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddYears(-1),
                ToDate = toDate ?? DateTime.UtcNow,
                TopCount = topCount
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer lifetime value analysis");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("churn-analysis")]
    public async Task<IActionResult> GetChurnAnalysis(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] int inactiveDays = 90)
    {
        try
        {
            var query = new GetCustomerChurnAnalysisQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-6),
                ToDate = toDate ?? DateTime.UtcNow,
                InactiveDays = inactiveDays
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer churn analysis");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("acquisition-trends")]
    public async Task<IActionResult> GetAcquisitionTrends(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? groupBy = "month")
    {
        try
        {
            var query = new GetCustomerAcquisitionTrendsQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddYears(-1),
                ToDate = toDate ?? DateTime.UtcNow,
                GroupBy = groupBy
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer acquisition trends");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("geographic-distribution")]
    public async Task<IActionResult> GetGeographicDistribution(
        [FromQuery] string? country = null,
        [FromQuery] bool includeInactive = false)
    {
        try
        {
            var query = new GetCustomerGeographicDistributionQuery
            {
                Country = country,
                IncludeInactive = includeInactive
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer geographic distribution");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}