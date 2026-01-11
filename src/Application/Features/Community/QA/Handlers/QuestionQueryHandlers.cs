using Application.Common.Interfaces.Data;
using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Queries;
using Application.Features.Community.QA.Services;
using Domain.Enums.Community.QA;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.QA.Handlers;

public class GetQuestionDetailHandler : IRequestHandler<GetQuestionDetailQuery, Result<QuestionDetailDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IQAService _qaService;

    public GetQuestionDetailHandler(
        IApplicationDbContext context,
        IQAService qaService)
    {
        _context = context;
        _qaService = qaService;
    }

    public async Task<Result<QuestionDetailDto>> Handle(GetQuestionDetailQuery request, CancellationToken cancellationToken)
    {
        var question = await _context.Questions
            .Include(q => q.User)
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, cancellationToken);

        if (question == null)
        {
            return Result<QuestionDetailDto>.Failure("Question not found");
        }

        // Update view count
        await _qaService.UpdateQuestionViewCountAsync(question.Id);

        // Get user reputation
        var userReputation = await _context.UserReputations
            .FirstOrDefaultAsync(ur => ur.UserId == question.UserId, cancellationToken);

        // Get user's vote on this question (if authenticated)
        string? userVote = null;
        if (request.UserId.HasValue)
        {
            var vote = await _context.QAVotes
                .FirstOrDefaultAsync(v => v.UserId == request.UserId.Value && 
                                        v.ContentId == question.Id && 
                                        v.ContentType == "Question", cancellationToken);
            userVote = vote?.VoteType.ToString();
        }

        // Get answers for this question
        var answers = await _context.Answers
            .Where(a => a.QuestionId == question.Id && !a.IsDeleted)
            .Include(a => a.User)
            .OrderByDescending(a => a.IsAccepted)
            .ThenByDescending(a => a.UpvotesCount - a.DownvotesCount)
            .ThenBy(a => a.CreatedAt)
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
                UserReputation = _context.UserReputations
                    .Where(ur => ur.UserId == a.UserId)
                    .Select(ur => ur.ReputationScore)
                    .FirstOrDefault(),
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                UserVote = request.UserId.HasValue ? 
                    _context.QAVotes
                        .Where(v => v.UserId == request.UserId.Value && 
                                  v.ContentId == a.Id && 
                                  v.ContentType == "Answer")
                        .Select(v => v.VoteType.ToString())
                        .FirstOrDefault() : null
            })
            .ToListAsync(cancellationToken);

        // Get similar questions
        var similarQuestions = await GetSimilarQuestionsInternal(question.Id, question.Title, question.Content, 3, 0.7, cancellationToken);

        var questionDetailDto = new QuestionDetailDto
        {
            Id = question.Id,
            Title = question.Title,
            Content = question.Content,
            Category = "General", // TODO: Map CategoryId to category name in later tasks
            Tags = question.Tags != null ? question.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>(),
            ViewCount = question.ViewsCount,
            VoteScore = question.UpvotesCount - question.DownvotesCount,
            UpvotesCount = question.UpvotesCount,
            DownvotesCount = question.DownvotesCount,
            AnswerCount = question.AnswersCount,
            AcceptedAnswerId = question.AcceptedAnswerId,
            IsClosed = question.Status != QuestionStatus.Open,
            ClosedReason = null, // TODO: Add closed reason mapping in later tasks
            IsScheduled = false, // TODO: Add scheduling support in later tasks
            ScheduledAt = null,
            UserId = question.UserId,
            UserName = question.User?.UserName ?? "Unknown",
            UserReputation = userReputation?.ReputationScore ?? 0,
            CreatedAt = question.CreatedAt,
            UpdatedAt = question.UpdatedAt,
            UserVote = userVote,
            Answers = answers,
            SimilarQuestions = similarQuestions
        };

        return Result<QuestionDetailDto>.Success(questionDetailDto);
    }

    private async Task<List<QuestionSimilarityDto>> GetSimilarQuestionsInternal(
        Guid questionId, 
        string title, 
        string content, 
        int maxResults, 
        double minSimilarityScore, 
        CancellationToken cancellationToken)
    {
        // Simple similarity implementation - in production, use more sophisticated algorithms
        var otherQuestions = await _context.Questions
            .Where(q => q.Id != questionId && !q.IsDeleted)
            .Include(q => q.User)
            .Take(50) // Limit for performance
            .ToListAsync(cancellationToken);

        var similarQuestions = new List<QuestionSimilarityDto>();

        foreach (var otherQuestion in otherQuestions)
        {
            var titleSimilarity = await _qaService.CalculateSimilarityScoreAsync(title, otherQuestion.Title);
            var contentSimilarity = await _qaService.CalculateSimilarityScoreAsync(content, otherQuestion.Content);
            var overallSimilarity = (titleSimilarity * 0.7) + (contentSimilarity * 0.3);

            if (overallSimilarity >= minSimilarityScore)
            {
                similarQuestions.Add(new QuestionSimilarityDto
                {
                    Id = otherQuestion.Id,
                    Title = otherQuestion.Title,
                    Category = "General", // TODO: Map CategoryId to category name in later tasks
                    VoteScore = otherQuestion.UpvotesCount - otherQuestion.DownvotesCount,
                    AnswerCount = otherQuestion.AnswersCount,
                    HasAcceptedAnswer = otherQuestion.HasAcceptedAnswer,
                    SimilarityScore = overallSimilarity,
                    CreatedAt = otherQuestion.CreatedAt
                });
            }
        }

        return similarQuestions
            .OrderByDescending(q => q.SimilarityScore)
            .Take(maxResults)
            .ToList();
    }
}

