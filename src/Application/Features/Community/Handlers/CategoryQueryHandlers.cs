using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.DTOs.Responses;
using Application.Features.Community.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.Handlers;

public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, Result<List<CategoryDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetCategoriesHandler> _logger;

    public GetCategoriesHandler(
        IApplicationDbContext context,
        ILogger<GetCategoriesHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<CategoryDto>>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.QuestionCategories.AsQueryable();

            // Apply filters
            if (request.IsActive.HasValue)
            {
                query = query.Where(c => c.IsActive == request.IsActive.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(c => c.Name.ToLower().Contains(searchTerm) || 
                                       c.Description.ToLower().Contains(searchTerm));
            }

            // Apply sorting
            query = request.SortBy.ToLower() switch
            {
                "name" => request.SortDescending ? query.OrderByDescending(c => c.Name) : query.OrderBy(c => c.Name),
                "questioncount" => request.SortDescending ? query.OrderByDescending(c => c.QuestionsCount) : query.OrderBy(c => c.QuestionsCount),
                "createdat" => request.SortDescending ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
                _ => query.OrderBy(c => c.Name)
            };

            var categories = await query
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IconUrl = c.IconUrl,
                    Color = c.Color,
                    QuestionCount = c.QuestionsCount,
                    ExpertCount = _context.Experts.Count(e => e.CategoryId == c.Id),
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return Result<List<CategoryDto>>.Success(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return Result<List<CategoryDto>>.Failure(new[] { "Failed to retrieve categories" });
        }
    }
}

public class GetCategoryDetailHandler : IRequestHandler<GetCategoryDetailQuery, Result<CategoryDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetCategoryDetailHandler> _logger;

    public GetCategoryDetailHandler(
        IApplicationDbContext context,
        ILogger<GetCategoryDetailHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CategoryDto>> Handle(GetCategoryDetailQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var category = await _context.QuestionCategories
                .Where(c => c.Id == request.CategoryId)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IconUrl = c.IconUrl,
                    Color = c.Color,
                    QuestionCount = c.QuestionsCount,
                    ExpertCount = _context.Experts.Count(e => e.CategoryId == c.Id),
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (category == null)
            {
                return Result<CategoryDto>.Failure("Category not found");
            }

            return Result<CategoryDto>.Success(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category {CategoryId}", request.CategoryId);
            return Result<CategoryDto>.Failure(new[] { "Failed to retrieve category" });
        }
    }
}

public class GetCategoryExpertsHandler : IRequestHandler<GetCategoryExpertsQuery, Result<List<ExpertDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetCategoryExpertsHandler> _logger;

    public GetCategoryExpertsHandler(
        IApplicationDbContext context,
        ILogger<GetCategoryExpertsHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<ExpertDto>>> Handle(GetCategoryExpertsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Verify category exists
            var categoryExists = await _context.QuestionCategories
                .AnyAsync(c => c.Id == request.CategoryId && c.IsActive, cancellationToken);

            if (!categoryExists)
            {
                return Result<List<ExpertDto>>.Failure("Category not found or inactive");
            }

            var query = _context.Experts
                .Include(e => e.User)
                .Include(e => e.Category)
                .Where(e => e.CategoryId == request.CategoryId && e.NotificationEnabled);

            // Apply sorting
            query = request.SortBy.ToLower() switch
            {
                "responserate" => request.SortDescending ? query.OrderByDescending(e => e.ResponseRate) : query.OrderBy(e => e.ResponseRate),
                "averagerating" => request.SortDescending ? query.OrderByDescending(e => e.AverageRating) : query.OrderBy(e => e.AverageRating),
                "answercount" => request.SortDescending ? query.OrderByDescending(e => e.AnswerCount) : query.OrderBy(e => e.AnswerCount),
                "acceptedanswercount" => request.SortDescending ? query.OrderByDescending(e => e.AcceptedAnswerCount) : query.OrderBy(e => e.AcceptedAnswerCount),
                "expertiselevel" => request.SortDescending ? query.OrderByDescending(e => e.ExpertiseLevel) : query.OrderBy(e => e.ExpertiseLevel),
                _ => query.OrderByDescending(e => e.ResponseRate)
            };

            var experts = await query
                .Take(request.MaxResults)
                .ToListAsync(cancellationToken);

            // Get user reputations
            var userIds = experts.Select(e => e.UserId).ToList();
            var reputations = await _context.UserReputations
                .Where(ur => userIds.Contains(ur.UserId))
                .ToListAsync(cancellationToken);

            var expertDtos = experts.Select(expert =>
            {
                var reputation = reputations.FirstOrDefault(r => r.UserId == expert.UserId);
                return new ExpertDto
                {
                    UserId = expert.UserId,
                    UserName = expert.User.UserName ?? string.Empty,
                    Category = expert.Category.Name,
                    ExpertiseLevel = expert.ExpertiseLevel,
                    AnswerCount = expert.AnswerCount,
                    AcceptedAnswerCount = expert.AcceptedAnswerCount,
                    AverageRating = expert.AverageRating,
                    ResponseRate = expert.ResponseRate,
                    ReputationScore = reputation?.ReputationScore ?? 0,
                    BadgesEarned = reputation?.BadgesEarned != null 
                        ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(reputation.BadgesEarned) ?? new List<string>()
                        : new List<string>()
                };
            }).ToList();

            return Result<List<ExpertDto>>.Success(expertDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving experts for category {CategoryId}", request.CategoryId);
            return Result<List<ExpertDto>>.Failure(new[] { "Failed to retrieve category experts" });
        }
    }
}

public class GetPopularCategoriesHandler : IRequestHandler<GetPopularCategoriesQuery, Result<List<CategoryDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetPopularCategoriesHandler> _logger;

    public GetPopularCategoriesHandler(
        IApplicationDbContext context,
        ILogger<GetPopularCategoriesHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<CategoryDto>>> Handle(GetPopularCategoriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-request.DaysBack);

            // Get categories with recent activity
            var popularCategories = await _context.QuestionCategories
                .Where(c => c.IsActive)
                .Select(c => new
                {
                    Category = c,
                    RecentQuestions = _context.Questions
                        .Where(q => q.CategoryId == c.Id && q.CreatedAt >= cutoffDate && !q.IsDeleted)
                        .Count()
                })
                .OrderByDescending(x => x.RecentQuestions)
                .ThenByDescending(x => x.Category.QuestionsCount)
                .Take(request.MaxResults)
                .Select(x => new CategoryDto
                {
                    Id = x.Category.Id,
                    Name = x.Category.Name,
                    Description = x.Category.Description,
                    IconUrl = x.Category.IconUrl,
                    Color = x.Category.Color,
                    QuestionCount = x.Category.QuestionsCount,
                    ExpertCount = _context.Experts.Count(e => e.CategoryId == x.Category.Id),
                    IsActive = x.Category.IsActive,
                    CreatedAt = x.Category.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return Result<List<CategoryDto>>.Success(popularCategories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving popular categories");
            return Result<List<CategoryDto>>.Failure(new[] { "Failed to retrieve popular categories" });
        }
    }
}
