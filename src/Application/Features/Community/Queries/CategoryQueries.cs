using Application.Common.Models;
using Application.Features.Community.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.Queries;

public class GetCategoriesQuery : IRequest<Result<List<CategoryDto>>>
{
    public bool? IsActive { get; set; } = true;
    public string? SearchTerm { get; set; }
    public string SortBy { get; set; } = "Name";
    public bool SortDescending { get; set; } = false;
}

public class GetCategoryDetailQuery : IRequest<Result<CategoryDto>>
{
    public Guid CategoryId { get; set; }
}

public class GetCategoryExpertsQuery : IRequest<Result<List<ExpertDto>>>
{
    public Guid CategoryId { get; set; }
    public int MaxResults { get; set; } = 10;
    public string SortBy { get; set; } = "ResponseRate";
    public bool SortDescending { get; set; } = true;
}

public class GetPopularCategoriesQuery : IRequest<Result<List<CategoryDto>>>
{
    public int MaxResults { get; set; } = 10;
    public int DaysBack { get; set; } = 30;
}
