using Application.Common.Models;
using Application.Features.Common.Votes.DTOs.Requests;
using MediatR;

namespace Application.Features.Common.Votes.Commands;

public class CreateVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public CreateVoteRequest Request { get; set; } = null!;
}