public class SearchQuestionsHandler : IRequestHandler<SearchQuestionsQuery, Result<PaginatedList<QuestionListDto>>>
{
    private readonly IApplicationDbContext _context;

    public SearchQuestionsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<QuestionListDto>>> Handle(SearchQuestionsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Questions
            .Where(q => !q.IsDeleted)
            .AsQueryable();

        // Apply search term filter
        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            query = query.Where(q => 
                q.Title.ToLower().Contains(searchTerm) || 
                q.Content.ToLower().Contains(searchTerm) ||
                (q.Tags != null && q.Tags.ToLower().Contains(searchTerm)));
        }

        // Apply category filter
        if (!string.IsNullOrEmpty(request.Category))
        {
            // TODO: Filter by category when category mapping is implemented
            // query = query.Where(q => q.Category.Name == request.Category);
        }

        // Apply tags filter
        if (!string.IsNullOrEmpty(request.Tags))
        {
            query = query.Where(q => q.Tags != null && q.Tags.Contains(request.Tags));
        }

        // Apply sorting
        query = request.SortBy.ToLower() switch
        {
            "title" => request.SortDescending ? query.OrderByDescending(q => q.Title) : query.OrderBy(q => q.Title),
            "votescore" => request.SortDescending ? query.OrderByDescending(q => q.UpvotesCount - q.DownvotesCount) : query.OrderBy(q => q.UpvotesCount - q.DownvotesCount),
            "answercount" => request.SortDescending ? query.OrderByDescending(q => q.AnswersCount) : query.OrderBy(q => q.AnswersCount),
            "viewcount" => request.SortDescending ? query.OrderByDescending(q => q.ViewsCount) : query.OrderBy(q => q.ViewsCount),
            "relevance" => query.OrderByDescending(q => q.UpvotesCount - q.DownvotesCount).ThenByDescending(q => q.ViewsCount),
            _ => request.SortDescending ? query.OrderByDescending(q => q.CreatedAt) : query.OrderBy(q => q.CreatedAt)
        };

        // Join with user and reputation data
        var questionsQuery = query
            .Join(_context.Users, q => q.UserId, u => u.Id, (q, u) => new { Question = q, User = u })
            .GroupJoin(_context.UserReputations, qu => qu.User.Id, ur => ur.UserId,
                (qu, ur) => new { qu.Question, qu.User, Reputation = ur.FirstOrDefault() })
            .Select(x => new QuestionListDto
            {
                Id = x.Question.Id,
                Title = x.Question.Title,
                Category = "General", // TODO: Map CategoryId to category name in later tasks
                Tags = x.Question.Tags != null ? x.Question.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>(),
                ViewCount = x.Question.ViewsCount,
                VoteScore = x.Question.UpvotesCount - x.Question.DownvotesCount,
                AnswerCount = x.Question.AnswersCount,
                HasAcceptedAnswer = x.Question.AcceptedAnswerId != null,
                IsClosed = x.Question.Status != QuestionStatus.Open,
                UserId = x.Question.UserId,
                UserName = x.User.UserName ?? "Unknown",
                UserReputation = x.Reputation != null ? x.Reputation.ReputationScore : 0,
                CreatedAt = x.Question.CreatedAt,
                LastActivityAt = x.Question.UpdatedAt ?? x.Question.CreatedAt
            });

        var paginatedResult = await PaginatedList<QuestionListDto>.CreateAsync(
            questionsQuery, request.PageNumber, request.PageSize);

        return Result<PaginatedList<QuestionListDto>>.Success(paginatedResult);
    }
}

