using Application.Common.DTOs;
using Application.Features.Admin.Theme.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Commands;

public class UpdateThemeCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ThemeId { get; set; }
    public UpdateThemeRequest Request { get; set; } = new();
    public Guid UpdatedBy { get; set; }
}

public class UpdateThemeCommandHandler : IRequestHandler<UpdateThemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateThemeCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var updatedTheme = new
        {
            Id = request.ThemeId,
            Name = request.Request.Name,
            Colors = request.Request.Colors,
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = request.UpdatedBy
        };
        
        return ApiResponseDto<object>.Success(updatedTheme);
    }
}