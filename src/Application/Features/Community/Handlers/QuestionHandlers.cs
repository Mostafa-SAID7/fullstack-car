using Application.Common.Interfaces.Data;
using Application.Common.Models;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Queries;
using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Domain.Enums.Community.QA;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.QA.Handlers;

public class CreateQuestionHandler : IRequestHandler<CreateQuestionCommand, Result<QuestionDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IQAService _qaService;
    private readonly IContentQualityService _contentQualityService;
    private readonly IReputationService _reputationService;
    private readonly IDuplicatePreventionService _duplicatePreventionService;

    public CreateQuestionHandler(
        IApplicationDbContext context,
        IQAService qaService,
        IContentQualityService contentQualityService,
        IReputationService reputationService,
        IDuplicatePreventionService duplicatePreventionService)
    {
        _context = context;
        _qaService = qaService;
        _contentQualityService = contentQualityService;
        _reputationService = reputationService;
        _duplicatePreventionService = duplicatePreventionService;
    }

    public async Task<Result<QuestionDto>> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        // Enhanced content quality validation
        var qualityScore = await _contentQualityService.EvaluateQuestionQualityAsync(request.Request.Title, request.Request.Content);
        if (qualityScore < 0.5) // Minimum quality threshold
        {
            var assessment = await _contentQualityService.GetDetailedQualityAssessmentAsync(request.Request.Content, "Question");
            var issues = assessment?.QualityIssues?.Any() == true 
                ? string.Join(", ", assessment.QualityIssues) 
                : "Content does not meet quality standards";
            return Result<QuestionDto>.Failure($"Question does not meet quality standards: {issues}");
        }

        // Check for spam
        var isSpam = await _contentQualityService.IsSpamAsync(request.Request.Content);
        if (isSpam)
        {
            return Result<QuestionDto>.Failure("Question content appears to be spam");
        }

        // Check for inappropriate content
        var inappropriateContent = await _contentQualityService.DetectInappropriateContentAsync(request.Request.Content);
        if (inappropriateContent.Any())
        {
            var issues = string.Join(", ", inappropriateContent);
            return Result<QuestionDto>.Failure($"Question contains inappropriate content: {issues}");
        }

        // Enhanced duplicate prevention with semantic analysis
        var duplicateValidation = await _duplicatePreventionService.ValidateQuestionForDuplicatesAsync(
            request.Request.Title, 
            request.Request.Content, 
            "General", // TODO: Use actual category in later tasks
            request.Request.Tags,
            cancellationToken);

        if (!duplicateValidation.IsSuccess)
        {
            return Result<QuestionDto>.Failure(duplicateValidation.ErrorMessage ?? "Duplicate validation failed");
        }

        if (!duplicateValidation.Data.IsValid)
        {
            if (duplicateValidation.Data.ValidationStatus == "Duplicate")
            {
                var duplicateInfo = duplicateValidation.Data.DuplicateInfo;
                return Result<QuestionDto>.Failure(
                    $"This question is a duplicate of an existing question: '{duplicateInfo?.DuplicateQuestionTitle}'. " +
                    $"Please check the existing question at {duplicateInfo?.RedirectUrl}");
            }
            else if (duplicateValidation.Data.ValidationStatus == "Similar")
            {
                // For similar questions, we could either warn or proceed
                // For now, let's proceed but log the similar questions for analytics
                var similarCount = duplicateValidation.Data.SuggestedQuestions.Count;
                // Log similar questions found for potential user notification
            }
        }

        // Create the question
        var question = new Question
        {
            UserId = request.UserId,
            Title = request.Request.Title,
            Content = request.Request.Content,
            CategoryId = null, // TODO: Map category string to CategoryId in later tasks
            Tags = string.Join(",", request.Request.Tags),
            CreatedAt = DateTime.UtcNow
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync(cancellationToken);

        // Notify experts in the category
        // TODO: Implement expert notification in later tasks
        // await _qaService.NotifyExpertsAsync(question.Id, question.Category);

        // Get user information for response
        var user = await _context.Users.FindAsync(request.UserId);
        var userReputation = await _context.UserReputations
            .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

        var questionDto = new QuestionDto
        {
            Id = question.Id,
            Title = question.Title,
            Content = question.Content,
            Category = "General", // TODO: Map CategoryId to category name in later tasks
            Tags = request.Request.Tags,
            ViewCount = question.ViewsCount,
            VoteScore = question.UpvotesCount - question.DownvotesCount,
            UpvotesCount = question.UpvotesCount,
            DownvotesCount = question.DownvotesCount,
            AnswerCount = question.AnswersCount,
            AcceptedAnswerId = question.AcceptedAnswerId,
            IsClosed = question.Status != Domain.Enums.Community.QA.QuestionStatus.Open,
            ClosedReason = null, // TODO: Add closed reason mapping in later tasks
            IsScheduled = false, // TODO: Add scheduling support in later tasks
            ScheduledAt = null,
            UserId = question.UserId,
            UserName = user?.UserName ?? "Unknown",
            UserReputation = userReputation?.ReputationScore ?? 0,
            CreatedAt = question.CreatedAt,
            UpdatedAt = question.UpdatedAt
        };

        return Result<QuestionDto>.Success(questionDto);
    }
}

