using Application.Common.DTOs;
using Application.Features.Community.QA.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.QA.Queries;

public class GetTrendingQuestionsQuery : IRequest<ApiResponseDto<List<QuestionDto>>>
{
    public int Count { get; set; } = 10;
    public string Timeframe { get; set; } = "day";
}