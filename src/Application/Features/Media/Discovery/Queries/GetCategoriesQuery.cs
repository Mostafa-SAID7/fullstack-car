using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using MediatR;

namespace Application.Features.Media.Discovery.Queries;

public class GetCategoriesQuery : IRequest<Result<List<CategoryDto>>>
{
    public bool IncludeContentCount { get; set; } = true;
    public bool OnlyWithContent { get; set; } = true;
}