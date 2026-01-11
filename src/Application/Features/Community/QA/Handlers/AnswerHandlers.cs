using Application.Common.Interfaces.Data;
using Application.Common.Models;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Domain.Enums.Community.QA;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.QA.Handlers;

public class CreateAnswerHandler : IRequestHandler<CreateAnswerCommand, Result<AnswerDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IQAService _qaService;
    private readonly IReputationService _reputationService;

    public CreateAnswerHandler(
        IApplicationDbContext context,
        IQAService qaService,
        IReputationService reputationService)
    {
        _context = context;
        _qaService = qaService;
        _reputationService = reputationService;
    }

    public async Task<Result<AnswerDto>> Handle(CreateAnswerCommand request, CancellationToken cancellationToken)
    {
        // Validate that the question exists and is open
        var question = await _context.Questions
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, cancellationToken);

        if (question == null)
        {
            return Result<AnswerDto>.Failure("Question not found");
        }

        if (question.Status != QuestionStatus.Open)
        {
            return Result<AnswerDto>.Failure("Cannot answer a closed question");
        }

        // Validate content quality
        var isQualityContent = await _qaService.ValidateContentQualityAsync(request.Request.Content);
        if (!isQualityContent)
        {
            return Result<AnswerDto>.Failure("Answer content does not meet quality standards");
        }

        // Check for duplicate answers by the same user
        var existingAnswer = await _context.Answers
            .FirstOrDefaultAsync(a => a.QuestionId == request.QuestionId && 
                                    a.UserId == request.UserId && 
                                    !a.IsDeleted, cancellationToken);

        if (existingAnswer != null)
        {
            return Result<AnswerDto>.Failure("You have already answered this question. Please edit your existing answer instead.");
        }

        // Create the answer
        var answer = new Answer
        {
            QuestionId = request.QuestionId,
            UserId = request.UserId,
            Content = request.Request.Content,
            Status = AnswerStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        _context.Answers.Add(answer);

        // Update question answer count
        question.AnswersCount++;
        question.UpdatedAt = DateTime.UtcNow;

        // Award reputation for providing an answer
        await _reputationService.UpdateUserReputationAsync(
            request.UserId,
            5, // Points for answering
            "AnswerGiven",
            answer.Id,
            "General"); // TODO: Use actual category in later tasks

        await _context.SaveChangesAsync(cancellationToken);

        // Get user information for response
        var user = await _context.Users.FindAsync(request.UserId);
        var userReputation = await _context.UserReputations
            .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

        var answerDto = new AnswerDto
        {
            Id = answer.Id,
            QuestionId = answer.QuestionId,
            Content = answer.Content,
            VoteScore = answer.UpvotesCount - answer.DownvotesCount,
            UpvotesCount = answer.UpvotesCount,
            DownvotesCount = answer.DownvotesCount,
            IsAccepted = answer.IsAccepted,
            AcceptedAt = answer.AcceptedAt,
            UserId = answer.UserId,
            UserName = user?.UserName ?? "Unknown",
            UserReputation = userReputation?.ReputationScore ?? 0,
            CreatedAt = answer.CreatedAt,
            UpdatedAt = answer.UpdatedAt,
            UserVote = null, // TODO: Get user's vote in later tasks
            IsEdited = false,
            VersionHistory = new List<AnswerVersionDto>()
        };

        return Result<AnswerDto>.Success(answerDto);
    }
}

