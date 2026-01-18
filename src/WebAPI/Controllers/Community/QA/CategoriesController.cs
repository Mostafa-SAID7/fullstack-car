using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

namespace WebAPI.Controllers.Community.QA
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/qa/categories")]
    public class CategoriesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public CategoriesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }
        [HttpGet]
        [OutputCache(Duration = 300, Tags = new[] { "Categories" })] // 5 minutes cache
        public async Task<IActionResult> GetCategories([FromQuery] GetCategoriesQuery query)
        {
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Categories retrieved successfully")
                : BadRequest("Failed to retrieve categories", result.Errors);
        }

        [HttpGet("{id}")]
        [OutputCache(Duration = 300, Tags = new[] { "Categories" })]
        public async Task<IActionResult> GetCategory(Guid id)
        {
            var query = new GetCategoryDetailQuery { CategoryId = id };
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Category retrieved successfully")
                : BadRequest("Failed to retrieve category", result.Errors);
        }

        [HttpGet("{id}/experts")]
        [OutputCache(Duration = 180, Tags = new[] { "Categories", "Experts" })] // 3 minutes cache
        public async Task<IActionResult> GetCategoryExperts(Guid id, [FromQuery] GetCategoryExpertsQuery query)
        {
            query.CategoryId = id;
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Category experts retrieved successfully")
                : BadRequest("Failed to retrieve category experts", result.Errors);
        }

        [HttpGet("popular")]
        [OutputCache(Duration = 600, Tags = new[] { "Categories" })] // 10 minutes cache
        public async Task<IActionResult> GetPopularCategories([FromQuery] GetPopularCategoriesQuery query)
        {
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Popular categories retrieved successfully")
                : BadRequest("Failed to retrieve popular categories", result.Errors);
        }

        [HttpPost("{categoryId}/notify-experts")]
        [Authorize(Roles = "User,Expert,Moderator,Admin")]
        public async Task<IActionResult> NotifyExperts(Guid categoryId, [FromBody] NotifyExpertsRequest request)
        {
            // Get category experts
            var expertsQuery = new GetCategoryExpertsQuery 
            { 
                CategoryId = categoryId,
                MaxResults = 20 // Notify top 20 experts
            };
            var expertsResult = await Mediator.Send(expertsQuery);

            if (!expertsResult.IsSuccess)
            {
                return BadRequest("Failed to retrieve category experts", expertsResult.Errors);
            }

            // TODO: Implement expert notification service integration
            // In a real implementation this would delegate to a notification service
            
            var notifiedExperts = expertsResult.Data
                .Where(e => e.ResponseRate > 50) // Only notify active experts
                .Take(10) // Limit to top 10 most responsive experts
                .ToList();

            return Success(new { 
                NotifiedExpertsCount = notifiedExperts.Count,
                CategoryName = notifiedExperts.FirstOrDefault()?.Category ?? "Unknown"
            }, "Expert notifications sent successfully");
        }
    }
    public class NotifyExpertsRequest
    {
        public Guid QuestionId { get; set; }
        public string QuestionTitle { get; set; } = string.Empty;
        public string QuestionPreview { get; set; } = string.Empty;
    }
}


