using Application.Features.Marketplace.Products.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Marketplace.Products.Analytics;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/marketplace/products/analytics")]
public class ProductAnalyticsController : BaseController
{
    private readonly ILogger<ProductAnalyticsController> _logger;

    public ProductAnalyticsController(ILogger<ProductAnalyticsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("performance")]
    public async Task<IActionResult> GetProductPerformance(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] int topCount = 10)
    {
        try
        {
            var query = new GetProductPerformanceQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-1),
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
            _logger.LogError(ex, "Error getting product performance analytics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("sales-trends")]
    public async Task<IActionResult> GetSalesTrends(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? groupBy = "month")
    {
        try
        {
            var query = new GetProductSalesTrendsQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-6),
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
            _logger.LogError(ex, "Error getting product sales trends");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("category-performance")]
    public async Task<IActionResult> GetCategoryPerformance(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var query = new GetProductCategoryPerformanceQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-3),
                ToDate = toDate ?? DateTime.UtcNow
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting category performance analytics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("inventory-analysis")]
    public async Task<IActionResult> GetInventoryAnalysis()
    {
        try
        {
            var query = new GetProductInventoryAnalysisQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting inventory analysis");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}


