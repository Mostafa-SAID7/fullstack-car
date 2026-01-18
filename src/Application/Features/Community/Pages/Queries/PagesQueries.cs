using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Pages.Queries;

public class GetMenuPagesQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetPageBySlugQuery : IRequest<ApiResponseDto<object>>
{
    public string Slug { get; set; } = string.Empty;
}

public class GetPageByIdQuery : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
}

public class GetPageCategoriesQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetUserPagesQuery : IRequest<ApiResponseDto<object>>
{
    public Guid AuthorId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetPageStatsQuery : IRequest<ApiResponseDto<object>>
{
}