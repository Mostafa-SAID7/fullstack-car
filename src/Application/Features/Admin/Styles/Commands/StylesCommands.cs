using Application.Common.DTOs;
using Application.Features.Admin.Styles.DTOs;
using MediatR;

namespace Application.Features.Admin.Styles.Commands;

public class ApplyPredefinedStyleCommand : IRequest<ApiResponseDto<object>>
{
    public ApplyPredefinedStyleRequest Request { get; set; } = null!;
    public Guid AppliedBy { get; set; }
}

public class UpdateCssVariablesCommand : IRequest<ApiResponseDto<object>>
{
    public UpdateCssVariablesRequest Request { get; set; } = null!;
    public Guid UpdatedBy { get; set; }
}

public class CreateCustomStyleCommand : IRequest<ApiResponseDto<object>>
{
    public CreateCustomStyleRequest Request { get; set; } = null!;
    public Guid CreatedBy { get; set; }
}

public class UpdateCustomStyleCommand : IRequest<ApiResponseDto<object>>
{
    public Guid StyleId { get; set; }
    public UpdateCustomStyleRequest Request { get; set; } = null!;
    public Guid UpdatedBy { get; set; }
}

public class DeleteCustomStyleCommand : IRequest<ApiResponseDto<object>>
{
    public Guid StyleId { get; set; }
}

public class CompileStylesCommand : IRequest<ApiResponseDto<object>>
{
    public Guid CompiledBy { get; set; }
}

public class UploadCustomFontCommand : IRequest<ApiResponseDto<object>>
{
    public UploadCustomFontRequest Request { get; set; } = null!;
    public Guid UploadedBy { get; set; }
}

public class CreateColorSchemeCommand : IRequest<ApiResponseDto<object>>
{
    public CreateColorSchemeRequest Request { get; set; } = null!;
    public Guid CreatedBy { get; set; }
}

public class UpdateColorSchemeCommand : IRequest<ApiResponseDto<object>>
{
    public Guid SchemeId { get; set; }
    public UpdateColorSchemeRequest Request { get; set; } = null!;
    public Guid UpdatedBy { get; set; }
}

public class PreviewStylesCommand : IRequest<ApiResponseDto<object>>
{
    public PreviewStylesRequest Request { get; set; } = null!;
}

public class ResetStylesToDefaultCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ResetBy { get; set; }
}

// Handlers
public class ApplyPredefinedStyleCommandHandler : IRequestHandler<ApplyPredefinedStyleCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(ApplyPredefinedStyleCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Predefined style applied", AppliedBy = request.AppliedBy });
    }
}

public class UpdateCssVariablesCommandHandler : IRequestHandler<UpdateCssVariablesCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateCssVariablesCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "CSS variables updated", UpdatedBy = request.UpdatedBy });
    }
}

public class CreateCustomStyleCommandHandler : IRequestHandler<CreateCustomStyleCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateCustomStyleCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Message = "Custom style created", CreatedBy = request.CreatedBy });
    }
}

public class UpdateCustomStyleCommandHandler : IRequestHandler<UpdateCustomStyleCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateCustomStyleCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Custom style updated", UpdatedBy = request.UpdatedBy });
    }
}

public class DeleteCustomStyleCommandHandler : IRequestHandler<DeleteCustomStyleCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(DeleteCustomStyleCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Custom style deleted" });
    }
}

public class CompileStylesCommandHandler : IRequestHandler<CompileStylesCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CompileStylesCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Styles compiled", CompiledBy = request.CompiledBy });
    }
}

public class UploadCustomFontCommandHandler : IRequestHandler<UploadCustomFontCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UploadCustomFontCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Message = "Custom font uploaded", UploadedBy = request.UploadedBy });
    }
}

public class CreateColorSchemeCommandHandler : IRequestHandler<CreateColorSchemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateColorSchemeCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Message = "Color scheme created", CreatedBy = request.CreatedBy });
    }
}

public class UpdateColorSchemeCommandHandler : IRequestHandler<UpdateColorSchemeCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateColorSchemeCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Color scheme updated", UpdatedBy = request.UpdatedBy });
    }
}

public class PreviewStylesCommandHandler : IRequestHandler<PreviewStylesCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(PreviewStylesCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { PreviewUrl = "https://example.com/preview", Message = "Style preview generated" });
    }
}

public class ResetStylesToDefaultCommandHandler : IRequestHandler<ResetStylesToDefaultCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(ResetStylesToDefaultCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Styles reset to default", ResetBy = request.ResetBy });
    }
}