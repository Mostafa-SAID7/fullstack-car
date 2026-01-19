using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.QA.Queries;

public class GetAnswersByQuestionQuery : IRequest<Result<PaginatedList<AnswerDto>>>
{
    public Guid QuestionId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortBy { get; set; } = "VoteScore";
    public bool SortDescending { get; set; } = true;
    public Guid? UserId { get; set; }
}

public class GetAnswerQuery : IRequest<Result<AnswerDto>>
{
    public Guid AnswerId { get; set; }
    public Guid? UserId { get; set; }
}

public class GetMyAnswersQuery : IRequest<Result<PaginatedList<AnswerDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public bool? IsAccepted { get; set; }
}