using Application.Common.DTOs;
using Application.Features.Community.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.Queries;

public class GetUnansweredQuestionsQuery : IRequest<ApiResponseDto<PaginatedResponseDto<QuestionDto>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
