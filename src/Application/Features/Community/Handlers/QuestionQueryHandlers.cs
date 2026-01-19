using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.DTOs.Responses;
using Application.Features.Community.Queries;
using Application.Features.Community.Services;
using Domain.Enums.Community;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Handlers;

public class GetQuestionDetailHandler : IRequestHandler<GetQuestionDetailQuery, Result<QuestionDetailDto>>
{
    private readonly IApplicationDbContext _context;
    // private readonly IQAService _qaService;
    // private readonly IQASearchService _searchService;

    public GetQuestionDetailHandler(
        IApplicationDbContext context)
        // IQAService qaService,
        // IQASearchService searchService)
    {
        _context = context;
        // _qaService = qaService;
        // _searchService = searchService;
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
        // await _qaService.UpdateQuestionViewCountAsync(question.Id);

        // Get user reputation
        var userReputation = await _context.UserReputations
            .FirstOrDefaultAsync(ur => ur.UserId == question.UserId, cancellationToken);

        // Get user's vote on this question (if authenticated)
        string? userVote = null;
        if (request.UserId.HasValue)
        {
            var vote = await _context.Votes
                .FirstOrDefaultAsync(v => v.UserId == request.UserId.Value && 
                                        v.ContentId == question.Id && 
                                        v.ContentType == ContentType.Question, cancellationToken);
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
                    _context.Votes
                        .Where(v => v.UserId == request.UserId.Value && 
                                  v.ContentId == a.Id && 
                                  v.ContentType == ContentType.Answer)
                        .Select(v => v.VoteType.ToString())
                        .FirstOrDefault() : null
            })
            .ToListAsync(cancellationToken);

        // Get similar questions using the search service
        // var similarQuestionsResult = await _searchService.FindSimilarQuestionsAsync(
        //     question.Title, question.Content, question.Id, 3, 0.7, cancellationToken);
        // var similarQuestions = similarQuestionsResult.IsSuccess ? similarQuestionsResult.Data : new List<QuestionSimilarityDto>();
        var similarQuestions = new List<QuestionSimilarityDto>();

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
}

public class SearchQuestionsHandler : IRequestHandler<SearchQuestionsQuery, Result<PaginatedList<QuestionListDto>>>
{
    // private readonly IQASearchService _searchService;

    public SearchQuestionsHandler() // IQASearchService searchService)
    {
        // _searchService = searchService;
    }

    public async Task<Result<PaginatedList<QuestionListDto>>> Handle(SearchQuestionsQuery request, CancellationToken cancellationToken)
    {
        // Convert tags string to list if provided
        var tagsList = !string.IsNullOrWhiteSpace(request.Tags) 
            ? request.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim()).ToList()
            : null;

        // Use the unified search service
        /*
        var result = await _searchService.SearchQuestionsAsync(
            request.SearchTerm,
            request.Category,
            tagsList,
            null, // fromDate
            null, // toDate
            null, // minVotes
            null, // maxVotes
            null, // hasAcceptedAnswer
            null, // isClosed
            request.SortBy,
            request.SortDescending,
            request.PageNumber,
            request.PageSize,
            cancellationToken);

        return result;
        */
        return Result<PaginatedList<QuestionListDto>>.Failure("Search service not implemented");
    }
}

public class GetSimilarQuestionsHandler : IRequestHandler<GetSimilarQuestionsQuery, Result<List<QuestionSimilarityDto>>>
{
    private readonly IApplicationDbContext _context;
    // private readonly IQASearchService _searchService;

    public GetSimilarQuestionsHandler(
        IApplicationDbContext context)
        // IQASearchService searchService)
    {
        _context = context;
        // _searchService = searchService;
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

        // Use the unified search service
        // var result = await _searchService.FindSimilarQuestionsAsync(
        //    title, content, request.QuestionId, request.MaxResults, request.MinSimilarityScore, cancellationToken);
        return Result<List<QuestionSimilarityDto>>.Failure("Search service not implemented");
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
