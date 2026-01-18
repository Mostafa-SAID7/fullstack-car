using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.News.Queries;

public class GetArticlesQuery : IRequest<ApiResponseDto<List<object>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Category { get; set; }
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; } = "PublishedAt";
    public bool SortDescending { get; set; } = true;
    public bool? IsFeatured { get; set; }
}

public class GetTrendingArticlesQuery : IRequest<ApiResponseDto<List<object>>>
{
    public int PageSize { get; set; } = 10;
    public int Days { get; set; } = 7;
}

public class GetFeaturedArticlesQuery : IRequest<ApiResponseDto<List<object>>>
{
    public int PageSize { get; set; } = 5;
}

public class GetArticleByIdQuery : IRequest<ApiResponseDto<object>>
{
    public Guid ArticleId { get; set; }
}

public class GetNewsCategoriesQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetUserArticlesQuery : IRequest<ApiResponseDto<List<object>>>
{
    public Guid AuthorId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetNewsStatsQuery : IRequest<ApiResponseDto<object>>
{
}