public class UpdateAnswerHandler : IRequestHandler<UpdateAnswerCommand, Result<AnswerDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IQAService _qaService;

    public UpdateAnswerHandler(
        IApplicationDbContext context,
        IQAService qaService)
    {
        _context = context;
        _qaService = qaService;
    }

    public async Task<Result<AnswerDto>> Handle(UpdateAnswerCommand request, CancellationToken cancellationToken)
    {
        var answer = await _context.Answers
            .Include(a => a.User)
            .Include(a => a.Question)
            .Include(a => a.VersionHistory)
            .FirstOrDefaultAsync(a => a.Id == request.AnswerId && !a.IsDeleted, cancellationToken);

        if (answer == null)
        {
            return Result<AnswerDto>.Failure("Answer not found");
        }

        // Check if user owns the answer or has moderator privileges
        if (answer.UserId != request.UserId)
        {
            // TODO: Add moderator role check in later tasks
            return Result<AnswerDto>.Failure("You can only edit your own answers");
        }

        // Check if answer can be edited (within reasonable time or no votes)
        var canEdit = answer.CreatedAt.AddHours(24) > DateTime.UtcNow || 
                     (answer.UpvotesCount == 0 && answer.DownvotesCount == 0);
        if (!canEdit)
        {
            return Result<AnswerDto>.Failure("Answer cannot be edited after 24 hours if it has votes");
        }

        // Validate content quality
        var isQualityContent = await _qaService.ValidateContentQualityAsync(request.Request.Content);
        if (!isQualityContent)
        {
            return Result<AnswerDto>.Failure("Answer content does not meet quality standards");
        }

        // Save current version to history before updating
        var currentVersion = answer.VersionHistory.Count + 1;
        var answerHistory = new AnswerHistory
        {
            AnswerId = answer.Id,
            Content = answer.Content,
            Version = currentVersion,
            EditReason = "Content updated", // TODO: Allow user to provide edit reason
            EditedByUserId = request.UserId,
            EditedAt = DateTime.UtcNow
        };

        _context.AnswerHistories.Add(answerHistory);

        // Update the answer
        answer.Content = request.Request.Content;
        answer.UpdatedAt = DateTime.UtcNow;

        // Update question's last activity
        answer.Question.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Get user reputation for response
        var userReputation = await _context.UserReputations
            .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

        // Build version history for response
        var versionHistory = answer.VersionHistory
            .OrderBy(vh => vh.Version)
            .Select(vh => new AnswerVersionDto
            {
                Version = vh.Version,
                Content = vh.Content,
                CreatedAt = vh.EditedAt,
                EditReason = vh.EditReason
            })
            .ToList();

        var answerDto = new AnswerDto
        {
            Id = answer.Id,
            QuestionId = answer.QuestionId,
            Content = answer.Content,
            VoteScore = answer.UpvotesCount - answer.DownvotesCount,
            UpvotesCount = answer.UpvotesCount,
            DownvotesCount = answer.DownvotesCount,
            IsAccepted = answer.IsAccepted,
            AcceptedAt = answer.AcceptedAt,
            UserId = answer.UserId,
            UserName = answer.User?.UserName ?? "Unknown",
            UserReputation = userReputation?.ReputationScore ?? 0,
            CreatedAt = answer.CreatedAt,
            UpdatedAt = answer.UpdatedAt,
            UserVote = null, // TODO: Get user's vote in later tasks
            IsEdited = versionHistory.Count > 0,
            VersionHistory = versionHistory
        };

        return Result<AnswerDto>.Success(answerDto);
    }
}

public class DeleteAnswerHandler : IRequestHandler<DeleteAnswerCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IReputationService _reputationService;

    public DeleteAnswerHandler(
        IApplicationDbContext context,
        IReputationService reputationService)
    {
        _context = context;
        _reputationService = reputationService;
    }

    public async Task<Result<bool>> Handle(DeleteAnswerCommand request, CancellationToken cancellationToken)
    {
        var answer = await _context.Answers
            .Include(a => a.Question)
            .FirstOrDefaultAsync(a => a.Id == request.AnswerId && !a.IsDeleted, cancellationToken);

        if (answer == null)
        {
            return Result<bool>.Failure("Answer not found");
        }

        // Check if user owns the answer or has moderator privileges
        if (answer.UserId != request.UserId)
        {
            // TODO: Add moderator role check in later tasks
            return Result<bool>.Failure("You can only delete your own answers");
        }

        // Check if answer can be deleted (not accepted and low vote count)
        if (answer.IsAccepted)
        {
            return Result<bool>.Failure("Cannot delete an accepted answer");
        }

        if (answer.UpvotesCount > 3)
        {
            return Result<bool>.Failure("Cannot delete answers with high vote counts");
        }

        // Soft delete the answer
        answer.IsDeleted = true;
        answer.DeletedAt = DateTime.UtcNow;

        // Update question answer count
        var question = answer.Question;
        question.AnswersCount = Math.Max(0, question.AnswersCount - 1);
        question.UpdatedAt = DateTime.UtcNow;

        // Remove reputation points for the deleted answer
        await _reputationService.UpdateUserReputationAsync(
            request.UserId,
            -5, // Penalty for deleting answer
            "AnswerDeleted",
            request.AnswerId,
            "General"); // TODO: Use actual category in later tasks

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}