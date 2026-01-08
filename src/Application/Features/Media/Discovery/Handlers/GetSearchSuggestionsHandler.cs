using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Application.Features.Media.Discovery.Queries;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Discovery.Handlers;

public class GetSearchSuggestionsHandler : IRequestHandler<GetSearchSuggestionsQuery, Result<List<SearchSuggestionDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetSearchSuggestionsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<SearchSuggestionDto>>> Handle(GetSearchSuggestionsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Query) || request.Query.Length < 2)
            {
                return Result<List<SearchSuggestionDto>>.Success(new List<SearchSuggestionDto>());
            }

            var suggestions = new List<SearchSuggestionDto>();
            var searchTerm = request.Query.ToLower().Trim();

            // Get title suggestions from videos and podcasts
            var titleSuggestions = await GetTitleSuggestions(searchTerm, request.Limit / 4, cancellationToken);
            suggestions.AddRange(titleSuggestions);

            // Get tag suggestions if enabled
            if (request.IncludeTags)
            {
                var tagSuggestions = await GetTagSuggestions(searchTerm, request.Limit / 4, cancellationToken);
                suggestions.AddRange(tagSuggestions);
            }

            // Get category suggestions if enabled
            if (request.IncludeCategories)
            {
                var categorySuggestions = await GetCategorySuggestions(searchTerm, request.Limit / 4, cancellationToken);
                suggestions.AddRange(categorySuggestions);
            }

            // Get creator suggestions if enabled (placeholder - would need user table join)
            if (request.IncludeCreators)
            {
                var creatorSuggestions = await GetCreatorSuggestions(searchTerm, request.Limit / 4, cancellationToken);
                suggestions.AddRange(creatorSuggestions);
            }

            // Sort by relevance and limit results
            var sortedSuggestions = suggestions
                .OrderByDescending(s => s.Count)
                .ThenByDescending(s => CalculateRelevanceScore(s.Text, searchTerm))
                .Take(request.Limit)
                .ToList();

            return Result<List<SearchSuggestionDto>>.Success(sortedSuggestions);
        }
        catch (Exception ex)
        {
            return Result<List<SearchSuggestionDto>>.Failure(new[] { $"Error retrieving search suggestions: {ex.Message}" });
        }
    }

    private async Task<List<SearchSuggestionDto>> GetTitleSuggestions(string searchTerm, int limit, CancellationToken cancellationToken)
    {
        var suggestions = new List<SearchSuggestionDto>();

        // Get video title suggestions
        var videoTitles = await _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic &&
                       v.Title.ToLower().Contains(searchTerm))
            .GroupBy(v => v.Title.ToLower())
            .Select(g => new { Title = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(limit / 2)
            .ToListAsync(cancellationToken);

        suggestions.AddRange(videoTitles.Select(vt => new SearchSuggestionDto
        {
            Text = vt.Title,
            Type = SearchSuggestionType.Title,
            Count = vt.Count,
            Icon = "🎥"
        }));

        // Get podcast title suggestions
        var podcastTitles = await _context.Podcasts
            .Where(p => !p.IsDeleted && 
                       p.Status == MediaStatus.Published && 
                       p.IsPublic &&
                       p.Title.ToLower().Contains(searchTerm))
            .GroupBy(p => p.Title.ToLower())
            .Select(g => new { Title = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(limit / 2)
            .ToListAsync(cancellationToken);

        suggestions.AddRange(podcastTitles.Select(pt => new SearchSuggestionDto
        {
            Text = pt.Title,
            Type = SearchSuggestionType.Title,
            Count = pt.Count,
            Icon = "🎧"
        }));

        return suggestions;
    }

    private async Task<List<SearchSuggestionDto>> GetTagSuggestions(string searchTerm, int limit, CancellationToken cancellationToken)
    {
        var suggestions = new List<SearchSuggestionDto>();

        // Get all tags from videos and podcasts
        var videoTags = await _context.Videos
            .Where(v => !v.IsDeleted && 
                       v.Status == MediaStatus.Published && 
                       v.IsPublic && 
                       !string.IsNullOrEmpty(v.Tags) &&
                       v.Tags.ToLower().Contains(searchTerm))
            .Select(v => v.Tags!)
            .ToListAsync(cancellationToken);

        var podcastTags = await _context.Podcasts
            .Where(p => !p.IsDeleted && 
                       p.Status == MediaStatus.Published && 
                       p.IsPublic && 
                       !string.IsNullOrEmpty(p.Tags) &&
                       p.Tags.ToLower().Contains(searchTerm))
            .Select(p => p.Tags!)
            .ToListAsync(cancellationToken);

        // Parse and count tags
        var tagCounts = new Dictionary<string, int>();

        foreach (var tagString in videoTags.Concat(podcastTags))
        {
            var tags = ParseTags(tagString);
            foreach (var tag in tags.Where(t => t.Contains(searchTerm)))
            {
                tagCounts[tag] = tagCounts.GetValueOrDefault(tag, 0) + 1;
            }
        }

        suggestions.AddRange(tagCounts
            .OrderByDescending(kvp => kvp.Value)
            .Take(limit)
            .Select(kvp => new SearchSuggestionDto
            {
                Text = kvp.Key,
                Type = SearchSuggestionType.Tag,
                Count = kvp.Value,
                Icon = "🏷️"
            }));

        return suggestions;
    }

    private async Task<List<SearchSuggestionDto>> GetCategorySuggestions(string searchTerm, int limit, CancellationToken cancellationToken)
    {
        var predefinedCategories = new[]
        {
            "technology", "gaming", "music", "education", "entertainment",
            "news", "sports", "lifestyle", "business", "health",
            "science", "travel", "food", "art", "comedy"
        };

        var matchingCategories = predefinedCategories
            .Where(cat => cat.Contains(searchTerm))
            .Take(limit)
            .ToList();

        var suggestions = new List<SearchSuggestionDto>();

        foreach (var category in matchingCategories)
        {
            // Count content in this category
            var videoCount = await _context.Videos
                .Where(v => !v.IsDeleted && 
                           v.Status == MediaStatus.Published && 
                           v.IsPublic &&
                           v.Tags != null && 
                           v.Tags.ToLower().Contains(category))
                .CountAsync(cancellationToken);

            var podcastCount = await _context.Podcasts
                .Where(p => !p.IsDeleted && 
                           p.Status == MediaStatus.Published && 
                           p.IsPublic &&
                           p.Tags != null && 
                           p.Tags.ToLower().Contains(category))
                .CountAsync(cancellationToken);

            if (videoCount + podcastCount > 0)
            {
                suggestions.Add(new SearchSuggestionDto
                {
                    Text = FormatDisplayName(category),
                    Type = SearchSuggestionType.Category,
                    Count = videoCount + podcastCount,
                    Icon = GetCategoryIcon(category)
                });
            }
        }

        return suggestions;
    }

    private async Task<List<SearchSuggestionDto>> GetCreatorSuggestions(string searchTerm, int limit, CancellationToken cancellationToken)
    {
        // This would require joining with the Users table to get creator names
        // For now, return empty list as a placeholder
        await Task.CompletedTask;
        return new List<SearchSuggestionDto>();
    }

    private List<string> ParseTags(string tagString)
    {
        if (string.IsNullOrEmpty(tagString))
            return new List<string>();

        return tagString
            .Split(new[] { ',', ';', '|' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(tag => tag.Trim().ToLower())
            .Where(tag => !string.IsNullOrEmpty(tag))
            .Distinct()
            .ToList();
    }

    private double CalculateRelevanceScore(string suggestion, string searchTerm)
    {
        if (suggestion.Equals(searchTerm, StringComparison.OrdinalIgnoreCase))
            return 10.0;

        if (suggestion.StartsWith(searchTerm, StringComparison.OrdinalIgnoreCase))
            return 5.0;

        if (suggestion.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            return 2.0;

        return 1.0;
    }

    private string FormatDisplayName(string categoryName)
    {
        return string.Join(" ", categoryName.Split('-', '_')
            .Select(word => char.ToUpper(word[0]) + word.Substring(1).ToLower()));
    }

    private string? GetCategoryIcon(string categoryName)
    {
        return categoryName.ToLower() switch
        {
            "technology" => "🔧",
            "gaming" => "🎮",
            "music" => "🎵",
            "education" => "📚",
            "entertainment" => "🎬",
            "news" => "📰",
            "sports" => "⚽",
            "lifestyle" => "🌟",
            "business" => "💼",
            "health" => "🏥",
            "science" => "🔬",
            "travel" => "✈️",
            "food" => "🍽️",
            "art" => "🎨",
            "comedy" => "😂",
            _ => "📂"
        };
    }
}