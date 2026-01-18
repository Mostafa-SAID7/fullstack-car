using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Queries;

public class GetThemeByIdQuery : IRequest<ApiResponseDto<object>>
{
    public Guid ThemeId { get; set; }
}

public class GetThemeByIdQueryHandler : IRequestHandler<GetThemeByIdQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetThemeByIdQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var theme = new
        {
            Id = request.ThemeId,
            Name = "Sample Theme",
            IsActive = false,
            Colors = new
            {
                Primary = "#007bff",
                Secondary = "#6c757d",
                Success = "#28a745",
                Danger = "#dc3545",
                Warning = "#ffc107",
                Info = "#17a2b8"
            },
            Typography = new
            {
                FontFamily = "Arial, sans-serif",
                FontSize = "14px"
            },
            CreatedAt = DateTime.UtcNow.AddDays(-10),
            UpdatedAt = DateTime.UtcNow.AddDays(-2)
        };
        
        return ApiResponseDto<object>.Success(theme);
    }
}