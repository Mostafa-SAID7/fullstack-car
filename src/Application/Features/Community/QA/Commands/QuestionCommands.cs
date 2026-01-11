using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.QA.Commands;

public class CreateQuestionCommand : IRequest<Result<QuestionDto>>
{
    public Guid UserId { get; set; }
    public CreateQuestionRequest Request { get; set; } = null!;
}

public class UpdateQuestionCommand : IRequest<Result<QuestionDto>>
{
    public Guid QuestionId { get; set; }
    public Guid UserId { get; set; }
    public UpdateQuestionRequest Request { get; set; } = null!;
}

public class DeleteQuestionCommand : IRequest<Result<bool>>
{
    public Guid QuestionId { get; set; }
    public Guid UserId { get; set; }
}

public class CloseQuestionCommand : IRequest<Result<bool>>
{
    public Guid QuestionId { get; set; }
    public Guid UserId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class AcceptAnswerCommand : IRequest<Result<bool>>
{
    public Guid AnswerId { get; set; }
    public Guid UserId { get; set; }
}