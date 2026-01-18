using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Queries;

public class GetThemePreviewQuery : IRequest<ApiResponseDto<object>>
{
    public Guid ThemeId { get; set; }
}

public class GetThemePreviewQueryHandler : IRequestHandler<GetThemePreviewQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetThemePreviewQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var preview = new
        {
            ThemeId = request.ThemeId,
            PreviewUrl = $"/theme-preview/{request.ThemeId}",
            CssContent = "/* Theme preview CSS */",
            Components = new[]
            {
                new { Name = "Button", PreviewHtml = "<button class='btn-primary'>Sample Button</button>" },
                new { Name = "Card", PreviewHtml = "<div class='card'>Sample Card</div>" }
            }
        };
        
        return ApiResponseDto<object>.Success(preview);
    }
}