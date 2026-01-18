using Application.Common.DTOs;
using Application.Features.Admin.Theme.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Commands;

public class DuplicateThemeCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ThemeId { get; set; }
    public DuplicateThemeRequest Request { get; set; } = new();
    public Guid CreatedBy { get; set; }
}

public class DuplicateThemeCommandHandler : IRequestHandler<DuplicateThemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(DuplicateThemeCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var duplicatedTheme = new
        {
            Id = Guid.NewGuid(),
            Name = request.Request.NewName,
            SourceThemeId = request.ThemeId,
            IsActive = false,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = request.CreatedBy
        };
        
        return ApiResponseDto<object>.Success(duplicatedTheme);
    }
}