using Application.Common.Patterns;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Domain.Interfaces;
using Domain.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.QA.Handlers;

/// <summary>
/// Handler for promoting users to expert status
/// </summary>
public class PromoteToExpertCommandHandler : IRequestHandler<PromoteToExpertCommand, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<PromoteToExpertCommandHandler> _logger;

    public PromoteToExpertCommandHandler(
        IExpertService expertService,
        ILogger<PromoteToExpertCommandHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(PromoteToExpertCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _expertService.PromoteToExpertAsync(request.UserId, request.Category);
            _logger.LogInformation("User {UserId} promoted to expert in category {Category}. Reason: {Reason}", 
                request.UserId, request.Category, request.Reason);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error promoting user {UserId} to expert in category {Category}", 
                request.UserId, request.Category);
            return Result<bool>.Failure($"Failed to promote user to expert: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for updating expert notification preferences
/// </summary>
public class UpdateExpertNotificationPreferencesCommandHandler : IRequestHandler<UpdateExpertNotificationPreferencesCommand, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<UpdateExpertNotificationPreferencesCommandHandler> _logger;

    public UpdateExpertNotificationPreferencesCommandHandler(
        IExpertService expertService,
        ILogger<UpdateExpertNotificationPreferencesCommandHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(UpdateExpertNotificationPreferencesCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _expertService.UpdateExpertNotificationPreferencesAsync(request.UserId, request.Category, request.Enabled);
            _logger.LogInformation("Updated notification preferences for user {UserId} in category {Category}: {Enabled}", 
                request.UserId, request.Category, request.Enabled);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating notification preferences for user {UserId} in category {Category}", 
                request.UserId, request.Category);
            return Result<bool>.Failure($"Failed to update notification preferences: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for updating comprehensive expert preferences
/// </summary>
public class UpdateExpertPreferencesCommandHandler : IRequestHandler<UpdateExpertPreferencesCommand, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<UpdateExpertPreferencesCommandHandler> _logger;

    public UpdateExpertPreferencesCommandHandler(
        IExpertService expertService,
        ILogger<UpdateExpertPreferencesCommandHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(UpdateExpertPreferencesCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _expertService.UpdateExpertPreferencesAsync(request.UserId, request.Preferences);
            _logger.LogInformation("Updated comprehensive preferences for expert user {UserId}", request.UserId);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating comprehensive preferences for user {UserId}", request.UserId);
            return Result<bool>.Failure($"Failed to update expert preferences: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for adding expertise category
/// </summary>
public class AddExpertiseCategoryCommandHandler : IRequestHandler<AddExpertiseCategoryCommand, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<AddExpertiseCategoryCommandHandler> _logger;

    public AddExpertiseCategoryCommandHandler(
        IExpertService expertService,
        ILogger<AddExpertiseCategoryCommandHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(AddExpertiseCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _expertService.AddExpertiseCategoryAsync(request.UserId, request.Category);
            _logger.LogInformation("Added expertise category {Category} for user {UserId}", request.Category, request.UserId);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding expertise category {Category} for user {UserId}", request.Category, request.UserId);
            return Result<bool>.Failure($"Failed to add expertise category: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for removing expertise category
/// </summary>
public class RemoveExpertiseCategoryCommandHandler : IRequestHandler<RemoveExpertiseCategoryCommand, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<RemoveExpertiseCategoryCommandHandler> _logger;

    public RemoveExpertiseCategoryCommandHandler(
        IExpertService expertService,
        ILogger<RemoveExpertiseCategoryCommandHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(RemoveExpertiseCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _expertService.RemoveExpertiseCategoryAsync(request.UserId, request.Category);
            _logger.LogInformation("Removed expertise category {Category} for user {UserId}", request.Category, request.UserId);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing expertise category {Category} for user {UserId}", request.Category, request.UserId);
            return Result<bool>.Failure($"Failed to remove expertise category: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for notifying experts about new questions
/// </summary>
public class NotifyExpertsForQuestionCommandHandler : IRequestHandler<NotifyExpertsForQuestionCommand, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<NotifyExpertsForQuestionCommandHandler> _logger;

    public NotifyExpertsForQuestionCommandHandler(
        IExpertService expertService,
        ILogger<NotifyExpertsForQuestionCommandHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(NotifyExpertsForQuestionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _expertService.NotifyExpertsForQuestionAsync(request.QuestionId, request.Category);
            _logger.LogInformation("Notified experts in category {Category} about question {QuestionId}", 
                request.Category, request.QuestionId);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying experts in category {Category} about question {QuestionId}", 
                request.Category, request.QuestionId);
            return Result<bool>.Failure($"Failed to notify experts: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for updating expert statistics
/// </summary>
public class UpdateExpertStatsCommandHandler : IRequestHandler<UpdateExpertStatsCommand, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<UpdateExpertStatsCommandHandler> _logger;

    public UpdateExpertStatsCommandHandler(
        IExpertService expertService,
        ILogger<UpdateExpertStatsCommandHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(UpdateExpertStatsCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _expertService.UpdateExpertStatsAsync(request.UserId, request.Category, request.ActivityType);
            _logger.LogInformation("Updated expert stats for user {UserId} in category {Category} for activity {ActivityType}", 
                request.UserId, request.Category, request.ActivityType);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating expert stats for user {UserId} in category {Category}", 
                request.UserId, request.Category);
            return Result<bool>.Failure($"Failed to update expert stats: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for checking and awarding expert badges
/// </summary>
public class CheckAndAwardExpertBadgesCommandHandler : IRequestHandler<CheckAndAwardExpertBadgesCommand, Result<List<string>>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<CheckAndAwardExpertBadgesCommandHandler> _logger;

    public CheckAndAwardExpertBadgesCommandHandler(
        IExpertService expertService,
        ILogger<CheckAndAwardExpertBadgesCommandHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<List<string>>> Handle(CheckAndAwardExpertBadgesCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _expertService.CheckAndAwardExpertBadgesAsync(request.UserId, request.Category);
            var badges = await _expertService.GetExpertBadgesAsync(request.UserId);
            _logger.LogInformation("Checked and awarded expert badges for user {UserId} in category {Category}", 
                request.UserId, request.Category);
            return Result<List<string>>.Success(badges);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking and awarding expert badges for user {UserId} in category {Category}", 
                request.UserId, request.Category);
            return Result<List<string>>.Failure($"Failed to check and award expert badges: {ex.Message}");
        }
    }
}