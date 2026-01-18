using Application.Common.DTOs;
using Application.Features.Community.Pages.DTOs;
using MediatR;

namespace Application.Features.Community.Pages.Commands;

public class CreatePageCommand : IRequest<ApiResponseDto<object>>
{
    public CreatePageRequest Request { get; set; } = new();
    public Guid AuthorId { get; set; }
}

public class CreatePageCommandHandler : IRequestHandler<CreatePageCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreatePageCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Title = request.Request.Title });
    }
}