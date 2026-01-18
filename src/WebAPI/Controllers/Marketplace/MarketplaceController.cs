using Application.Features.Marketplace.Integration.Commands;
using Application.Features.Marketplace.Integration.DTOs.Requests;
using Application.Features.Marketplace.Integration.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Marketplace;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/marketplace")]
public class MarketplaceController : BaseController
{
    private readonly ILogger<MarketplaceController> _logger;

    public MarketplaceController(ILogger<MarketplaceController> logger)
    {
        _logger = logger;
    }
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetMarketplaceDashboard(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var query = new GetMarketplaceDashboardQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                ToDate = toDate ?? DateTime.UtcNow,
                AdminId = GetCurrentUserId()
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting marketplace dashboard");
            return StatusCode(500, "Internal server error");
        }
    }
    [HttpGet("analytics")]
    public async Task<IActionResult> GetMarketplaceAnalytics(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? segment = null)
    {
        try
        {
            var query = new GetMarketplaceAnalyticsQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                ToDate = toDate ?? DateTime.UtcNow,
                Segment = segment,
                AdminId = GetCurrentUserId()
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting marketplace analytics");
            return StatusCode(500, "Internal server error");
        }
    }
    [HttpGet("orders")]
    public async Task<IActionResult> GetMarketplaceOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] Domain.Enums.Marketplace.OrderStatus? status = null,
        [FromQuery] Domain.Enums.Marketplace.OrderType? type = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? sortBy = "CreatedAt",
        [FromQuery] string? sortDirection = "desc")
    {
        try
        {
            var query = new GetMarketplaceOrdersQuery
            {
                Page = page,
                PageSize = pageSize,
                Search = search,
                Status = status,
                Type = type,
                FromDate = fromDate,
                ToDate = toDate,
                SortBy = sortBy,
                SortDirection = sortDirection,
                AdminId = GetCurrentUserId()
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting marketplace orders");
            return StatusCode(500, "Internal server error");
        }
    }
    [HttpGet("transactions")]
    public async Task<IActionResult> GetMarketplaceTransactions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] Domain.Enums.Marketplace.TransactionStatus? status = null,
        [FromQuery] Domain.Enums.Marketplace.PaymentMethod? paymentMethod = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var query = new GetMarketplaceTransactionsQuery
            {
                Page = page,
                PageSize = pageSize,
                Search = search,
                Status = status,
                PaymentMethod = paymentMethod,
                FromDate = fromDate,
                ToDate = toDate,
                AdminId = GetCurrentUserId()
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting marketplace transactions");
            return StatusCode(500, "Internal server error");
        }
    }
    [HttpGet("reports")]
    public async Task<IActionResult> GetMarketplaceReports(
        [FromQuery] string reportType,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? format = "json")
    {
        try
        {
            var query = new GetMarketplaceReportsQuery
            {
                ReportType = reportType,
                FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                ToDate = toDate ?? DateTime.UtcNow,
                Format = format,
                AdminId = GetCurrentUserId()
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    dynamic data = result.Data;
                    return File(data.FileContent, "text/csv", data.FileName);
                }
                return Ok(result.Data);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating marketplace reports");
            return StatusCode(500, "Internal server error");
        }
    }
    [HttpPost("promotions")]
    public async Task<IActionResult> CreateMarketplacePromotion([FromBody] CreateMarketplacePromotionRequest request)
    {
        try
        {
            var command = new CreateMarketplacePromotionCommand
            {
                AdminId = GetCurrentUserId(),
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                dynamic data = result.Data;
                return CreatedAtAction(nameof(GetMarketplacePromotion), new { id = data.id }, result.Data);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating marketplace promotion");
            return StatusCode(500, "Internal server error");
        }
    }
    [HttpGet("promotions/{id}")]
    public async Task<IActionResult> GetMarketplacePromotion(Guid id)
    {
        try
        {
            var query = new GetMarketplacePromotionQuery { PromotionId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return NotFound(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting marketplace promotion");
            return StatusCode(500, "Internal server error");
        }
    }
    [HttpPost("integration/sync-customers")]
    public async Task<IActionResult> SyncCustomerData([FromBody] SyncCustomerDataRequest request)
    {
        try
        {
            var command = new SyncCustomerDataCommand
            {
                AdminId = GetCurrentUserId(),
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error syncing customer data");
            return StatusCode(500, "Internal server error");
        }
    }
    [HttpGet("recommendations/cross-sell/{customerId}")]
    public async Task<IActionResult> GetCrossSellRecommendations(
        Guid customerId,
        [FromQuery] int limit = 10)
    {
        try
        {
            var query = new GetCrossSellRecommendationsQuery
            {
                CustomerId = customerId,
                Limit = limit,
                AdminId = GetCurrentUserId()
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cross-sell recommendations");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}


