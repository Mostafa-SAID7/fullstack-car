using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Commands;

public class ActivateThemeCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ThemeId { get; set; }
    public Guid ActivatedBy { get; set; }
}

public class ActivateThemeCommandHandler : IRequestHandler<ActivateThemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(ActivateThemeCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var result = new
        {
            ThemeId = request.ThemeId,
            IsActive = true,
            ActivatedAt = DateTime.UtcNow,
            ActivatedBy = request.ActivatedBy
        };
        
        return ApiResponseDto<object>.Success(result);
    }
}