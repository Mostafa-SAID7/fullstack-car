using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;

namespace Application.Features.Common.Votes.Commands;

public class RemoveVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
}