public class GetSimilarQuestionsHandler : IRequestHandler<GetSimilarQuestionsQuery, Result<List<QuestionSimilarityDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IQAService _qaService;

    public GetSimilarQuestionsHandler(
        IApplicationDbContext context,
        IQAService qaService)
    {
        _context = context;
        _qaService = qaService;
    }

    public async Task<Result<List<QuestionSimilarityDto>>> Handle(GetSimilarQuestionsQuery request, CancellationToken cancellationToken)
    {
        string title = request.Title ?? string.Empty;
        string content = request.Content ?? string.Empty;

        // If QuestionId is provided, get the question details
        if (request.QuestionId != Guid.Empty)
        {
            var question = await _context.Questions
                .FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, cancellationToken);

            if (question == null)
            {
                return Result<List<QuestionSimilarityDto>>.Failure("Question not found");
            }

            title = question.Title;
            content = question.Content;
        }

        if (string.IsNullOrEmpty(title) && string.IsNullOrEmpty(content))
        {
            return Result<List<QuestionSimilarityDto>>.Failure("Title or content must be provided");
        }

        // Get other questions for comparison
        var otherQuestions = await _context.Questions
            .Where(q => q.Id != request.QuestionId && !q.IsDeleted)
            .Include(q => q.User)
            .Take(100) // Limit for performance
            .ToListAsync(cancellationToken);

        var similarQuestions = new List<QuestionSimilarityDto>();

        foreach (var otherQuestion in otherQuestions)
        {
            double overallSimilarity = 0;

            if (!string.IsNullOrEmpty(title))
            {
                var titleSimilarity = await _qaService.CalculateSimilarityScoreAsync(title, otherQuestion.Title);
                overallSimilarity += titleSimilarity * 0.7;
            }

            if (!string.IsNullOrEmpty(content))
            {
                var contentSimilarity = await _qaService.CalculateSimilarityScoreAsync(content, otherQuestion.Content);
                overallSimilarity += contentSimilarity * 0.3;
            }

            if (overallSimilarity >= request.MinSimilarityScore)
            {
                similarQuestions.Add(new QuestionSimilarityDto
                {
                    Id = otherQuestion.Id,
                    Title = otherQuestion.Title,
                    Category = "General", // TODO: Map CategoryId to category name in later tasks
                    VoteScore = otherQuestion.UpvotesCount - otherQuestion.DownvotesCount,
                    AnswerCount = otherQuestion.AnswersCount,
                    HasAcceptedAnswer = otherQuestion.HasAcceptedAnswer,
                    SimilarityScore = overallSimilarity,
                    CreatedAt = otherQuestion.CreatedAt
                });
            }
        }

        var result = similarQuestions
            .OrderByDescending(q => q.SimilarityScore)
            .Take(request.MaxResults)
            .ToList();

        return Result<List<QuestionSimilarityDto>>.Success(result);
    }
}

public class GetMyQuestionsHandler : IRequestHandler<GetMyQuestionsQuery, Result<PaginatedList<QuestionListDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetMyQuestionsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<QuestionListDto>>> Handle(GetMyQuestionsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Questions
            .Where(q => q.UserId == request.UserId && !q.IsDeleted)
            .AsQueryable();

        // Apply closed filter
        if (request.IsClosed.HasValue)
        {
            var isOpen = !request.IsClosed.Value;
            query = query.Where(q => isOpen ? q.Status == QuestionStatus.Open : q.Status != QuestionStatus.Open);
        }

        // Order by creation date (most recent first)
        query = query.OrderByDescending(q => q.CreatedAt);

        // Join with user and reputation data
        var questionsQuery = query
            .Join(_context.Users, q => q.UserId, u => u.Id, (q, u) => new { Question = q, User = u })
            .GroupJoin(_context.UserReputations, qu => qu.User.Id, ur => ur.UserId,
                (qu, ur) => new { qu.Question, qu.User, Reputation = ur.FirstOrDefault() })
            .Select(x => new QuestionListDto
            {
                Id = x.Question.Id,
                Title = x.Question.Title,
                Category = "General", // TODO: Map CategoryId to category name in later tasks
                Tags = x.Question.Tags != null ? x.Question.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>(),
                ViewCount = x.Question.ViewsCount,
                VoteScore = x.Question.UpvotesCount - x.Question.DownvotesCount,
                AnswerCount = x.Question.AnswersCount,
                HasAcceptedAnswer = x.Question.AcceptedAnswerId != null,
                IsClosed = x.Question.Status != QuestionStatus.Open,
                UserId = x.Question.UserId,
                UserName = x.User.UserName ?? "Unknown",
                UserReputation = x.Reputation != null ? x.Reputation.ReputationScore : 0,
                CreatedAt = x.Question.CreatedAt,
                LastActivityAt = x.Question.UpdatedAt ?? x.Question.CreatedAt
            });

        var paginatedResult = await PaginatedList<QuestionListDto>.CreateAsync(
            questionsQuery, request.PageNumber, request.PageSize);

        return Result<PaginatedList<QuestionListDto>>.Success(paginatedResult);
    }
}