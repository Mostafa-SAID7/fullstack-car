using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.Queries;
using Application.Features.Identity.Profile.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community;

[ApiController]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/experts/preferences")]
[Authorize]
public class ExpertPreferencesController : BaseController
{
    private readonly ILogger<ExpertPreferencesController> _logger;

    public ExpertPreferencesController(ILogger<ExpertPreferencesController> logger)
    {
        _logger = logger;
    }

    [HttpGet("user/{userId}/categories")]
    public async Task<IActionResult> GetUserExpertiseCategories(Guid userId)
    {
        try
        {
            var query = new GetUserExpertiseCategoriesQuery { UserId = userId };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to retrieve expertise categories");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expertise categories for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("user/{userId}/categories")]
    public async Task<IActionResult> AddExpertiseCategory(Guid userId, [FromBody] AddExpertiseCategoryRequest request)
    {
        try
        {
            var command = new AddExpertiseCategoryCommand { UserId = userId, Category = request.Category };
            var result = await Mediator.Send(command);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to add expertise category");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding expertise category for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("user/{userId}/categories/{category}")]
    public async Task<IActionResult> RemoveExpertiseCategory(Guid userId, string category)
    {
        try
        {
            var command = new RemoveExpertiseCategoryCommand { UserId = userId, Category = category };
            var result = await Mediator.Send(command);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to remove expertise category");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing expertise category for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetExpertPreferences(Guid userId)
    {
        try
        {
            var query = new GetExpertPreferencesQuery { UserId = userId };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to retrieve expert preferences");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert preferences for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("user/{userId}")]
    public async Task<IActionResult> UpdateExpertPreferences(Guid userId, [FromBody] ExpertPreferencesDto preferences)
    {
        try
        {
            preferences.UserId = userId;
            var command = new UpdateExpertPreferencesCommand { UserId = userId, Preferences = preferences };
            var result = await Mediator.Send(command);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to update expert preferences");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating expert preferences for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}/notifications")]
    public async Task<IActionResult> GetNotificationPreferences(Guid userId)
    {
        try
        {
            var query = new GetExpertNotificationPreferencesQuery { UserId = userId };
            var result = await Mediator.Send(query);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to retrieve notification preferences");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notification preferences for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("user/{userId}/notifications")]
    public async Task<IActionResult> UpdateNotificationPreferences(Guid userId, [FromBody] UpdateNotificationPreferencesRequest request)
    {
        try
        {
            var command = new UpdateExpertNotificationPreferencesCommand 
            { 
                UserId = userId, 
                Category = request.Category,
                Enabled = request.Enabled
            };
            var result = await Mediator.Send(command);
            
            return result.IsSuccess ? Success(result.Data) : BadRequest("Failed to update notification preferences");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating notification preferences for user {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }
}
