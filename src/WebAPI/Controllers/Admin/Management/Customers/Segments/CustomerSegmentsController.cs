using Application.Features.Admin.Management.Customers.Commands;
using Application.Features.Admin.Management.Customers.DTOs.Requests;
using Application.Features.Admin.Management.Customers.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Customers.Segments;

[Authorize(Roles = "Admin")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/admin/customers/segments")]
public class CustomerSegmentsController : BaseController
{
    private readonly ILogger<CustomerSegmentsController> _logger;

    public CustomerSegmentsController(ILogger<CustomerSegmentsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetCustomerSegments()
    {
        try
        {
            var query = new GetCustomerSegmentsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customer segments");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{segmentId}/customers")]
    public async Task<IActionResult> GetCustomersBySegment(
        Guid segmentId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        try
        {
            var query = new GetCustomersBySegmentQuery
            {
                SegmentId = segmentId,
                Page = page,
                PageSize = pageSize,
                Search = search
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting customers by segment");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCustomerSegment([FromBody] CreateCustomerSegmentRequest request)
    {
        try
        {
            var command = new CreateCustomerSegmentCommand
            {
                AdminId = GetCurrentUserId(),
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetCustomersBySegment), new { segmentId = result.Data.Id }, result.Data);

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer segment");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{segmentId}")]
    public async Task<IActionResult> UpdateCustomerSegment(Guid segmentId, [FromBody] UpdateCustomerSegmentRequest request)
    {
        try
        {
            var command = new UpdateCustomerSegmentCommand
            {
                SegmentId = segmentId,
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
            _logger.LogError(ex, "Error updating customer segment");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{segmentId}")]
    public async Task<IActionResult> DeleteCustomerSegment(Guid segmentId)
    {
        try
        {
            var command = new DeleteCustomerSegmentCommand
            {
                SegmentId = segmentId,
                AdminId = GetCurrentUserId()
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting customer segment");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("high-value")]
    public async Task<IActionResult> GetHighValueCustomers(
        [FromQuery] decimal minSpent = 1000,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetHighValueCustomersQuery
            {
                MinSpent = minSpent,
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
            _logger.LogError(ex, "Error getting high value customers");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("at-risk")]
    public async Task<IActionResult> GetAtRiskCustomers(
        [FromQuery] int inactiveDays = 90,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetAtRiskCustomersQuery
            {
                InactiveDays = inactiveDays,
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
            _logger.LogError(ex, "Error getting at-risk customers");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}