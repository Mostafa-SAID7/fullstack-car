using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Guides.Commands;

public class DeleteGuideCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GuideId { get; set; }
    public Guid UserId { get; set; }
}

public class DeleteGuideCommandHandler : IRequestHandler<DeleteGuideCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(DeleteGuideCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(null);
    }
}
