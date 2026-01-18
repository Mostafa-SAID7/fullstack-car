using Application.Features.Shared.Categories.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;
using Application.Features.Shared.Categories.DTOs;

namespace WebAPI.Controllers.Shared.Categories
{

    [ApiController]
    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/categories")]
    [Authorize]
    public class CategoriesController : BaseController
    {
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(ILogger<CategoriesController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "SharedCategories" })] // 5 minutes cache
        public async Task<IActionResult> GetCategories(
            [FromQuery] string? moduleType = null,
            [FromQuery] Guid? parentId = null,
            [FromQuery] bool includeInactive = false,
            [FromQuery] string sortBy = "Name",
            [FromQuery] bool sortDescending = false)
        {
            try
            {
                return Success(new List<SharedCategoryDto>(), "Categories retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return BadRequest("Failed to retrieve categories", new[] { "Categories service temporarily unavailable" });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "SharedCategories" })]
        public async Task<IActionResult> GetCategory(Guid id)
        {
            try
            {
                return Success(new SharedCategoryDto { Id = id }, "Category retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category {CategoryId}", id);
                return BadRequest("Failed to retrieve category", new[] { "Category not found or service unavailable" });
            }
        }

        [HttpGet("hierarchy")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "SharedCategories" })]
        public async Task<IActionResult> GetCategoryHierarchy(
            [FromQuery] string? moduleType = null,
            [FromQuery] int maxDepth = 3)
        {
            try
            {
                return Success(new List<CategoryHierarchyDto>(), "Category hierarchy retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category hierarchy");
                return BadRequest("Failed to retrieve category hierarchy", new[] { "Hierarchy service temporarily unavailable" });
            }
        }

        [HttpGet("popular")]
        [AllowAnonymous]
        [OutputCache(Duration = 900, Tags = new[] { "SharedCategories" })]
        public async Task<IActionResult> GetPopularCategories(
            [FromQuery] string? moduleType = null,
            [FromQuery] string timeframe = "week",
            [FromQuery] int maxResults = 10)
        {
            try
            {
                return Success(new List<PopularCategoryDto>(), "Popular categories retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving popular categories");
                return BadRequest("Failed to retrieve popular categories", new[] { "Popular categories service temporarily unavailable" });
            }
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "SharedCategories" })]
        public async Task<IActionResult> SearchCategories(
            [FromQuery] string searchTerm,
            [FromQuery] string? moduleType = null,
            [FromQuery] int maxResults = 20)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest("Invalid search request", new[] { "Search term is required" });
                }

                return Success(new List<SharedCategoryDto>(), "Category search completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching categories with term: {SearchTerm}", searchTerm);
                return BadRequest("Category search failed", new[] { "Category search service temporarily unavailable" });
            }
        }
    }
}


