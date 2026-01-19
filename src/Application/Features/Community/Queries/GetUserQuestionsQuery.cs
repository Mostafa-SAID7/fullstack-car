using Application.Common.DTOs;
using Application.Features.Community.QA.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.QA.Queries;

public class GetUserQuestionsQuery : IRequest<ApiResponseDto<PaginatedResponseDto<QuestionDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}