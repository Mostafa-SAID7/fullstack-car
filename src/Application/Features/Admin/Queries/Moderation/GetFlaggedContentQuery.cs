using Application.Common.Models;
using Application.Features.Admin.DTOs.Moderation;
using MediatR;

namespace Application.Features.Admin.Queries.Moderation
{
    public class GetFlaggedContentQuery : IRequest<Result<PaginatedList<ContentModerationDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? ContentType { get; set; }
        public ContentFilterRequest Filter { get; set; } = new();
    }
}