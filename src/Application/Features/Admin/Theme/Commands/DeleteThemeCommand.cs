using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Commands;

public class DeleteThemeCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ThemeId { get; set; }
    public Guid DeletedBy { get; set; }
}

public class DeleteThemeCommandHandler : IRequestHandler<DeleteThemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(DeleteThemeCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(null);
    }
}