using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Queries;

public class GetThemesQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetThemesQueryHandler : IRequestHandler<GetThemesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetThemesQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Themes = new object[0] });
    }
}