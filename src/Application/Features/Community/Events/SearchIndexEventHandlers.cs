using Application.Features.Community.Services;
using Domain.Events.Community;
using Domain.Events.Community.QA;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.Events;

/// <summary>
/// Event handlers for automatically updating search index when content changes
/// </summary>
public class SearchIndexEventHandlers :
    INotificationHandler<QuestionCreatedEvent>,
    INotificationHandler<QuestionUpdatedEvent>,
    INotificationHandler<QuestionDeletedEvent>,
    INotificationHandler<AnswerCreatedEvent>,
    INotificationHandler<AnswerUpdatedEvent>,
    INotificationHandler<AnswerDeletedEvent>,
    INotificationHandler<VoteCreatedEvent>,
    INotificationHandler<VoteUpdatedEvent>,
    INotificationHandler<VoteDeletedEvent>
{
    private readonly ISearchService _searchService;
    private readonly ILogger<SearchIndexEventHandlers> _logger;

    public SearchIndexEventHandlers(
        ISearchService searchService,
        ILogger<SearchIndexEventHandlers> logger)
    {
        _searchService = searchService;
        _logger = logger;
    }

    public async Task Handle(QuestionCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling QuestionCreatedEvent for question {QuestionId}", notification.QuestionId);
        
        var result = await _searchService.UpdateSearchIndexAsync(notification.QuestionId, "Question", cancellationToken);
        if (!result.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for created question {QuestionId}: {Error}", 
                notification.QuestionId, result.ErrorMessage);
        }
    }

    public async Task Handle(QuestionUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling QuestionUpdatedEvent for question {QuestionId}", notification.QuestionId);
        
        var result = await _searchService.UpdateSearchIndexAsync(notification.QuestionId, "Question", cancellationToken);
        if (!result.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for updated question {QuestionId}: {Error}", 
                notification.QuestionId, result.ErrorMessage);
        }
    }

    public async Task Handle(QuestionDeletedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling QuestionDeletedEvent for question {QuestionId}", notification.QuestionId);
        
        var result = await _searchService.UpdateSearchIndexAsync(notification.QuestionId, "Question", cancellationToken);
        if (!result.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for deleted question {QuestionId}: {Error}", 
                notification.QuestionId, result.ErrorMessage);
        }
    }

    public async Task Handle(AnswerCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling AnswerCreatedEvent for answer {AnswerId}", notification.AnswerId);
        
        // Update search index for the answer
        var answerResult = await _searchService.UpdateSearchIndexAsync(notification.AnswerId, "Answer", cancellationToken);
        if (!answerResult.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for created answer {AnswerId}: {Error}", 
                notification.AnswerId, answerResult.ErrorMessage);
        }

        // Also update the question index since answer count changed
        var questionResult = await _searchService.UpdateSearchIndexAsync(notification.QuestionId, "Question", cancellationToken);
        if (!questionResult.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for question {QuestionId} after answer creation: {Error}", 
                notification.QuestionId, questionResult.ErrorMessage);
        }
    }

    public async Task Handle(AnswerUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling AnswerUpdatedEvent for answer {AnswerId}", notification.AnswerId);
        
        var result = await _searchService.UpdateSearchIndexAsync(notification.AnswerId, "Answer", cancellationToken);
        if (!result.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for updated answer {AnswerId}: {Error}", 
                notification.AnswerId, result.ErrorMessage);
        }
    }

    public async Task Handle(AnswerDeletedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling AnswerDeletedEvent for answer {AnswerId}", notification.AnswerId);
        
        // Update search index for the answer
        var answerResult = await _searchService.UpdateSearchIndexAsync(notification.AnswerId, "Answer", cancellationToken);
        if (!answerResult.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for deleted answer {AnswerId}: {Error}", 
                notification.AnswerId, answerResult.ErrorMessage);
        }

        // Also update the question index since answer count changed
        var questionResult = await _searchService.UpdateSearchIndexAsync(notification.QuestionId, "Question", cancellationToken);
        if (!questionResult.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for question {QuestionId} after answer deletion: {Error}", 
                notification.QuestionId, questionResult.ErrorMessage);
        }
    }

    public async Task Handle(VoteCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling VoteCreatedEvent for {ContentType} {ContentId}", notification.ContentType, notification.ContentId);
        
        var result = await _searchService.UpdateSearchIndexAsync(notification.ContentId, notification.ContentType, cancellationToken);
        if (!result.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for voted {ContentType} {ContentId}: {Error}", 
                notification.ContentType, notification.ContentId, result.ErrorMessage);
        }
    }

    public async Task Handle(VoteUpdatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling VoteUpdatedEvent for {ContentType} {ContentId}", notification.ContentType, notification.ContentId);
        
        var result = await _searchService.UpdateSearchIndexAsync(notification.ContentId, notification.ContentType, cancellationToken);
        if (!result.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for vote-updated {ContentType} {ContentId}: {Error}", 
                notification.ContentType, notification.ContentId, result.ErrorMessage);
        }
    }

    public async Task Handle(VoteDeletedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Handling VoteDeletedEvent for {ContentType} {ContentId}", notification.ContentType, notification.ContentId);
        
        var result = await _searchService.UpdateSearchIndexAsync(notification.ContentId, notification.ContentType, cancellationToken);
        if (!result.IsSuccess)
        {
            _logger.LogWarning("Failed to update search index for vote-deleted {ContentType} {ContentId}: {Error}", 
                notification.ContentType, notification.ContentId, result.ErrorMessage);
        }
    }
}