public class GetQuestionsHandler : IRequestHandler<GetQuestionsQuery, Result<PaginatedList<QuestionListDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetQuestionsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<QuestionListDto>>> Handle(GetQuestionsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Questions
            .Where(q => !q.IsDeleted)
            .AsQueryable();

        // Apply search term filter with improved case-insensitive search
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

        // Apply user filter
        if (request.UserId.HasValue)
        {
            query = query.Where(q => q.UserId == request.UserId.Value);
        }

        // Apply closed status filter
        if (request.IsClosed.HasValue)
        {
            var isOpen = !request.IsClosed.Value;
            query = query.Where(q => isOpen ? q.Status == QuestionStatus.Open : q.Status != QuestionStatus.Open);
        }

        // Apply sorting with additional options for better UX
        query = request.SortBy.ToLower() switch
        {
            "title" => request.SortDescending ? query.OrderByDescending(q => q.Title) : query.OrderBy(q => q.Title),
            "votescore" => request.SortDescending ? query.OrderByDescending(q => q.UpvotesCount - q.DownvotesCount) : query.OrderBy(q => q.UpvotesCount - q.DownvotesCount),
            "answercount" => request.SortDescending ? query.OrderByDescending(q => q.AnswersCount) : query.OrderBy(q => q.AnswersCount),
            "viewcount" => request.SortDescending ? query.OrderByDescending(q => q.ViewsCount) : query.OrderBy(q => q.ViewsCount),
            "activity" => request.SortDescending ? query.OrderByDescending(q => q.UpdatedAt ?? q.CreatedAt) : query.OrderBy(q => q.UpdatedAt ?? q.CreatedAt),
            _ => request.SortDescending ? query.OrderByDescending(q => q.CreatedAt) : query.OrderBy(q => q.CreatedAt)
        };

        // Join with user and reputation data for optimized responses (Angular & React friendly)
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

public class UpdateQuestionHandler : IRequestHandler<UpdateQuestionCommand, Result<QuestionDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IQAService _qaService;
    private readonly IContentQualityService _contentQualityService;
    private readonly IDuplicatePreventionService _duplicatePreventionService;

    public UpdateQuestionHandler(
        IApplicationDbContext context,
        IQAService qaService,
        IContentQualityService contentQualityService,
        IDuplicatePreventionService duplicatePreventionService)
    {
        _context = context;
        _qaService = qaService;
        _contentQualityService = contentQualityService;
        _duplicatePreventionService = duplicatePreventionService;
    }

    public async Task<Result<QuestionDto>> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = await _context.Questions
            .Include(q => q.User)
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, cancellationToken);

        if (question == null)
        {
            return Result<QuestionDto>.Failure("Question not found");
        }

        // Check if user owns the question or has moderator privileges
        if (question.UserId != request.UserId)
        {
            // TODO: Add moderator role check in later tasks
            return Result<QuestionDto>.Failure("You can only edit your own questions");
        }

        // Check if question can be edited (within 24 hours or no answers)
        var canEdit = question.CreatedAt.AddHours(24) > DateTime.UtcNow || question.AnswersCount == 0;
        if (!canEdit)
        {
            return Result<QuestionDto>.Failure("Question cannot be edited after 24 hours if it has answers");
        }

        // Enhanced content quality validation
        var qualityScore = await _contentQualityService.EvaluateQuestionQualityAsync(request.Request.Title, request.Request.Content);
        if (qualityScore < 0.5) // Minimum quality threshold
        {
            var assessment = await _contentQualityService.GetDetailedQualityAssessmentAsync(request.Request.Content, "Question");
            var issues = assessment?.QualityIssues?.Any() == true 
                ? string.Join(", ", assessment.QualityIssues) 
                : "Content does not meet quality standards";
            return Result<QuestionDto>.Failure($"Question does not meet quality standards: {issues}");
        }

        // Check for spam
        var isSpam = await _contentQualityService.IsSpamAsync(request.Request.Content);
        if (isSpam)
        {
            return Result<QuestionDto>.Failure("Question content appears to be spam");
        }

        // Check for inappropriate content
        var inappropriateContent = await _contentQualityService.DetectInappropriateContentAsync(request.Request.Content);
        if (inappropriateContent.Any())
        {
            var issues = string.Join(", ", inappropriateContent);
            return Result<QuestionDto>.Failure($"Question contains inappropriate content: {issues}");
        }

        // Enhanced duplicate prevention with semantic analysis (excluding current question)
        var similarQuestions = await _duplicatePreventionService.FindSimilarQuestionsAsync(
            request.Request.Title,
            request.Request.Content,
            "General", // TODO: Use actual category in later tasks
            request.Request.Tags,
            request.QuestionId, // Exclude current question from similarity check
            5,
            0.95, // High threshold for updates to prevent accidental duplicates
            cancellationToken);

        if (similarQuestions.IsSuccess && similarQuestions.Data.Any())
        {
            var highestSimilarity = similarQuestions.Data.Max(q => q.SimilarityScore);
            if (highestSimilarity >= 0.95) // Very high similarity threshold for updates
            {
                var mostSimilar = similarQuestions.Data.First(q => q.SimilarityScore == highestSimilarity);
                return Result<QuestionDto>.Failure(
                    $"Updated question would be too similar to existing question: '{mostSimilar.Title}'. " +
                    $"Similarity score: {highestSimilarity:P1}");
            }
        }

        // Update the question
        question.Title = request.Request.Title;
        question.Content = request.Request.Content;
        question.Tags = string.Join(",", request.Request.Tags);
        question.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Get user reputation for response
        var userReputation = await _context.UserReputations
            .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

        var questionDto = new QuestionDto
        {
            Id = question.Id,
            Title = question.Title,
            Content = question.Content,
            Category = "General", // TODO: Map CategoryId to category name in later tasks
            Tags = request.Request.Tags,
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
            UpdatedAt = question.UpdatedAt
        };

        return Result<QuestionDto>.Success(questionDto);
    }
}

