using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.News.Queries;

public class GetNewsQuery : IRequest<ApiResponseDto<object>>
{
    public string? Category { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetNewsQueryHandler : IRequestHandler<GetNewsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetNewsQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { News = new object[0], TotalCount = 0 });
    }
}
