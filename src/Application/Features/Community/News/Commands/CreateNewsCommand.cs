using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.News.Commands;

public class CreateNewsCommand : IRequest<ApiResponseDto<object>>
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class CreateNewsCommandHandler : IRequestHandler<CreateNewsCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateNewsCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Title = request.Title });
    }
}