public class DeleteQuestionHandler : IRequestHandler<DeleteQuestionCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IReputationService _reputationService;

    public DeleteQuestionHandler(
        IApplicationDbContext context,
        IReputationService reputationService)
    {
        _context = context;
        _reputationService = reputationService;
    }

    public async Task<Result<bool>> Handle(DeleteQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = await _context.Questions
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, cancellationToken);

        if (question == null)
        {
            return Result<bool>.Failure("Question not found");
        }

        // Check if user owns the question or has moderator privileges
        if (question.UserId != request.UserId)
        {
            // TODO: Add moderator role check in later tasks
            return Result<bool>.Failure("You can only delete your own questions");
        }

        // Check if question can be deleted (no accepted answers or high vote count)
        if (question.HasAcceptedAnswer || question.UpvotesCount > 5)
        {
            return Result<bool>.Failure("Questions with accepted answers or high vote counts cannot be deleted");
        }

        // Soft delete the question
        question.IsDeleted = true;
        question.DeletedAt = DateTime.UtcNow;

        // Update reputation for question deletion
        await _reputationService.UpdateUserReputationAsync(
            request.UserId, 
            -5, // Penalty for deleting question
            "QuestionDeleted", 
            request.QuestionId, 
            "General"); // TODO: Use actual category in later tasks

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

