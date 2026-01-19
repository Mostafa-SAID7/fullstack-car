using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.QA.Commands;

public class ReopenQuestionCommand : IRequest<ApiResponseDto<object>>
{
    public Guid QuestionId { get; set; }
    public Guid UserId { get; set; }
}