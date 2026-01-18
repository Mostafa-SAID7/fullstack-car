using Application.Common.Models;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.Queries;
using Application.Features.Community.QA.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Controllers;
using Asp.Versioning;

namespace WebAPI.Controllers.Community;

[ApiController]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/experts")]
[Authorize]
public class ExpertsController : BaseController
{
    private readonly ILogger<ExpertsController> _logger;

    public ExpertsController(ILogger<ExpertsController> logger)
    {
        _logger = logger;
    }

    #region Expert Detection and Ranking
    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetExpertsByCategory(string category)
    {
        try
        {
            var query = new GetExpertsByCategoryQuery { Category = category };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting experts for category {Category}", category);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("category/{category}/ranked")]
    public async Task<IActionResult> GetRankedExperts(string category, [FromQuery] int count = 10)
    {
        try
        {
            var query = new GetRankedExpertsQuery { Category = category, Count = count };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting ranked experts for category {Category}", category);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}/category/{category}/is-expert")]
    public async Task<IActionResult> IsUserExpertInCategory(Guid userId, string category)
    {
        try
        {
            var query = new IsUserExpertInCategoryQuery { UserId = userId, Category = category };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user {UserId} is expert in category {Category}", userId, category);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}/category/{category}/expertise-level")]
    public async Task<IActionResult> GetExpertiseLevel(Guid userId, string category)
    {
        try
        {
            var query = new DetermineExpertiseLevelQuery { UserId = userId, Category = category };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expertise level for user {UserId} in category {Category}", userId, category);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("user/{userId}/promote")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<IActionResult> PromoteToExpert(Guid userId, [FromBody] PromoteExpertRequest request)
    {
        try
        {
            var command = new PromoteToExpertCommand 
            { 
                UserId = userId, 
                Category = request.Category,
                Reason = request.Reason
            };
            var result = await Mediator.Send(command);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error promoting user {UserId} to expert in category {Category}", userId, request.Category);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("user/{userId}/stats")]
    public async Task<IActionResult> UpdateExpertStats(Guid userId, [FromBody] UpdateExpertStatsRequest request)
    {
        try
        {
            var command = new UpdateExpertStatsCommand 
            { 
                UserId = userId, 
                Category = request.Category,
                ActivityType = request.ActivityType
            };
            var result = await Mediator.Send(command);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating expert stats for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }
    #endregion

    #region Expert Notification System
    [HttpGet("category/{category}/notifiable")]
    public async Task<IActionResult> GetNotifiableExperts(string category)
    {
        try
        {
                var query = new GetNotifiableExpertsQuery { Category = category };
                var result = await Mediator.Send(query);
                
                return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notifiable experts for category {Category}", category);
                return StatusCode(500, "Internal server error");
            }
        }

    [HttpPost("notify")]
    public async Task<IActionResult> NotifyExpertsForQuestion([FromBody] NotifyExpertsRequest request)
    {
        try
        {
            var command = new NotifyExpertsForQuestionCommand 
            { 
                QuestionId = request.QuestionId, 
                Category = request.Category 
            };
            var result = await Mediator.Send(command);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying experts for question {QuestionId}", request.QuestionId);
            return StatusCode(500, "Internal server error");
        }
    }
    #endregion

    #region Expert Badge and Recognition
    [HttpGet("user/{userId}/badges")]
    public async Task<IActionResult> GetExpertBadges(Guid userId)
    {
        try
        {
            var query = new GetExpertBadgesQuery { UserId = userId };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert badges for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}/category/{category}/has-badge")]
    public async Task<IActionResult> HasExpertBadge(Guid userId, string category)
    {
        try
        {
            var query = new HasExpertBadgeQuery { UserId = userId, Category = category };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking expert badge for user {UserId} in category {Category}", userId, category);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("user/{userId}/category/{category}/check-badges")]
    public async Task<IActionResult> CheckAndAwardBadges(Guid userId, string category)
    {
        try
        {
            var command = new CheckAndAwardExpertBadgesCommand { UserId = userId, Category = category };
            var result = await Mediator.Send(command);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest(result.ErrorMessage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking and awarding badges for user {UserId} in category {Category}", userId, category);
            return StatusCode(500, "Internal server error");
        }
    }
    #endregion
}