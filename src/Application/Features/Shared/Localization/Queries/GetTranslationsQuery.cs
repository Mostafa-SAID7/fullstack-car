using MediatR;
using Application.Features.Shared.Localization.DTOs;

namespace Application.Features.Shared.Localization.Queries
{
    public class GetTranslationsQuery : IRequest<PagedResult<TranslationDto>>
    {
        public string? Language { get; set; }
        public string? Category { get; set; }
        public string? Search { get; set; }
        public bool? IsActive { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? SortBy { get; set; } = "key";
        public string? SortDirection { get; set; } = "asc";
    }

    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage => Page < TotalPages;
        public bool HasPreviousPage => Page > 1;
    }
}
