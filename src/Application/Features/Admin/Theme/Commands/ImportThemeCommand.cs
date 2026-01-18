using Application.Common.DTOs;
using Application.Features.Admin.Theme.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Commands;

public class ImportThemeCommand : IRequest<ApiResponseDto<object>>
{
    public ImportThemeRequest Request { get; set; } = new();
    public Guid ImportedBy { get; set; }
}

public class ImportThemeCommandHandler : IRequestHandler<ImportThemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(ImportThemeCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var importedTheme = new
        {
            Id = Guid.NewGuid(),
            Name = "Imported Theme",
            IsActive = false,
            ImportedAt = DateTime.UtcNow,
            ImportedBy = request.ImportedBy
        };
        
        return ApiResponseDto<object>.Success(importedTheme);
    }
}