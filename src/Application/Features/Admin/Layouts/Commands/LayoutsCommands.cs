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
    public Guid ActivatedBy { get; set; }
}

public class DuplicateLayoutCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LayoutId { get; set; }
    public string NewName { get; set; } = string.Empty;
    public Guid DuplicatedBy { get; set; }
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
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Message = "Layout duplicated", DuplicatedBy = request.DuplicatedBy });
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