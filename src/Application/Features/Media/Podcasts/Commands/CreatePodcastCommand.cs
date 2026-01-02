using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Requests;
using Application.Features.Media.Podcasts.DTOs.Responses;
using MediatR;

namespace Application.Features.Media.Podcasts.Commands;

public class CreatePodcastCommand : IRequest<Result<PodcastDto>>
{
    public Guid CreatorId { get; set; }
    public CreatePodcastRequest Request { get; set; } = null!;
}

public class UpdatePodcastCommand : IRequest<Result<PodcastDto>>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public UpdatePodcastRequest Request { get; set; } = null!;
}

public class DeletePodcastCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
}

public class PublishPodcastCommand : IRequest<Result<PodcastDto>>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
}

public class LikePodcastCommand : IRequest<Result<bool>>
{
    public Guid PodcastId { get; set; }
    public Guid UserId { get; set; }
}

public class AddPodcastCommentCommand : IRequest<Result<PodcastCommentDto>>
{
    public Guid PodcastId { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}

public class CreatePodcastSeriesCommand : IRequest<Result<PodcastSeriesDto>>
{
    public Guid CreatorId { get; set; }
    public CreatePodcastSeriesRequest Request { get; set; } = null!;
}