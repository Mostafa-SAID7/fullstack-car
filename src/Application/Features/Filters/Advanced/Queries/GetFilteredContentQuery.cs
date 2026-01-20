using Application.Common.Models;
using Application.Features.Filters.Advanced.DTOs.Requests;
using Application.Features.Filters.Advanced.DTOs.Responses;
using MediatR;

namespace Application.Features.Filters.Advanced.Queries;

public class GetFilteredContentQuery : IRequest<Result<FilteredContentResponse>>
{
    public FilterRequest Filter { get; set; } = new();
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}