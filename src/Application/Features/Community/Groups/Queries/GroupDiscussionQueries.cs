using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Groups.Queries;

public class GetGroupDiscussionQuery : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
    public Guid? UserId { get; set; }
}

public class GetDiscussionRepliesQuery : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public Guid DiscussionId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
}

public class GetGroupDiscussionCategoriesQuery : IRequest<ApiResponseDto<List<object>>>
{
    public Guid GroupId { get; set; }
}

public class SearchGroupDiscussionsQuery : IRequest<ApiResponseDto<object>>
{
    public Guid GroupId { get; set; }
    public string SearchTerm { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Category { get; set; }
}
