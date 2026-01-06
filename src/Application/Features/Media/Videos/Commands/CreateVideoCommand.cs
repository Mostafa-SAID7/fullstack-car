using Application.Common.Models;
using Application.Features.Media.Videos.DTOs.Requests;
using Application.Features.Media.Videos.DTOs.Responses;
using MediatR;

namespace Application.Features.Media.Videos.Commands;

public class CreateVideoCommand : IRequest<Result<VideoDto>>
{
    public Guid CreatorId { get; set; }
    public CreateVideoRequest Request { get; set; } = null!;
}

public class UpdateVideoCommand : IRequest<Result<VideoDto>>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public UpdateVideoRequest Request { get; set; } = null!;
}

public class DeleteVideoCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
}

public class PublishVideoCommand : IRequest<Result<VideoDto>>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
}

public class LikeVideoCommand : IRequest<Result<bool>>
{
    public Guid VideoId { get; set; }
    public Guid UserId { get; set; }
    public bool IsLike { get; set; } = true; // true = like, false = dislike
}

public class AddVideoCommentCommand : IRequest<Result<VideoCommentDto>>
{
    public Guid VideoId { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}
