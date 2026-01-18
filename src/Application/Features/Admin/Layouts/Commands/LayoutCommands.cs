using Application.Common.DTOs;
using Application.Features.Admin.Layouts.DTOs;
using MediatR;

namespace Application.Features.Admin.Layouts.Commands;

public class CreateLayoutFromTemplateCommand : IRequest<ApiResponseDto<object>>
{
    public CreateLayoutFromTemplateRequest Request { get; set; } = null!;
    public Guid CreatedBy { get; set; }
}

public class PreviewLayoutCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LayoutId { get; set; }
    public PreviewLayoutRequest Request { get; set; } = null!;
}

public class UpdateResponsiveBreakpointsCommand : IRequest<ApiResponseDto<object>>
{
    public UpdateResponsiveBreakpointsRequest Request { get; set; } = null!;
    public Guid UpdatedBy { get; set; }
}

// Handlers
public class CreateLayoutFromTemplateCommandHandler : IRequestHandler<CreateLayoutFromTemplateCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateLayoutFromTemplateCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Message = "Layout created from template", CreatedBy = request.CreatedBy });
    }
}

public class PreviewLayoutCommandHandler : IRequestHandler<PreviewLayoutCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(PreviewLayoutCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { PreviewUrl = "https://example.com/preview", Message = "Layout preview generated" });
    }
}

public class UpdateResponsiveBreakpointsCommandHandler : IRequestHandler<UpdateResponsiveBreakpointsCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateResponsiveBreakpointsCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Responsive breakpoints updated", UpdatedBy = request.UpdatedBy });
    }
}