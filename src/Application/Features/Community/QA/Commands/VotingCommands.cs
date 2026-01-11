using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Requests;
using MediatR;

namespace Application.Features.Community.QA.Commands;

public class CreateVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public CreateVoteRequest Request { get; set; } = null!;
}

public class RemoveVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public Guid ContentId { get; set; }
    public string ContentType { get; set; } = string.Empty; // "Question" or "Answer"
}

public class ChangeVoteCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public ChangeVoteRequest Request { get; set; } = null!;
}