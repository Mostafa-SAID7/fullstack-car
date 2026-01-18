using Application.Features.Marketplace.Products.Commands;
using Application.Features.Marketplace.Products.DTOs.Requests;
using Application.Features.Marketplace.Products.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Marketplace.Products.Categories;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/marketplace/products/categories")]
public class ProductCategoriesController : BaseController
{
    private readonly ILogger<ProductCategoriesController> _logger;

    public ProductCategoriesController(ILogger<ProductCategoriesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        try
        {
            var query = new GetProductCategoriesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product categories");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{category}/products")]
    public async Task<IActionResult> GetProductsByCategory(
        Domain.Enums.Marketplace.ProductCategory category,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] Domain.Enums.Marketplace.ProductStatus? status = null)
    {
        try
        {
            var query = new GetProductsByCategoryQuery
            {
                Category = category,
                Page = page,
                PageSize = pageSize,
                Search = search,
                Status = status
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products by category");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{category}/statistics")]
    public async Task<IActionResult> GetCategoryStatistics(
        Domain.Enums.Marketplace.ProductCategory category,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var query = new GetCategoryStatisticsQuery
            {
                Category = category,
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-1),
                ToDate = toDate ?? DateTime.UtcNow
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting category statistics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{category}/bulk-update")]
    public async Task<IActionResult> BulkUpdateCategoryProducts(
        Domain.Enums.Marketplace.ProductCategory category,
        [FromBody] BulkUpdateCategoryProductsRequest request)
    {
        try
        {
            var command = new BulkUpdateCategoryProductsCommand
            {
                Category = category,
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
            _logger.LogError(ex, "Error bulk updating category products");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}


