using Application.Features.Marketplace.Customers.Commands;
using Application.Features.Marketplace.Customers.DTOs.Requests;
using Application.Features.Marketplace.Customers.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Marketplace.Customers.Loyalty;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/marketplace/customers/loyalty")]
public class CustomerLoyaltyController : BaseController
{
    private readonly ILogger<CustomerLoyaltyController> _logger;

    public CustomerLoyaltyController(ILogger<CustomerLoyaltyController> logger)
    {
        _logger = logger;
    }

    [HttpGet("programs")]
    public async Task<IActionResult> GetLoyaltyPrograms()
    {
        try
        {
            var query = new GetLoyaltyProgramsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting loyalty programs");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("top-customers")]
    public async Task<IActionResult> GetTopLoyaltyCustomers(
        [FromQuery] int topCount = 50,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var query = new GetTopLoyaltyCustomersQuery
            {
                TopCount = topCount,
                FromDate = fromDate ?? DateTime.UtcNow.AddMonths(-12),
                ToDate = toDate ?? DateTime.UtcNow
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting top loyalty customers");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{customerId}/points/add")]
    public async Task<IActionResult> AddLoyaltyPoints(Guid customerId, [FromBody] AddLoyaltyPointsRequest request)
    {
        try
        {
            var command = new AddLoyaltyPointsCommand
            {
                CustomerId = customerId,
                AdminId = GetCurrentUserId(),
                Points = request.Points,
                Reason = request.Reason,
                ExpiryDate = request.ExpiryDate
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding loyalty points");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{customerId}/points/deduct")]
    public async Task<IActionResult> DeductLoyaltyPoints(Guid customerId, [FromBody] DeductLoyaltyPointsRequest request)
    {
        try
        {
            var command = new DeductLoyaltyPointsCommand
            {
                CustomerId = customerId,
                AdminId = GetCurrentUserId(),
                Points = request.Points,
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deducting loyalty points");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{customerId}/points/history")]
    public async Task<IActionResult> GetLoyaltyPointsHistory(
        Guid customerId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var query = new GetLoyaltyPointsHistoryQuery
            {
                CustomerId = customerId,
                Page = page,
                PageSize = pageSize,
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
            _logger.LogError(ex, "Error getting loyalty points history");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("bulk-points-update")]
    public async Task<IActionResult> BulkUpdateLoyaltyPoints([FromBody] BulkUpdateLoyaltyPointsRequest request)
    {
        try
        {
            var command = new BulkUpdateLoyaltyPointsCommand
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
            _logger.LogError(ex, "Error bulk updating loyalty points");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}


