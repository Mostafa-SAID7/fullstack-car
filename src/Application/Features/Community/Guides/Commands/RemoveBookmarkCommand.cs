using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Guides.Commands;

public class RemoveBookmarkCommand : IRequest<ApiResponseDto<object>>
{
    public Guid GuideId { get; set; }
    public Guid UserId { get; set; }
}

public class RemoveBookmarkCommandHandler : IRequestHandler<RemoveBookmarkCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(RemoveBookmarkCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(null);
    }
}