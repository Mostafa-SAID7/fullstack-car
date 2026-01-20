using Application.Features.Filters.Trends.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Filters.Trends;

[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/filters/trends")]
public class TrendsController : BaseController
{
    [HttpGet]
    [AllowAnonymous]
    [OutputCache(Duration = 300, Tags = new[] { "Trends", "Filters" })]
    public async Task<IActionResult> GetTrends([FromQuery] GetTrendsQuery query)
    {
        var result = await Mediator.Send(query);

        if (result.Succeeded)
        {
            return Success(result.Data, "Trends retrieved successfully");
        }

        return BadRequest("Failed to retrieve trends", result.Errors);
    }

    [HttpGet("categories/{category}")]
    [AllowAnonymous]
    [OutputCache(Duration = 300, Tags = new[] { "Trends", "Categories" })]
    public async Task<IActionResult> GetTrendsByCategory(string category, [FromQuery] GetTrendsQuery query)
    {
        query.Category = category;
        var result = await Mediator.Send(query);

        if (result.Succeeded)
        {
            return Success(result.Data, $"Trends for category '{category}' retrieved successfully");
        }

        return BadRequest($"Failed to retrieve trends for category '{category}'", result.Errors);
    }
}