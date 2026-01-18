using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Queries;

public class GetActiveThemeQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetActiveThemeQueryHandler : IRequestHandler<GetActiveThemeQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetActiveThemeQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var activeTheme = new
        {
            Id = Guid.NewGuid(),
            Name = "Default Theme",
            IsActive = true,
            Colors = new
            {
                Primary = "#007bff",
                Secondary = "#6c757d",
                Success = "#28a745",
                Danger = "#dc3545"
            },
            CreatedAt = DateTime.UtcNow.AddDays(-30)
        };
        
        return ApiResponseDto<object>.Success(activeTheme);
    }
}