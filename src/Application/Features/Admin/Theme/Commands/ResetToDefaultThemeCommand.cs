using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Commands;

public class ResetToDefaultThemeCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ResetBy { get; set; }
}

public class ResetToDefaultThemeCommandHandler : IRequestHandler<ResetToDefaultThemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(ResetToDefaultThemeCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var result = new
        {
            DefaultThemeId = Guid.NewGuid(),
            IsActive = true,
            ResetAt = DateTime.UtcNow,
            ResetBy = request.ResetBy
        };
        
        return ApiResponseDto<object>.Success(result);
    }
}