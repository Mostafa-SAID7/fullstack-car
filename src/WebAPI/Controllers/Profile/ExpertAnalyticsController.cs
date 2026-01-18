using Application.Features.Community.QA.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community;

[ApiController]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/experts/analytics")]
[Authorize]
public class ExpertAnalyticsController : BaseController
{
    private readonly ILogger<ExpertAnalyticsController> _logger;

    public ExpertAnalyticsController(ILogger<ExpertAnalyticsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetExpertAnalytics(Guid userId, [FromQuery] string? category = null)
    {
        try
        {
            var query = new GetExpertAnalyticsQuery { UserId = userId, Category = category };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to retrieve expert analytics");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert analytics for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("category/{category}/leaderboard")]
    public async Task<IActionResult> GetExpertLeaderboard(string category, [FromQuery] int count = 10)
    {
        try
        {
            var query = new GetExpertLeaderboardQuery { Category = category, Count = count };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to retrieve expert leaderboard");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert leaderboard for category {Category}", category);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}/category/{category}/performance")]
    public async Task<IActionResult> GetExpertPerformance(Guid userId, string category)
    {
        try
        {
            var query = new GetExpertPerformanceQuery { UserId = userId, Category = category };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to retrieve expert performance");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert performance for user {UserId} in category {Category}", userId, category);
            return StatusCode(500, "Internal server error");
        }
    }
}
