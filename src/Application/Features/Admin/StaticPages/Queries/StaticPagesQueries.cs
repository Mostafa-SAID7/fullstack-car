using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.StaticPages.Queries;

public class GetStaticPagesQuery : IRequest<ApiResponseDto<object>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public bool? IsPublished { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
}

public class GetStaticPagesQueryHandler : IRequestHandler<GetStaticPagesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetStaticPagesQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Pages = new object[0], TotalCount = 0 });
    }
}