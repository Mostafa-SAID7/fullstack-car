using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Commands;

public class ExportThemeCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ThemeId { get; set; }
    public string Format { get; set; } = "json"; // json, css, scss
}

public class ExportThemeCommandHandler : IRequestHandler<ExportThemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(ExportThemeCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var exportResult = new
        {
            ThemeId = request.ThemeId,
            Format = request.Format,
            FileName = $"theme-export-{DateTime.UtcNow:yyyyMMdd}.{request.Format}",
            FileContent = "/* Theme export content */",
            ExportedAt = DateTime.UtcNow
        };
        
        return ApiResponseDto<object>.Success(exportResult);
    }
}