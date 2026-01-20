using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;

namespace Application.Features.Common.Likes.Commands;

public class LikeCommand : IRequest<Result<bool>>
{
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
    public Guid UserId { get; set; }
}