using Application.Common.Models;
using Application.Features.Community.DTOs.Requests;
using Domain.Enums.Common;
using Domain.Enums.Community;
using VoteType = Domain.Enums.Community.VoteType;
using MediatR;

namespace Application.Features.Community.Commands;

public class CreateVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public CreateVoteRequest Request { get; set; } = null!;
}

public class RemoveVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
}

public class ChangeVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public ChangeVoteRequest Request { get; set; } = null!;
}
