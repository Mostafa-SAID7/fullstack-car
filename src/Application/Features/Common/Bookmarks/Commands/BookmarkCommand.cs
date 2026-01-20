using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;

namespace Application.Features.Common.Bookmarks.Commands;

public record BookmarkCommand(Guid ContentId, ContentType ContentType, Guid UserId, string? Notes = null) : IRequest<Result<bool>>;