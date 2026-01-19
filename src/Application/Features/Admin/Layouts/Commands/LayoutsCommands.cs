using Application.Common.DTOs;
using Application.Features.Admin.Layouts.DTOs;
using MediatR;

namespace Application.Features.Admin.Layouts.Commands;

public class CreateLayoutCommand : IRequest<ApiResponseDto<object>>
{
    public CreateLayoutRequest Request { get; set; } = null!;
    public Guid CreatedBy { get; set; }
}

public class UpdateLayoutCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LayoutId { get; set; }
    public UpdateLayoutRequest Request { get; set; } = null!;
    public Guid UpdatedBy { get; set; }
}

public class DeleteLayoutCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LayoutId { get; set; }
}

public class ActivateLayoutCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LayoutId { get; set; }
    public ActivateLayoutRequest Request { get; set; } = new();
    public Guid ActivatedBy { get; set; }
}

public class DuplicateLayoutCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LayoutId { get; set; }
    public DuplicateLayoutRequest Request { get; set; } = new();
    public Guid CreatedBy { get; set; }
}

public class CreateCustomComponentCommand : IRequest<ApiResponseDto<object>>
{
    public CreateCustomComponentRequest Request { get; set; } = null!;
    public Guid CreatedBy { get; set; }
}

public class UpdateCustomComponentCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ComponentId { get; set; }
    public UpdateCustomComponentRequest Request { get; set; } = null!;
    public Guid UpdatedBy { get; set; }
}

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
public class CreateLayoutCommandHandler : IRequestHandler<CreateLayoutCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateLayoutCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Message = "Layout created", CreatedBy = request.CreatedBy });
    }
}

public class UpdateLayoutCommandHandler : IRequestHandler<UpdateLayoutCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateLayoutCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Layout updated", UpdatedBy = request.UpdatedBy });
    }
}

public class DeleteLayoutCommandHandler : IRequestHandler<DeleteLayoutCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(DeleteLayoutCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Layout deleted" });
    }
}

public class ActivateLayoutCommandHandler : IRequestHandler<ActivateLayoutCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(ActivateLayoutCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Layout activated", ActivatedBy = request.ActivatedBy });
    }
}

public class DuplicateLayoutCommandHandler : IRequestHandler<DuplicateLayoutCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(DuplicateLayoutCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Message = "Layout duplicated", CreatedBy = request.CreatedBy });
    }
}

public class CreateCustomComponentCommandHandler : IRequestHandler<CreateCustomComponentCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateCustomComponentCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Message = "Custom component created", CreatedBy = request.CreatedBy });
    }
}

public class UpdateCustomComponentCommandHandler : IRequestHandler<UpdateCustomComponentCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateCustomComponentCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Custom component updated", UpdatedBy = request.UpdatedBy });
    }
}

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