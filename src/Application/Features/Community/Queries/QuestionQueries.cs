using Application.Common.Models;
using Application.Features.Community.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.Queries;

public class GetQuestionsQuery : IRequest<Result<PaginatedList<QuestionListDto>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string? Category { get; set; }
    public string? Tags { get; set; }
    public Guid? UserId { get; set; }
    public bool? IsClosed { get; set; }
    public string SortBy { get; set; } = "CreatedAt";
    public bool SortDescending { get; set; } = true;
}

public class GetQuestionDetailQuery : IRequest<Result<QuestionDetailDto>>
{
    public Guid QuestionId { get; set; }
    public Guid? UserId { get; set; }
}

public class SearchQuestionsQuery : IRequest<Result<PaginatedList<QuestionListDto>>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Tags { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortBy { get; set; } = "Relevance";
    public bool SortDescending { get; set; } = true;
}

public class GetSimilarQuestionsQuery : IRequest<Result<List<QuestionSimilarityDto>>>
{
    public Guid QuestionId { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int MaxResults { get; set; } = 5;
    public double MinSimilarityScore { get; set; } = 0.7;
}

public class GetMyQuestionsQuery : IRequest<Result<PaginatedList<QuestionListDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public bool? IsClosed { get; set; }
}
