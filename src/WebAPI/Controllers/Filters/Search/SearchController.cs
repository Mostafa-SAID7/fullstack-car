using Application.Features.Filters.Search.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Filters.Search;

[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/filters/search")]
public class SearchController : BaseController
{
    [HttpGet]
    [AllowAnonymous]
    [OutputCache(Duration = 60, Tags = new[] { "Search", "Filters" })]
    public async Task<IActionResult> SearchContent([FromQuery] SearchContentQuery query)
    {
        if (string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            return BadRequest("Search term is required");
        }

        var result = await Mediator.Send(query);

        if (result.Succeeded)
        {
            return Success(result.Data, "Search completed successfully");
        }

        return BadRequest("Search failed", result.Errors);
    }

    [HttpGet("suggestions")]
    [AllowAnonymous]
    [OutputCache(Duration = 300, Tags = new[] { "Search", "Suggestions" })]
    public async Task<IActionResult> GetSearchSuggestions([FromQuery] string term)
    {
        if (string.IsNullOrWhiteSpace(term))
        {
            return BadRequest("Search term is required");
        }

        // Placeholder implementation
        return Success(new List<string>(), "Search suggestions retrieved successfully");
    }
}