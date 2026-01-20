using Application.Common.Models;
using Application.Features.Common.Votes.DTOs.Requests;
using MediatR;

namespace Application.Features.Common.Votes.Commands;

public class ChangeVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public ChangeVoteRequest Request { get; set; } = null!;
}