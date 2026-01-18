using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Maps.Commands;

public class CreateMapCommand : IRequest<ApiResponseDto<object>>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class CreateMapCommandHandler : IRequestHandler<CreateMapCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateMapCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Name = request.Name });
    }
}