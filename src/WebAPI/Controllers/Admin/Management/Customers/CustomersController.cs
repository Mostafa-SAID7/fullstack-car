using Application.Features.Admin.Management.Customers.Commands;
using Application.Features.Admin.Management.Customers.DTOs.Requests;
using Application.Features.Admin.Management.Customers.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Customers;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/admin/customers")]
public class CustomersController : BaseController
{
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ILogger<CustomersController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCustomers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] Domain.Enums.Admin.Management.CustomerStatus? status = null,
        [FromQuery] Domain.Enums.Admin.Management.CustomerType? type = null,
        [FromQuery] string? country = null,
        [FromQuery] string? city = null,
        [FromQuery] decimal? minSpent = null,
        [FromQuery] decimal? maxSpent = null,
        [FromQuery] DateTime? registeredAfter = null,
        [FromQuery] DateTime? registeredBefore = null,
        [FromQuery] bool? hasOrders = null,
        [FromQuery] string? sortBy = "CreatedAt",
        [FromQuery] string? sortDirection = "desc")
    {
        try
        {
            var query = new GetCustomersQuery
            {
                Page = page,
                PageSize = pageSize,
                Search = search,
                Status = status,
                Type = type,
                Country = country,
                City = city,
                MinSpent = minSpent,
                MaxSpent = maxSpent,
                RegisteredAfter = registeredAfter,
                RegisteredBefore = registeredBefore,
                HasOrders = hasOrders,
                SortBy = sortBy,
                SortDirection = sortDirection
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customers list");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomer(Guid id)
    {
        try
        {
            var query = new GetCustomerByIdQuery { CustomerId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer details");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetCustomerStatistics(
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var query = new GetCustomerStatisticsQuery
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
            _logger.LogError(ex, "Error getting customer statistics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchCustomers(
        [FromQuery] string searchTerm,
        [FromQuery] int limit = 20,
        [FromQuery] Domain.Enums.Admin.Management.CustomerType? type = null,
        [FromQuery] Domain.Enums.Admin.Management.CustomerStatus? status = null)
    {
        try
        {
            var query = new SearchCustomersQuery
            {
                SearchTerm = searchTerm,
                Limit = limit,
                Type = type,
                Status = status
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching customers");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
    {
        try
        {
            var command = new CreateCustomerCommand
            {
                AdminId = GetCurrentUserId(),
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetCustomer), new { id = result.Data.Id }, result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request)
    {
        try
        {
            var command = new UpdateCustomerCommand
            {
                CustomerId = id,
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
            _logger.LogError(ex, "Error updating customer");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(Guid id)
    {
        try
        {
            var command = new DeleteCustomerCommand
            {
                CustomerId = id,
                AdminId = GetCurrentUserId()
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting customer");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateCustomerStatus(Guid id, [FromBody] Domain.Enums.Admin.Management.CustomerStatus status)
    {
        try
        {
            var command = new UpdateCustomerStatusCommand
            {
                CustomerId = id,
                AdminId = GetCurrentUserId(),
                Status = status
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating customer status");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPatch("{id}/type")]
    public async Task<IActionResult> UpdateCustomerType(Guid id, [FromBody] Domain.Enums.Admin.Management.CustomerType type)
    {
        try
        {
            var command = new UpdateCustomerTypeCommand
            {
                CustomerId = id,
                AdminId = GetCurrentUserId(),
                Type = type
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating customer type");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{id}/loyalty-points")]
    public async Task<IActionResult> AddLoyaltyPoints(Guid id, [FromBody] AddLoyaltyPointsRequest request)
    {
        try
        {
            var command = new AddLoyaltyPointsCommand
            {
                CustomerId = id,
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
            _logger.LogError(ex, "Error adding loyalty points");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("bulk-update")]
    public async Task<IActionResult> BulkUpdateCustomers([FromBody] BulkUpdateCustomersRequest request)
    {
        try
        {
            var command = new BulkUpdateCustomersCommand
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
            _logger.LogError(ex, "Error bulk updating customers");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}