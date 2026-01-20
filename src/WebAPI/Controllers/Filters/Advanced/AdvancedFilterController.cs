using Application.Features.Filters.Advanced.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Filters.Advanced;

[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/filters/advanced")]
public class AdvancedFilterController : BaseController
{
    [HttpPost("filter")]
    [AllowAnonymous]
    [OutputCache(Duration = 120, Tags = new[] { "Advanced", "Filters" })]
    public async Task<IActionResult> GetFilteredContent([FromBody] GetFilteredContentQuery query)
    {
        var result = await Mediator.Send(query);

        if (result.Succeeded)
        {
            return Success(result.Data, "Filtered content retrieved successfully");
        }

        return BadRequest("Failed to retrieve filtered content", result.Errors);
    }

    [HttpGet("facets")]
    [AllowAnonymous]
    [OutputCache(Duration = 600, Tags = new[] { "Facets", "Filters" })]
    public async Task<IActionResult> GetFilterFacets([FromQuery] string contentType = "")
    {
        // Placeholder implementation for filter facets
        return Success(new List<object>(), "Filter facets retrieved successfully");
    }
}