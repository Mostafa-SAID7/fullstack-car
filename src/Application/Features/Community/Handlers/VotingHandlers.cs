using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.Commands;
using Application.Features.Community.Services;
using Domain.Entities.Community;
using Domain.Enums.Community;
using Domain.Enums.Common;
using VoteType = Domain.Enums.Community.VoteType;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.Handlers;

public class CreateVoteHandler : IRequestHandler<CreateVoteCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IReputationService _reputationService;
    private readonly ILogger<CreateVoteHandler> _logger;

    public CreateVoteHandler(
        IApplicationDbContext context,
        IReputationService reputationService,
        ILogger<CreateVoteHandler> logger)
    {
        _context = context;
        _reputationService = reputationService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(CreateVoteCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var voteType = request.Request.VoteType;

            // Check if content exists and get content owner
            Guid contentOwnerId;
            if (request.Request.ContentType == ContentType.Question)
            {
                var question = await _context.Questions
                    .FirstOrDefaultAsync(q => q.Id == request.Request.ContentId && !q.IsDeleted, cancellationToken);
                
                if (question == null)
                {
                    return Result<bool>.Failure("Question not found.");
                }
                contentOwnerId = question.UserId;
            }
            else if (request.Request.ContentType == ContentType.Answer)
            {
                var answer = await _context.Answers
                    .FirstOrDefaultAsync(a => a.Id == request.Request.ContentId && !a.IsDeleted, cancellationToken);
                
                if (answer == null)
                {
                    return Result<bool>.Failure("Answer not found.");
                }
                contentOwnerId = answer.UserId;
            }
            else
            {
                return Result<bool>.Failure("Invalid content type. Must be 'Question' or 'Answer'.");
            }

            // Prevent self-voting
            if (request.UserId == contentOwnerId)
            {
                return Result<bool>.Failure("Users cannot vote on their own content.");
            }

            // Check if user has sufficient reputation for downvoting
            if (voteType == VoteType.Downvote)
            {
                var hasSufficientReputation = await _reputationService.HasSufficientReputationAsync(request.UserId, "Downvote");
                if (!hasSufficientReputation)
                {
                    return Result<bool>.Failure("Insufficient reputation to downvote. Minimum reputation required.");
                }
            }

            // Check if user has already voted on this content
            var existingVote = await _context.Votes
                .FirstOrDefaultAsync(v => v.UserId == request.UserId 
                    && v.ContentId == request.Request.ContentId 
                    && v.ContentType == request.Request.ContentType, cancellationToken);

            if (existingVote != null)
            {
                return Result<bool>.Failure("User has already voted on this content. Use change vote instead.");
            }

            // Create new vote
            var vote = new Vote
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                ContentId = request.Request.ContentId,
                ContentType = request.Request.ContentType,
                VoteType = voteType,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = request.UserId.ToString()
            };

            _context.Votes.Add(vote);

            // Update vote counts on the content
            await UpdateVoteCountsAsync(request.Request.ContentId, request.Request.ContentType, voteType, true, cancellationToken);

            // Update reputation for content owner
            var reputationChange = await _reputationService.CalculateReputationChangeAsync(
                voteType == VoteType.Upvote ? "UpvoteReceived" : "DownvoteReceived",
                contentOwnerId,
                request.Request.ContentId);

            await _reputationService.UpdateUserReputationAsync(
                contentOwnerId,
                reputationChange,
                voteType == VoteType.Upvote ? "UpvoteReceived" : "DownvoteReceived",
                request.Request.ContentId,
                request.Request.ContentType);

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Vote created successfully. UserId: {UserId}, ContentId: {ContentId}, VoteType: {VoteType}",
                request.UserId, request.Request.ContentId, voteType);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating vote for user {UserId} on content {ContentId}",
                request.UserId, request.Request.ContentId);
            return Result<bool>.Failure("An error occurred while creating the vote.");
        }
    }

    private async Task UpdateVoteCountsAsync(Guid contentId, ContentType contentType, VoteType voteType, bool isAdding, CancellationToken cancellationToken)
    {
        if (contentType == ContentType.Question)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == contentId, cancellationToken);
            if (question != null)
            {
                if (voteType == VoteType.Upvote)
                {
                    question.UpvotesCount += isAdding ? 1 : -1;
                }
                else
                {
                    question.DownvotesCount += isAdding ? 1 : -1;
                }
                question.UpdatedAt = DateTime.UtcNow;
            }
        }
        else if (contentType == ContentType.Answer)
        {
            var answer = await _context.Answers.FirstOrDefaultAsync(a => a.Id == contentId, cancellationToken);
            if (answer != null)
            {
                if (voteType == VoteType.Upvote)
                {
                    answer.UpvotesCount += isAdding ? 1 : -1;
                }
                else
                {
                    answer.DownvotesCount += isAdding ? 1 : -1;
                }
                answer.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}

public class RemoveVoteHandler : IRequestHandler<RemoveVoteCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IReputationService _reputationService;
    private readonly ILogger<RemoveVoteHandler> _logger;

    public RemoveVoteHandler(
        IApplicationDbContext context,
        IReputationService reputationService,
        ILogger<RemoveVoteHandler> logger)
    {
        _context = context;
        _reputationService = reputationService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(RemoveVoteCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Find existing vote
            var existingVote = await _context.Votes
                .FirstOrDefaultAsync(v => v.UserId == request.UserId 
                    && v.ContentId == request.ContentId 
                    && v.ContentType == request.ContentType, cancellationToken);

            if (existingVote == null)
            {
                return Result<bool>.Failure("Vote not found.");
            }

            // Check if vote can be removed (within 5 minutes)
            var voteAge = DateTime.UtcNow - existingVote.CreatedAt;
            if (voteAge.TotalMinutes > 5)
            {
                return Result<bool>.Failure("Votes can only be removed within 5 minutes of casting.");
            }

            // Get content owner for reputation update
            Guid contentOwnerId;
            if (request.ContentType == ContentType.Question)
            {
                var question = await _context.Questions
                    .FirstOrDefaultAsync(q => q.Id == request.ContentId && !q.IsDeleted, cancellationToken);
                
                if (question == null)
                {
                    return Result<bool>.Failure("Question not found.");
                }
                contentOwnerId = question.UserId;
            }
            else if (request.ContentType == ContentType.Answer)
            {
                var answer = await _context.Answers
                    .FirstOrDefaultAsync(a => a.Id == request.ContentId && !a.IsDeleted, cancellationToken);
                
                if (answer == null)
                {
                    return Result<bool>.Failure("Answer not found.");
                }
                contentOwnerId = answer.UserId;
            }
            else
            {
                return Result<bool>.Failure("Invalid content type. Must be 'Question' or 'Answer'.");
            }

            // Remove vote
            _context.Votes.Remove(existingVote);

            // Update vote counts on the content (subtract the vote)
            await UpdateVoteCountsAsync(request.ContentId, request.ContentType, existingVote.VoteType, false, cancellationToken);

            // Reverse reputation change for content owner
            var reputationChange = await _reputationService.CalculateReputationChangeAsync(
                existingVote.VoteType == VoteType.Upvote ? "UpvoteReceived" : "DownvoteReceived",
                contentOwnerId,
                request.ContentId);

            // Reverse the reputation change
            await _reputationService.UpdateUserReputationAsync(
                contentOwnerId,
                -reputationChange, // Negative to reverse
                existingVote.VoteType == VoteType.Upvote ? "UpvoteRemoved" : "DownvoteRemoved",
                request.ContentId,
                request.ContentType);

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Vote removed successfully. UserId: {UserId}, ContentId: {ContentId}, VoteType: {VoteType}",
                request.UserId, request.ContentId, existingVote.VoteType);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing vote for user {UserId} on content {ContentId}",
                request.UserId, request.ContentId);
            return Result<bool>.Failure("An error occurred while removing the vote.");
        }
    }

    private async Task UpdateVoteCountsAsync(Guid contentId, ContentType contentType, VoteType voteType, bool isAdding, CancellationToken cancellationToken)
    {
        if (contentType == ContentType.Question)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == contentId, cancellationToken);
            if (question != null)
            {
                if (voteType == VoteType.Upvote)
                {
                    question.UpvotesCount += isAdding ? 1 : -1;
                }
                else
                {
                    question.DownvotesCount += isAdding ? 1 : -1;
                }
                question.UpdatedAt = DateTime.UtcNow;
            }
        }
        else if (contentType == ContentType.Answer)
        {
            var answer = await _context.Answers.FirstOrDefaultAsync(a => a.Id == contentId, cancellationToken);
            if (answer != null)
            {
                if (voteType == VoteType.Upvote)
                {
                    answer.UpvotesCount += isAdding ? 1 : -1;
                }
                else
                {
                    answer.DownvotesCount += isAdding ? 1 : -1;
                }
                answer.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}

public class ChangeVoteHandler : IRequestHandler<ChangeVoteCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IReputationService _reputationService;
    private readonly ILogger<ChangeVoteHandler> _logger;

    public ChangeVoteHandler(
        IApplicationDbContext context,
        IReputationService reputationService,
        ILogger<ChangeVoteHandler> logger)
    {
        _context = context;
        _reputationService = reputationService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(ChangeVoteCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var newVoteType = request.Request.NewVoteType;

            // Find existing vote
            var existingVote = await _context.Votes
                .FirstOrDefaultAsync(v => v.UserId == request.UserId 
                    && v.ContentId == request.Request.ContentId 
                    && v.ContentType == request.Request.ContentType, cancellationToken);

            if (existingVote == null)
            {
                return Result<bool>.Failure("No existing vote found to change.");
            }

            // Check if vote can be changed (within 5 minutes)
            var voteAge = DateTime.UtcNow - existingVote.CreatedAt;
            if (voteAge.TotalMinutes > 5)
            {
                return Result<bool>.Failure("Votes can only be changed within 5 minutes of casting.");
            }

            // Check if the new vote type is different
            if (existingVote.VoteType == newVoteType)
            {
                return Result<bool>.Failure("Vote is already of the requested type.");
            }

            // Check if user has sufficient reputation for downvoting (if changing to downvote)
            if (newVoteType == VoteType.Downvote)
            {
                var hasSufficientReputation = await _reputationService.HasSufficientReputationAsync(request.UserId, "Downvote");
                if (!hasSufficientReputation)
                {
                    return Result<bool>.Failure("Insufficient reputation to downvote. Minimum reputation required.");
                }
            }

            // Get content owner for reputation update
            Guid contentOwnerId;
            if (request.Request.ContentType == ContentType.Question)
            {
                var question = await _context.Questions
                    .FirstOrDefaultAsync(q => q.Id == request.Request.ContentId && !q.IsDeleted, cancellationToken);
                
                if (question == null)
                {
                    return Result<bool>.Failure("Question not found.");
                }
                contentOwnerId = question.UserId;
            }
            else if (request.Request.ContentType == ContentType.Answer)
            {
                var answer = await _context.Answers
                    .FirstOrDefaultAsync(a => a.Id == request.Request.ContentId && !a.IsDeleted, cancellationToken);
                
                if (answer == null)
                {
                    return Result<bool>.Failure("Answer not found.");
                }
                contentOwnerId = answer.UserId;
            }
            else
            {
                return Result<bool>.Failure("Invalid content type. Must be 'Question' or 'Answer'.");
            }

            var oldVoteType = existingVote.VoteType;

            // Update the vote
            existingVote.VoteType = newVoteType;
            existingVote.UpdatedAt = DateTime.UtcNow;
            existingVote.UpdatedBy = request.UserId.ToString();

            // Update vote counts on the content (remove old vote, add new vote)
            await UpdateVoteCountsAsync(request.Request.ContentId, request.Request.ContentType, oldVoteType, false, cancellationToken);
            await UpdateVoteCountsAsync(request.Request.ContentId, request.Request.ContentType, newVoteType, true, cancellationToken);

            // Reverse old reputation change and apply new one
            var oldReputationChange = await _reputationService.CalculateReputationChangeAsync(
                oldVoteType == VoteType.Upvote ? "UpvoteReceived" : "DownvoteReceived",
                contentOwnerId,
                request.Request.ContentId);

            var newReputationChange = await _reputationService.CalculateReputationChangeAsync(
                newVoteType == VoteType.Upvote ? "UpvoteReceived" : "DownvoteReceived",
                contentOwnerId,
                request.Request.ContentId);

            // Apply net reputation change
            var netReputationChange = newReputationChange - oldReputationChange;
            await _reputationService.UpdateUserReputationAsync(
                contentOwnerId,
                netReputationChange,
                "VoteChanged",
                request.Request.ContentId,
                request.Request.ContentType);

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Vote changed successfully. UserId: {UserId}, ContentId: {ContentId}, OldVoteType: {OldVoteType}, NewVoteType: {NewVoteType}",
                request.UserId, request.Request.ContentId, oldVoteType, newVoteType);

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing vote for user {UserId} on content {ContentId}",
                request.UserId, request.Request.ContentId);
            return Result<bool>.Failure("An error occurred while changing the vote.");
        }
    }

    private async Task UpdateVoteCountsAsync(Guid contentId, ContentType contentType, VoteType voteType, bool isAdding, CancellationToken cancellationToken)
    {
        if (contentType == ContentType.Question)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == contentId, cancellationToken);
            if (question != null)
            {
                if (voteType == VoteType.Upvote)
                {
                    question.UpvotesCount += isAdding ? 1 : -1;
                }
                else
                {
                    question.DownvotesCount += isAdding ? 1 : -1;
                }
                question.UpdatedAt = DateTime.UtcNow;
            }
        }
        else if (contentType == ContentType.Answer)
        {
            var answer = await _context.Answers.FirstOrDefaultAsync(a => a.Id == contentId, cancellationToken);
            if (answer != null)
            {
                if (voteType == VoteType.Upvote)
                {
                    answer.UpvotesCount += isAdding ? 1 : -1;
                }
                else
                {
                    answer.DownvotesCount += isAdding ? 1 : -1;
                }
                answer.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