public class CloseQuestionHandler : IRequestHandler<CloseQuestionCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public CloseQuestionHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(CloseQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = await _context.Questions
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, cancellationToken);

        if (question == null)
        {
            return Result<bool>.Failure("Question not found");
        }

        // Check if user owns the question or has moderator privileges
        if (question.UserId != request.UserId)
        {
            // TODO: Add moderator role check in later tasks
            return Result<bool>.Failure("You can only close your own questions");
        }

        // Check if question is already closed
        if (question.Status != QuestionStatus.Open)
        {
            return Result<bool>.Failure("Question is already closed");
        }

        // Close the question
        question.Status = QuestionStatus.Closed;
        question.UpdatedAt = DateTime.UtcNow;
        // TODO: Store close reason in a separate field when schema is updated

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}

public class AcceptAnswerHandler : IRequestHandler<AcceptAnswerCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IReputationService _reputationService;

    public AcceptAnswerHandler(
        IApplicationDbContext context,
        IReputationService reputationService)
    {
        _context = context;
        _reputationService = reputationService;
    }

    public async Task<Result<bool>> Handle(AcceptAnswerCommand request, CancellationToken cancellationToken)
    {
        var answer = await _context.Answers
            .Include(a => a.Question)
            .FirstOrDefaultAsync(a => a.Id == request.AnswerId && !a.IsDeleted, cancellationToken);

        if (answer == null)
        {
            return Result<bool>.Failure("Answer not found");
        }

        var question = answer.Question;
        
        // Check if user owns the question
        if (question.UserId != request.UserId)
        {
            return Result<bool>.Failure("Only the question author can accept answers");
        }

        // Check if question is still open
        if (question.Status != QuestionStatus.Open)
        {
            return Result<bool>.Failure("Cannot accept answers on closed questions");
        }

        // Check if answer is already accepted
        if (answer.IsAccepted)
        {
            return Result<bool>.Failure("Answer is already accepted");
        }

        // Unaccept any previously accepted answer
        if (question.AcceptedAnswerId.HasValue)
        {
            var previousAcceptedAnswer = await _context.Answers
                .FirstOrDefaultAsync(a => a.Id == question.AcceptedAnswerId.Value, cancellationToken);
            
            if (previousAcceptedAnswer != null)
            {
                previousAcceptedAnswer.IsAccepted = false;
                previousAcceptedAnswer.AcceptedAt = null;
                
                // Remove reputation bonus from previous answerer
                await _reputationService.UpdateUserReputationAsync(
                    previousAcceptedAnswer.UserId,
                    -25, // Remove acceptance bonus
                    "AnswerUnaccepted",
                    previousAcceptedAnswer.Id,
                    "General"); // TODO: Use actual category in later tasks
            }
        }

        // Accept the new answer
        answer.IsAccepted = true;
        answer.AcceptedAt = DateTime.UtcNow;
        
        // Update question
        question.AcceptedAnswerId = answer.Id;
        question.HasAcceptedAnswer = true;
        question.UpdatedAt = DateTime.UtcNow;

        // Award reputation bonus to answerer
        await _reputationService.UpdateUserReputationAsync(
            answer.UserId,
            25, // Acceptance bonus
            "AnswerAccepted",
            answer.Id,
            "General"); // TODO: Use actual category in later tasks

        // Award reputation to question author for accepting an answer
        await _reputationService.UpdateUserReputationAsync(
            request.UserId,
            2, // Small bonus for accepting an answer
            "AcceptedAnswer",
            answer.Id,
            "General"); // TODO: Use actual category in later tasks

        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}