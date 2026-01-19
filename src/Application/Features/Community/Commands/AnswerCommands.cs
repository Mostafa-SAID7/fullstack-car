using Application.Common.Models;
using Application.Features.Community.DTOs.Requests;
using Application.Features.Community.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.Commands;

public class CreateAnswerCommand : IRequest<Result<AnswerDto>>
{
    public Guid QuestionId { get; set; }
    public Guid UserId { get; set; }
    public CreateAnswerRequest Request { get; set; } = null!;
}

public class UpdateAnswerCommand : IRequest<Result<AnswerDto>>
{
    public Guid AnswerId { get; set; }
    public Guid UserId { get; set; }
    public UpdateAnswerRequest Request { get; set; } = null!;
}

public class DeleteAnswerCommand : IRequest<Result<bool>>
{
    public Guid AnswerId { get; set; }
    public Guid UserId { get; set; }
}
