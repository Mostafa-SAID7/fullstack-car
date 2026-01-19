using Application.Features.Community.DTOs.Responses;
using Application.Features.Community.Interfaces;
using Domain.Events.Community;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.Events;

/// <summary>
/// Event handlers for real-time notifications through SignalR
/// Provides unified real-time communication for both Angular and React clients
/// </summary>
public class RealtimeEventHandlers :
    INotificationHandler<QuestionCreatedEvent>,
    INotificationHandler<AnswerCreatedEvent>,
    INotificationHandler<VoteCreatedEvent>,
    INotificationHandler<VoteUpdatedEvent>,
    INotificationHandler<AnswerAcceptedEvent>,
    INotificationHandler<ReputationUpdatedEvent>,
    INotificationHandler<BadgesEarnedEvent>
{
    private readonly IHubService _hubService;
    private readonly ILogger<RealtimeEventHandlers> _logger;

    public RealtimeEventHandlers(
        IHubService hubService,
        ILogger<RealtimeEventHandlers> logger)
    {
        _hubService = hubService;
        _logger = logger;
    }

    /// <summary>
    /// Handle question created events for real-time notifications
    /// </summary>
    public async Task Handle(QuestionCreatedEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Handling QuestionCreatedEvent for real-time notification: {QuestionId}", notification.QuestionId);

            // Create expert notification for category experts
            var expertNotification = new ExpertNotificationDto
            {
                QuestionId = notification.QuestionId,
                Category = notification.Category,
                Tags = notification.Tags,
                NotifiedExpertIds = new List<Guid>(), // This would be populated by expert service
                NotificationReason = $"New question in {notification.Category}",
                QuestionCreatedAt = DateTime.UtcNow
            };

            // Notify experts about the new question
            await _hubService.NotifyExpertsAsync(expertNotification);

            // Create new question notification for category followers
            var newQuestionNotification = new NewQuestionNotificationDto
            {
                Question = new QuestionDto
                {
                    Id = notification.QuestionId,
                    UserId = notification.UserId,
                    Category = notification.Category,
                    Tags = notification.Tags,
                    CreatedAt = DateTime.UtcNow
                },
                Timestamp = DateTime.UtcNow
            };

            // Notify category followers
            await _hubService.NotifyNewQuestionToCategoryAsync(newQuestionNotification, notification.Category);

            _logger.LogInformation("Successfully sent real-time notifications for question creation: {QuestionId}", notification.QuestionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send real-time notifications for question creation: {QuestionId}", notification.QuestionId);
            // Don't rethrow - real-time notifications are not critical for core functionality
        }
    }

    /// <summary>
    /// Handle answer created events for real-time notifications
    /// </summary>
    public async Task Handle(AnswerCreatedEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Handling AnswerCreatedEvent for real-time notification: {AnswerId}", notification.AnswerId);

            // Create answer DTO for notification
            var answerDto = new AnswerDto
            {
                Id = notification.AnswerId,
                QuestionId = notification.QuestionId,
                UserId = notification.UserId,
                CreatedAt = DateTime.UtcNow,
                VoteScore = 0,
                IsAccepted = false
            };

            // Send real-time notification to all viewers of the question
            await _hubService.NotifyNewAnswerAsync(answerDto);

            _logger.LogInformation("Successfully sent real-time notification for answer creation: {AnswerId}", notification.AnswerId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send real-time notification for answer creation: {AnswerId}", notification.AnswerId);
            // Don't rethrow - real-time notifications are not critical for core functionality
        }
    }

    /// <summary>
    /// Handle vote created events for real-time notifications
    /// </summary>
    public async Task Handle(VoteCreatedEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Handling VoteCreatedEvent for real-time notification: {ContentType} {ContentId}", 
                notification.ContentType, notification.ContentId);

            // Create vote update DTO
            var voteUpdateDto = new VoteUpdateDto
            {
                ContentId = notification.ContentId,
                ContentType = notification.ContentType,
                VoteType = notification.VoteType,
                VoterId = notification.UserId,
                Timestamp = DateTime.UtcNow
            };

            // Send real-time vote update notification
            await _hubService.NotifyVoteUpdateAsync(voteUpdateDto);

            _logger.LogInformation("Successfully sent real-time notification for vote creation: {ContentType} {ContentId}", 
                notification.ContentType, notification.ContentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send real-time notification for vote creation: {ContentType} {ContentId}", 
                notification.ContentType, notification.ContentId);
            // Don't rethrow - real-time notifications are not critical for core functionality
        }
    }

    /// <summary>
    /// Handle vote updated events for real-time notifications
    /// </summary>
    public async Task Handle(VoteUpdatedEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Handling VoteUpdatedEvent for real-time notification: {ContentType} {ContentId}", 
                notification.ContentType, notification.ContentId);

            // Create vote update DTO
            var voteUpdateDto = new VoteUpdateDto
            {
                ContentId = notification.ContentId,
                ContentType = notification.ContentType,
                VoteType = notification.NewVoteType,
                VoterId = notification.UserId,
                Timestamp = DateTime.UtcNow
            };

            // Send real-time vote update notification
            await _hubService.NotifyVoteUpdateAsync(voteUpdateDto);

            _logger.LogInformation("Successfully sent real-time notification for vote update: {ContentType} {ContentId}", 
                notification.ContentType, notification.ContentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send real-time notification for vote update: {ContentType} {ContentId}", 
                notification.ContentType, notification.ContentId);
            // Don't rethrow - real-time notifications are not critical for core functionality
        }
    }

    /// <summary>
    /// Handle answer accepted events for real-time notifications
    /// </summary>
    public async Task Handle(AnswerAcceptedEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Handling AnswerAcceptedEvent for real-time notification: {AnswerId}", notification.AnswerId);

            // Create answer accepted DTO
            var answerAcceptedDto = new AnswerAcceptedDto
            {
                AnswerId = notification.AnswerId,
                QuestionId = notification.QuestionId,
                AnswerAuthorId = notification.AnswerAuthorId,
                AcceptedByUserId = notification.QuestionAuthorId,
                AcceptedAt = DateTime.UtcNow
            };

            // Send real-time answer accepted notification
            await _hubService.NotifyAnswerAcceptedAsync(answerAcceptedDto);

            _logger.LogInformation("Successfully sent real-time notification for answer acceptance: {AnswerId}", notification.AnswerId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send real-time notification for answer acceptance: {AnswerId}", notification.AnswerId);
            // Don't rethrow - real-time notifications are not critical for core functionality
        }
    }

    /// <summary>
    /// Handle reputation updated events for real-time notifications
    /// </summary>
    public async Task Handle(ReputationUpdatedEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Handling ReputationUpdatedEvent for real-time notification: User {UserId}, Change {Change}", 
                notification.UserId, notification.Change);

            // Create reputation update DTO
            var reputationUpdateDto = new ReputationUpdateDto
            {
                UserId = notification.UserId,
                OldReputation = notification.PreviousReputation,
                NewReputation = notification.NewReputation,
                Change = notification.Change,
                Reason = notification.Reason,
                RelatedContentId = notification.SourceContentId != null ? Guid.Parse(notification.SourceContentId) : null,
                RelatedContentType = notification.SourceContentType,
                BadgesEarned = new List<string>(), // Will be populated by badges earned event
                Timestamp = DateTime.UtcNow
            };

            // Send real-time reputation update notification
            await _hubService.NotifyReputationUpdateAsync(reputationUpdateDto);

            _logger.LogInformation("Successfully sent real-time notification for reputation update: User {UserId}, Change {Change}", 
                notification.UserId, notification.Change);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send real-time notification for reputation update: User {UserId}", notification.UserId);
            // Don't rethrow - real-time notifications are not critical for core functionality
        }
    }

    /// <summary>
    /// Handle badges earned events for real-time notifications
    /// </summary>
    public async Task Handle(BadgesEarnedEvent notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogDebug("Handling BadgesEarnedEvent for real-time notification: User {UserId}, Badges {Badges}", 
                notification.UserId, string.Join(", ", notification.BadgesEarned));

            // Create reputation update DTO with badge information
            var reputationUpdateDto = new ReputationUpdateDto
            {
                UserId = notification.UserId,
                OldReputation = notification.CurrentReputationScore,
                NewReputation = notification.CurrentReputationScore,
                Change = 0, // No reputation change, just badge award
                Reason = notification.Reason,
                BadgesEarned = notification.BadgesEarned,
                Timestamp = DateTime.UtcNow
            };

            // Send real-time badge earned notification
            await _hubService.NotifyReputationUpdateAsync(reputationUpdateDto);

            _logger.LogInformation("Successfully sent real-time notification for badges earned: User {UserId}, Badges {Badges}", 
                notification.UserId, string.Join(", ", notification.BadgesEarned));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send real-time notification for badges earned: User {UserId}", notification.UserId);
            // Don't rethrow - real-time notifications are not critical for core functionality
        }
    }
}
