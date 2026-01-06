using Application.Features.Marketplace.Customers.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Marketplace.Customers.Reports;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/marketplace/customers/reports")]
public class CustomerReportsController : BaseController
{
    private readonly ILogger<CustomerReportsController> _logger;

    public CustomerReportsController(ILogger<CustomerReportsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("customer-list")]
    public async Task<IActionResult> GetCustomerListReport(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? format = "json",
        [FromQuery] Domain.Enums.Marketplace.CustomerStatus? status = null,
        [FromQuery] Domain.Enums.Marketplace.CustomerType? type = null)
    {
        try
        {
            var query = new GetCustomerListReportQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-1),
                ToDate = toDate ?? DateTime.UtcNow,
                Format = format,
                Status = status?.ToString() ?? string.Empty,
                Type = type
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"customer-list-report-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"customer-list-report-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating customer list report");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("revenue-analysis")]
    public async Task<IActionResult> GetRevenueAnalysisReport(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? format = "json",
        [FromQuery] string? groupBy = "month")
    {
        try
        {
            var query = new GetCustomerRevenueAnalysisReportQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-12),
                ToDate = toDate ?? DateTime.UtcNow,
                Format = format,
                GroupBy = groupBy
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"customer-revenue-analysis-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"customer-revenue-analysis-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating revenue analysis report");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("loyalty-report")]
    public async Task<IActionResult> GetLoyaltyReport(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? format = "json",
        [FromQuery] int minPoints = 0)
    {
        try
        {
            var query = new GetCustomerLoyaltyReportQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-6),
                ToDate = toDate ?? DateTime.UtcNow,
                Format = format,
                MinPoints = minPoints
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"customer-loyalty-report-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"customer-loyalty-report-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating loyalty report");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("geographic-report")]
    public async Task<IActionResult> GetGeographicReport(
        [FromQuery] string? format = "json",
        [FromQuery] bool includeInactive = false)
    {
        try
        {
            var query = new GetCustomerGeographicReportQuery
            {
                Format = format,
                IncludeInactive = includeInactive
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"customer-geographic-report-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"customer-geographic-report-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating geographic report");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("churn-report")]
    public async Task<IActionResult> GetChurnReport(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? format = "json",
        [FromQuery] int inactiveDays = 90)
    {
        try
        {
            var query = new GetCustomerChurnReportQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-6),
                ToDate = toDate ?? DateTime.UtcNow,
                Format = format,
                InactiveDays = inactiveDays
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
            {
                if (format?.ToLower() == "csv")
                {
                    return File(result.Data.CsvData, "text/csv", $"customer-churn-report-{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else if (format?.ToLower() == "excel")
                {
                    return File(result.Data.ExcelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        $"customer-churn-report-{DateTime.UtcNow:yyyyMMdd}.xlsx");
                }
                
                return Ok(result.Data.JsonData);
            }

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating churn report");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}
