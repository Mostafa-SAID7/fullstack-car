using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Commands;

public class CreateThemeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, string> Colors { get; set; } = new();
}

public class UpdateThemeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, string> Colors { get; set; } = new();
}

public class DuplicateThemeRequest
{
    public string NewName { get; set; } = string.Empty;
}

public class ImportThemeRequest
{
    public string ThemeData { get; set; } = string.Empty;
}

public class CreateThemeCommand : IRequest<ApiResponseDto<object>>
{
    public CreateThemeRequest Request { get; set; } = new();
    public Guid CreatedBy { get; set; }
}

public class CreateThemeCommandHandler : IRequestHandler<CreateThemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateThemeCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Name = request.Request.Name });
    }
}