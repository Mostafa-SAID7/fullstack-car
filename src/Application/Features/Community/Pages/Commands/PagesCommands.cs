using Application.Common.DTOs;
using Application.Features.Community.Pages.DTOs;
using MediatR;

namespace Application.Features.Community.Pages.Commands;

public class UpdatePageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public UpdatePageRequest Request { get; set; } = new();
    public Guid UserId { get; set; }
}

public class DeletePageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public Guid UserId { get; set; }
}

public class PublishPageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public Guid UserId { get; set; }
}

public class UnpublishPageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public Guid UserId { get; set; }
}