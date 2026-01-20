using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;

namespace Application.Features.Common.Bookmarks.Commands;

public record RemoveBookmarkCommand(Guid ContentId, ContentType ContentType, Guid UserId) : IRequest<Result<bool>>;