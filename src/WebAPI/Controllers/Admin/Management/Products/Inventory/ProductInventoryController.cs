using Application.Features.Admin.Management.Products.Commands;
using Application.Features.Admin.Management.Products.DTOs.Requests;
using Application.Features.Admin.Management.Products.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Products.Inventory;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/admin/products/inventory")]
public class ProductInventoryController : BaseController
{
    private readonly ILogger<ProductInventoryController> _logger;

    public ProductInventoryController(ILogger<ProductInventoryController> logger)
    {
        _logger = logger;
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStockProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? threshold = null)
    {
        try
        {
            var query = new GetLowStockProductsQuery
            {
                Page = page,
                PageSize = pageSize,
                Threshold = threshold
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting low stock products");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("out-of-stock")]
    public async Task<IActionResult> GetOutOfStockProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetOutOfStockProductsQuery
            {
                Page = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting out of stock products");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/stock")]
    public async Task<IActionResult> UpdateProductStock(Guid id, [FromBody] UpdateProductStockRequest request)
    {
        try
        {
            var command = new UpdateProductStockCommand
            {
                ProductId = id,
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
            _logger.LogError(ex, "Error updating product stock");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("bulk-stock-update")]
    public async Task<IActionResult> BulkUpdateStock([FromBody] BulkUpdateStockRequest request)
    {
        try
        {
            var command = new BulkUpdateProductStockCommand
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
            _logger.LogError(ex, "Error bulk updating product stock");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("inventory-report")]
    public async Task<IActionResult> GetInventoryReport(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] bool includeMovements = false)
    {
        try
        {
            var query = new GetInventoryReportQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-1),
                ToDate = toDate ?? DateTime.UtcNow,
                IncludeMovements = includeMovements
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting inventory report");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}