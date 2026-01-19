using Application.Common.DTOs;
using Application.Features.Community.Maps.DTOs;
using MediatR;

namespace Application.Features.Community.Maps.Commands;

public class CreateLocationCommand : IRequest<ApiResponseDto<object>>
{
    public CreateLocationRequest Request { get; set; } = new();
    public Guid UserId { get; set; }
}

public class UpdateLocationCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LocationId { get; set; }
    public UpdateLocationRequest Request { get; set; } = new();
    public Guid UserId { get; set; }
}

public class DeleteLocationCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LocationId { get; set; }
    public Guid UserId { get; set; }
}

public class CheckInCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LocationId { get; set; }
    public Guid UserId { get; set; }
    public CheckInRequest Request { get; set; } = new();
}

public class CreateLocationReviewCommand : IRequest<ApiResponseDto<object>>
{
    public Guid LocationId { get; set; }
    public Guid UserId { get; set; }
    public CreateLocationReviewRequest Request { get; set; } = new();
}
