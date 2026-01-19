using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Pages.Queries;

public class GetPagesQuery : IRequest<ApiResponseDto<object>>
{
    public string? SearchTerm { get; set; }
    public string? Category { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
    public bool? IsPublished { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetPagesQueryHandler : IRequestHandler<GetPagesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetPagesQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Pages = new object[0], TotalCount = 0 });
    }
}
