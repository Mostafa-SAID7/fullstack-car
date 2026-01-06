using Application.Features.Admin.Management.Products.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Products.Reports;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/admin/products/reports")]
public class ProductReportsController : BaseController
{
    private readonly ILogger<ProductReportsController> _logger;

    public ProductReportsController(ILogger<ProductReportsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("sales-report")]
    public async Task<IActionResult> GetSalesReport(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? format = "json")
    {
        try
        {
            var query = new GetProductSalesReportQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-1),
                ToDate = toDate ?? DateTime.UtcNow,
                Format = format
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"product-sales-report-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"product-sales-report-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating sales report");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("inventory-report")]
    public async Task<IActionResult> GetInventoryReport(
        [FromQuery] DateTime? asOfDate = null,
        [FromQuery] string? format = "json",
        [FromQuery] bool includeZeroStock = false)
    {
        try
        {
            var query = new GetProductInventoryReportQuery
            {
                AsOfDate = asOfDate ?? DateTime.UtcNow,
                Format = format,
                IncludeZeroStock = includeZeroStock
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"product-inventory-report-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"product-inventory-report-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating inventory report");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("performance-report")]
    public async Task<IActionResult> GetPerformanceReport(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? format = "json",
        [FromQuery] int topCount = 50)
    {
        try
        {
            var query = new GetProductPerformanceReportQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-3),
                ToDate = toDate ?? DateTime.UtcNow,
                Format = format,
                TopCount = topCount
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"product-performance-report-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"product-performance-report-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating performance report");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("category-analysis")]
    public async Task<IActionResult> GetCategoryAnalysisReport(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? format = "json")
    {
        try
        {
            var query = new GetCategoryAnalysisReportQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-6),
                ToDate = toDate ?? DateTime.UtcNow,
                Format = format
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"category-analysis-report-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"category-analysis-report-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating category analysis report");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}