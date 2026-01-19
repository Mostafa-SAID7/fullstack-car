using Application.Common.Interfaces.Data;
using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.QA.Handlers;

public class GetAnswersByQuestionHandler : IRequestHandler<GetAnswersByQuestionQuery, Result<PaginatedList<AnswerDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetAnswersByQuestionHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<AnswerDto>>> Handle(GetAnswersByQuestionQuery request, CancellationToken cancellationToken)
    {
        // Verify question exists
        var questionExists = await _context.Questions
            .AnyAsync(q => q.Id == request.QuestionId && !q.IsDeleted, cancellationToken);

        if (!questionExists)
        {
            return Result<PaginatedList<AnswerDto>>.Failure("Question not found");
        }

        // Build query for answers
        var query = _context.Answers
            .Include(a => a.User)
            .Include(a => a.VersionHistory)
            .Where(a => a.QuestionId == request.QuestionId && !a.IsDeleted);

        // Apply sorting
        query = request.SortBy.ToLower() switch
        {
            "votescore" => request.SortDescending 
                ? query.OrderByDescending(a => a.UpvotesCount - a.DownvotesCount)
                : query.OrderBy(a => a.UpvotesCount - a.DownvotesCount),
            "createdat" => request.SortDescending 
                ? query.OrderByDescending(a => a.CreatedAt)
                : query.OrderBy(a => a.CreatedAt),
            "updatedat" => request.SortDescending 
                ? query.OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
                : query.OrderBy(a => a.UpdatedAt ?? a.CreatedAt),
            _ => query.OrderByDescending(a => a.IsAccepted)
                     .ThenByDescending(a => a.UpvotesCount - a.DownvotesCount)
                     .ThenBy(a => a.CreatedAt)
        };

        // Get user reputations for all answer authors
        var answerUserIds = await query.Select(a => a.UserId).Distinct().ToListAsync(cancellationToken);
        var userReputations = await _context.UserReputations
            .Where(ur => answerUserIds.Contains(ur.UserId))
            .ToDictionaryAsync(ur => ur.UserId, ur => ur.ReputationScore, cancellationToken);

        // Get user votes if user is authenticated
        Dictionary<Guid, string> userVotes = new();
        if (request.UserId.HasValue)
        {
            var answerIds = await query.Select(a => a.Id).ToListAsync(cancellationToken);
            var votes = await _context.QAVotes
                .Where(v => v.UserId == request.UserId.Value && 
                           answerIds.Contains(v.ContentId) && 
                           v.ContentType == "Answer")
                .ToDictionaryAsync(v => v.ContentId, v => v.VoteType.ToString().Replace("vote", ""), cancellationToken);
            userVotes = votes;
        }

        // Apply pagination and project to DTOs
        var answersQuery = query
            .Select(a => new AnswerDto
            {
                Id = a.Id,
                QuestionId = a.QuestionId,
                Content = a.Content,
                VoteScore = a.UpvotesCount - a.DownvotesCount,
                UpvotesCount = a.UpvotesCount,
                DownvotesCount = a.DownvotesCount,
                IsAccepted = a.IsAccepted,
                AcceptedAt = a.AcceptedAt,
                UserId = a.UserId,
                UserName = a.User != null ? a.User.UserName : "Unknown",
                UserReputation = userReputations.ContainsKey(a.UserId) ? userReputations[a.UserId] : 0,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                UserVote = userVotes.ContainsKey(a.Id) ? userVotes[a.Id] : null,
                IsEdited = a.VersionHistory.Any(),
                VersionHistory = a.VersionHistory
                    .OrderBy(vh => vh.Version)
                    .Select(vh => new AnswerVersionDto
                    {
                        Version = vh.Version,
                        Content = vh.Content,
                        CreatedAt = vh.EditedAt,
                        EditReason = vh.EditReason
                    }).ToList()
            });

        var paginatedAnswers = await PaginatedList<AnswerDto>.CreateAsync(
            answersQuery, request.PageNumber, request.PageSize);

        return Result<PaginatedList<AnswerDto>>.Success(paginatedAnswers);
    }
}

