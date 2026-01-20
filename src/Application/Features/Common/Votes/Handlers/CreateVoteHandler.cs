using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Votes.Commands;
using Application.Features.Community.Services;
using Domain.Entities.Community;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Common.Votes.Handlers;

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
            if (voteType == VoteType.Down)
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
            var vote = new Domain.Entities.Common.Vote
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
                voteType == VoteType.Up ? "UpvoteReceived" : "DownvoteReceived",
                contentOwnerId,
                request.Request.ContentId);

            await _reputationService.UpdateUserReputationAsync(
                contentOwnerId,
                reputationChange,
                voteType == VoteType.Up ? "UpvoteReceived" : "DownvoteReceived",
                request.Request.ContentId,
                request.Request.ContentType.ToString());

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