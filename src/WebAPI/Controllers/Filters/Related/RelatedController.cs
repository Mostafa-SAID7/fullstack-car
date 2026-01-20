using Application.Features.Filters.Related.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Filters.Related;

[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/filters/related")]
public class RelatedController : BaseController
{
    [HttpGet("{contentType}/{contentId}")]
    [AllowAnonymous]
    [OutputCache(Duration = 600, Tags = new[] { "Related", "Content" })]
    public async Task<IActionResult> GetRelatedContent(
        Guid contentId, 
        string contentType,
        [FromQuery] int limit = 5,
        [FromQuery] string algorithm = "similarity")
    {
        if (!Enum.TryParse<ContentType>(contentType, out var parsedContentType))
        {
            return BadRequest("Invalid content type");
        }

        var query = new GetRelatedContentQuery
        {
            ContentId = contentId,
            ContentType = parsedContentType,
            Limit = limit,
            Algorithm = algorithm
        };

        var result = await Mediator.Send(query);

        if (result.Succeeded)
        {
            return Success(result.Data, "Related content retrieved successfully");
        }

        return BadRequest("Failed to retrieve related content", result.Errors);
    }
}