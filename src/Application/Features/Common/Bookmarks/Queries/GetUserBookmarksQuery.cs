using Application.Common.Models;
using Application.Features.Common.Bookmarks.DTOs.Responses;
using Domain.Enums.Common;
using MediatR;

namespace Application.Features.Common.Bookmarks.Queries;

public record GetUserBookmarksQuery(
    Guid UserId,
    ContentType? ContentType = null,
    int Page = 1,
    int PageSize = 10
) : IRequest<Result<PaginatedList<BookmarkResponse>>>;