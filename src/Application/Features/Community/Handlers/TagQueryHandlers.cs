using Application.Common.Interfaces.Data;
using Application.Common.Models;
using Application.Features.Community.DTOs.Responses;
using Application.Features.Community.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.Handlers;

public class GetTagsHandler : IRequestHandler<GetTagsQuery, Result<List<TagDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetTagsHandler> _logger;

    public GetTagsHandler(
        IApplicationDbContext context,
        ILogger<GetTagsHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<TagDto>>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _contextTags.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(t => t.Name.ToLower().Contains(searchTerm) || 
                                       (t.Description != null && t.Description.ToLower().Contains(searchTerm)));
            }

            if (request.CategoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == request.CategoryId.Value);
            }

            if (request.MinUsageCount.HasValue)
            {
                query = query.Where(t => t.UsageCount >= request.MinUsageCount.Value);
            }

            // Apply sorting
            query = request.SortBy.ToLower() switch
            {
                "name" => request.SortDescending ? query.OrderByDescending(t => t.Name) : query.OrderBy(t => t.Name),
                "usagecount" => request.SortDescending ? query.OrderByDescending(t => t.UsageCount) : query.OrderBy(t => t.UsageCount),
                "createdat" => request.SortDescending ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt),
                _ => query.OrderBy(t => t.Name)
            };

            var tags = await query
                .Include(t => t.Category)
                .Take(request.MaxResults)
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    UsageCount = t.UsageCount,
                    Category = t.Category != null ? t.Category.Name : null,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return Result<List<TagDto>>.Success(tags);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tags");
            return Result<List<TagDto>>.Failure(new[] { "Failed to retrieve tags" });
        }
    }
}

public class GetPopularTagsHandler : IRequestHandler<GetPopularTagsQuery, Result<List<PopularTagDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetPopularTagsHandler> _logger;

    public GetPopularTagsHandler(
        IApplicationDbContext context,
        ILogger<GetPopularTagsHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<PopularTagDto>>> Handle(GetPopularTagsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-request.DaysBack);

            var query = _contextTags.AsQueryable();

            if (request.CategoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == request.CategoryId.Value);
            }

            // Calculate trending score based on recent usage vs total usage
            var popularTags = await query
                .Select(t => new
                {
                    Tag = t,
                    RecentUsage = _context.QuestionTags
                        .Join(_context.Questions,
                            qt => qt.QuestionId,
                            q => q.Id,
                            (qt, q) => new { qt.TagId, q.CreatedAt, q.IsDeleted })
                        .Where(x => x.TagId == t.Id && x.CreatedAt >= cutoffDate && !x.IsDeleted)
                        .Count()
                })
                .Where(x => x.Tag.UsageCount > 0)
                .OrderByDescending(x => x.RecentUsage)
                .ThenByDescending(x => x.Tag.UsageCount)
                .Take(request.MaxResults)
                .Select(x => new PopularTagDto
                {
                    Name = x.Tag.Name,
                    UsageCount = x.Tag.UsageCount,
                    TrendingScore = x.RecentUsage * 10 + x.Tag.UsageCount // Simple trending algorithm
                })
                .ToListAsync(cancellationToken);

            return Result<List<PopularTagDto>>.Success(popularTags);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving popular tags");
            return Result<List<PopularTagDto>>.Failure(new[] { "Failed to retrieve popular tags" });
        }
    }
}

public class GetTagDetailHandler : IRequestHandler<GetTagDetailQuery, Result<TagDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetTagDetailHandler> _logger;

    public GetTagDetailHandler(
        IApplicationDbContext context,
        ILogger<GetTagDetailHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<TagDto>> Handle(GetTagDetailQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var tag = await _contextTags
                .Include(t => t.Category)
                .Where(t => t.Id == request.TagId)
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    UsageCount = t.UsageCount,
                    Category = t.Category != null ? t.Category.Name : null,
                    CreatedAt = t.CreatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (tag == null)
            {
                return Result<TagDto>.Failure("Tag not found");
            }

            return Result<TagDto>.Success(tag);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tag {TagId}", request.TagId);
            return Result<TagDto>.Failure(new[] { "Failed to retrieve tag" });
        }
    }
}

public class SearchTagsHandler : IRequestHandler<SearchTagsQuery, Result<List<TagDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<SearchTagsHandler> _logger;

    public SearchTagsHandler(
        IApplicationDbContext context,
        ILogger<SearchTagsHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<TagDto>>> Handle(SearchTagsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                return Result<List<TagDto>>.Success(new List<TagDto>());
            }

            var searchTerm = request.SearchTerm.ToLower();
            var query = _contextTags.AsQueryable();

            if (request.CategoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == request.CategoryId.Value);
            }

            var tags = await query
                .Include(t => t.Category)
                .Where(t => t.Name.ToLower().Contains(searchTerm) || 
                           (t.Description != null && t.Description.ToLower().Contains(searchTerm)))
                .OrderByDescending(t => t.UsageCount)
                .ThenBy(t => t.Name)
                .Take(request.MaxResults)
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    UsageCount = t.UsageCount,
                    Category = t.Category != null ? t.Category.Name : null,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return Result<List<TagDto>>.Success(tags);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching tags with term {SearchTerm}", request.SearchTerm);
            return Result<List<TagDto>>.Failure(new[] { "Failed to search tags" });
        }
    }
}
