using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Application.Features.Media.Discovery.Queries;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Discovery.Handlers;

public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, Result<List<CategoryDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetCategoriesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<CategoryDto>>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Get all unique tags from videos and podcasts as categories
            var videoTags = await _context.Videos
                .Where(v => !v.IsDeleted && 
                           v.Status == MediaStatus.Published && 
                           v.IsPublic && 
                           !string.IsNullOrEmpty(v.Tags))
                .Select(v => v.Tags!)
                .ToListAsync(cancellationToken);

            var podcastTags = await _context.Podcasts
                .Where(p => !p.IsDeleted && 
                           p.Status == MediaStatus.Published && 
                           p.IsPublic && 
                           !string.IsNullOrEmpty(p.Tags))
                .Select(p => p.Tags!)
                .ToListAsync(cancellationToken);

            // Parse tags and count occurrences
            var categoryStats = new Dictionary<string, (int videoCount, int podcastCount)>();

            // Process video tags
            foreach (var tagString in videoTags)
            {
                var tags = ParseTags(tagString);
                foreach (var tag in tags)
                {
                    if (!categoryStats.ContainsKey(tag))
                    {
                        categoryStats[tag] = (0, 0);
                    }
                    categoryStats[tag] = (categoryStats[tag].videoCount + 1, categoryStats[tag].podcastCount);
                }
            }

            // Process podcast tags
            foreach (var tagString in podcastTags)
            {
                var tags = ParseTags(tagString);
                foreach (var tag in tags)
                {
                    if (!categoryStats.ContainsKey(tag))
                    {
                        categoryStats[tag] = (0, 0);
                    }
                    categoryStats[tag] = (categoryStats[tag].videoCount, categoryStats[tag].podcastCount + 1);
                }
            }

            // Create category DTOs
            var categories = categoryStats
                .Where(kvp => !request.OnlyWithContent || (kvp.Value.videoCount + kvp.Value.podcastCount) > 0)
                .Select(kvp => new CategoryDto
                {
                    Name = kvp.Key.ToLower(),
                    DisplayName = FormatDisplayName(kvp.Key),
                    Description = GetCategoryDescription(kvp.Key),
                    Icon = GetCategoryIcon(kvp.Key),
                    VideoCount = request.IncludeContentCount ? kvp.Value.videoCount : 0,
                    PodcastCount = request.IncludeContentCount ? kvp.Value.podcastCount : 0,
                    IsActive = true
                })
                .OrderByDescending(c => c.TotalCount)
                .ThenBy(c => c.DisplayName)
                .ToList();

            // Add some predefined popular categories if they don't exist
            var predefinedCategories = GetPredefinedCategories();
            foreach (var predefined in predefinedCategories)
            {
                if (!categories.Any(c => c.Name.Equals(predefined.Name, StringComparison.OrdinalIgnoreCase)))
                {
                    if (!request.OnlyWithContent)
                    {
                        categories.Add(predefined);
                    }
                }
            }

            return Result<List<CategoryDto>>.Success(categories);
        }
        catch (Exception ex)
        {
            return Result<List<CategoryDto>>.Failure(new[] { $"Error retrieving categories: {ex.Message}" });
        }
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

    private string FormatDisplayName(string categoryName)
    {
        // Convert category name to proper display format
        return string.Join(" ", categoryName.Split('-', '_')
            .Select(word => char.ToUpper(word[0]) + word.Substring(1).ToLower()));
    }

    private string? GetCategoryDescription(string categoryName)
    {
        // Provide descriptions for common categories
        return categoryName.ToLower() switch
        {
            "technology" => "Latest tech news, reviews, and tutorials",
            "gaming" => "Gaming content, reviews, and gameplay",
            "music" => "Music videos, podcasts, and audio content",
            "education" => "Educational content and tutorials",
            "entertainment" => "Entertainment videos and shows",
            "news" => "News and current affairs",
            "sports" => "Sports content and highlights",
            "lifestyle" => "Lifestyle and personal development",
            "business" => "Business and entrepreneurship content",
            "health" => "Health and wellness content",
            "science" => "Science and research content",
            "travel" => "Travel guides and experiences",
            "food" => "Cooking and food-related content",
            "art" => "Art and creative content",
            "comedy" => "Comedy and humor content",
            _ => null
        };
    }

    private string? GetCategoryIcon(string categoryName)
    {
        // Provide icons for common categories
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
            _ => null
        };
    }

    private List<CategoryDto> GetPredefinedCategories()
    {
        return new List<CategoryDto>
        {
            new() { Name = "technology", DisplayName = "Technology", Description = "Latest tech news, reviews, and tutorials", Icon = "🔧" },
            new() { Name = "gaming", DisplayName = "Gaming", Description = "Gaming content, reviews, and gameplay", Icon = "🎮" },
            new() { Name = "music", DisplayName = "Music", Description = "Music videos, podcasts, and audio content", Icon = "🎵" },
            new() { Name = "education", DisplayName = "Education", Description = "Educational content and tutorials", Icon = "📚" },
            new() { Name = "entertainment", DisplayName = "Entertainment", Description = "Entertainment videos and shows", Icon = "🎬" },
            new() { Name = "news", DisplayName = "News", Description = "News and current affairs", Icon = "📰" },
            new() { Name = "sports", DisplayName = "Sports", Description = "Sports content and highlights", Icon = "⚽" },
            new() { Name = "lifestyle", DisplayName = "Lifestyle", Description = "Lifestyle and personal development", Icon = "🌟" },
            new() { Name = "business", DisplayName = "Business", Description = "Business and entrepreneurship content", Icon = "💼" },
            new() { Name = "health", DisplayName = "Health", Description = "Health and wellness content", Icon = "🏥" },
            new() { Name = "science", DisplayName = "Science", Description = "Science and research content", Icon = "🔬" },
            new() { Name = "travel", DisplayName = "Travel", Description = "Travel guides and experiences", Icon = "✈️" },
            new() { Name = "food", DisplayName = "Food", Description = "Cooking and food-related content", Icon = "🍽️" },
            new() { Name = "art", DisplayName = "Art", Description = "Art and creative content", Icon = "🎨" },
            new() { Name = "comedy", DisplayName = "Comedy", Description = "Comedy and humor content", Icon = "😂" }
        };
    }
}