public class GetAnswerHandler : IRequestHandler<GetAnswerQuery, Result<AnswerDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAnswerHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<AnswerDto>> Handle(GetAnswerQuery request, CancellationToken cancellationToken)
    {
        var answer = await _context.Answers
            .Include(a => a.User)
            .Include(a => a.VersionHistory)
            .FirstOrDefaultAsync(a => a.Id == request.AnswerId && !a.IsDeleted, cancellationToken);

        if (answer == null)
        {
            return Result<AnswerDto>.Failure("Answer not found");
        }

        // Get user reputation
        var userReputation = await _context.UserReputations
            .FirstOrDefaultAsync(ur => ur.UserId == answer.UserId, cancellationToken);

        // Get user vote if user is authenticated
        string? userVote = null;
        if (request.UserId.HasValue)
        {
            var vote = await _context.QAVotes
                .FirstOrDefaultAsync(v => v.UserId == request.UserId.Value && 
                                        v.ContentId == answer.Id && 
                                        v.ContentType == "Answer", cancellationToken);
            userVote = vote?.VoteType.ToString().Replace("vote", "");
        }

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
            UserVote = userVote,
            IsEdited = answer.VersionHistory.Any(),
            VersionHistory = answer.VersionHistory
                .OrderBy(vh => vh.Version)
                .Select(vh => new AnswerVersionDto
                {
                    Version = vh.Version,
                    Content = vh.Content,
                    CreatedAt = vh.EditedAt,
                    EditReason = vh.EditReason
                }).ToList()
        };

        return Result<AnswerDto>.Success(answerDto);
    }
}

public class GetMyAnswersHandler : IRequestHandler<GetMyAnswersQuery, Result<PaginatedList<AnswerDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetMyAnswersHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<AnswerDto>>> Handle(GetMyAnswersQuery request, CancellationToken cancellationToken)
    {
        // Build query for user's answers
        var query = _context.Answers
            .Include(a => a.User)
            .Include(a => a.Question)
            .Include(a => a.VersionHistory)
            .Where(a => a.UserId == request.UserId && !a.IsDeleted);

        // Apply acceptance filter if specified
        if (request.IsAccepted.HasValue)
        {
            query = query.Where(a => a.IsAccepted == request.IsAccepted.Value);
        }

        // Order by creation date (most recent first)
        query = query.OrderByDescending(a => a.CreatedAt);

        // Get user reputation
        var userReputation = await _context.UserReputations
            .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

        // Apply pagination and project to DTOs
        var answersQuery = query
            .Select(a => new AnswerDto
            {
                Id = a.Id,
                QuestionId = a.QuestionId,
                Content = a.Content,
                VoteScore = a.UpvotesCount - a.DownvotesCount,
                UpvotesCount = a.UpvotesCount,
                DownvotesCount = a.DownvotesCount,
                IsAccepted = a.IsAccepted,
                AcceptedAt = a.AcceptedAt,
                UserId = a.UserId,
                UserName = a.User != null ? a.User.UserName : "Unknown",
                UserReputation = userReputation != null ? userReputation.ReputationScore : 0,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                UserVote = null, // User's own answers don't show vote status
                IsEdited = a.VersionHistory.Any(),
                VersionHistory = a.VersionHistory
                    .OrderBy(vh => vh.Version)
                    .Select(vh => new AnswerVersionDto
                    {
                        Version = vh.Version,
                        Content = vh.Content,
                        CreatedAt = vh.EditedAt,
                        EditReason = vh.EditReason
                    }).ToList()
            });

        var paginatedAnswers = await PaginatedList<AnswerDto>.CreateAsync(
            answersQuery, request.PageNumber, request.PageSize);

        return Result<PaginatedList<AnswerDto>>.Success(paginatedAnswers);
    }
}