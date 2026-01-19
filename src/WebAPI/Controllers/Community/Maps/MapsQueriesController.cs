using Application.Common.Attributes;
using Application.Features.Community.Maps.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Maps
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/maps")]
    public class MapsQueriesController : BaseController
    {
        [HttpGet("nearby")]
        [AllowAnonymous]
        [Cache(Duration = 180, Tags = new[] { "Maps", "Nearby" }, VaryByParameters = new[] { "latitude", "longitude", "radiusKm", "category", "pageSize" })]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "latitude", "longitude", "radiusKm", "category", "pageSize" })]
        public async Task<IActionResult> GetNearbyLocations(
            [FromQuery] double latitude,
            [FromQuery] double longitude,
            [FromQuery] double radiusKm = 10,
            [FromQuery] string? category = null,
            [FromQuery] int pageSize = 20)
        {
            var query = new GetNearbyLocationsQuery
            {
                Latitude = latitude,
                Longitude = longitude,
                RadiusKm = radiusKm,
                Category = category,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Nearby locations retrieved successfully");

            return BadRequest("Failed to retrieve nearby locations", result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [Cache(Duration = 180, Tags = new[] { "Maps", "Search" })]
        [OutputCache(PolicyName = "MediumCache")]
        public async Task<IActionResult> SearchLocations([FromQuery] Application.Features.Community.Maps.Queries.SearchLocationsQuery query)
        {
            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result, "Location search completed successfully");

            return BadRequest("Failed to search locations", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [Cache(Duration = 3600, Tags = new[] { "Maps", "Categories" })]
        [OutputCache(PolicyName = "ExtraLongCache")]
        public async Task<IActionResult> GetLocationCategories()
        {
            var query = new GetLocationCategoriesQuery();
            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result, "Location categories retrieved successfully");

            return BadRequest("Failed to retrieve categories", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [Cache(Duration = 1800, Tags = new[] { "Maps", "Stats" })]
        [OutputCache(PolicyName = "LongCache")]
        public async Task<IActionResult> GetMapStats()
        {
            var query = new GetMapStatsQuery();
            var result = await Mediator.Send(query);
            
            if (result.Succeeded)
                return Success(result, "Map statistics retrieved successfully");

            return BadRequest("Failed to retrieve map statistics", result.Errors);
        }
    }
}
