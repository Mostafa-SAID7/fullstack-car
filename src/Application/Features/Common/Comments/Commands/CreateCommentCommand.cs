using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;

namespace Application.Features.Common.Comments.Commands;

public class CreateCommentCommand : IRequest<Result<bool>>
{
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}