using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Votes.Commands;
using Application.Features.Community.Services;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Common.Votes.Handlers;

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
                existingVote.VoteType == VoteType.Up ? "UpvoteReceived" : "DownvoteReceived",
                contentOwnerId,
                request.ContentId);

            // Reverse the reputation change
            await _reputationService.UpdateUserReputationAsync(
                contentOwnerId,
                -reputationChange, // Negative to reverse
                existingVote.VoteType == VoteType.Up ? "UpvoteRemoved" : "DownvoteRemoved",
                request.ContentId,
                request.ContentType.ToString());

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
                if (voteType == VoteType.Up)
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
                if (voteType == VoteType.Up)
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