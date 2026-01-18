using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Guides.Queries;

public class GetUserGuidesQuery : IRequest<ApiResponseDto<object>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUserGuidesQueryHandler : IRequestHandler<GetUserGuidesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetUserGuidesQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Guides = new object[0], TotalCount = 0 });
    }
}