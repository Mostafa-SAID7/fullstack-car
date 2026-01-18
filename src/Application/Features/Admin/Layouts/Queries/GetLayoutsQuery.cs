using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Layouts.Queries;

public class GetLayoutsQuery : IRequest<ApiResponseDto<object>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetLayoutsQueryHandler : IRequestHandler<GetLayoutsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetLayoutsQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Layouts = new object[0], TotalCount = 0 });
    }
}