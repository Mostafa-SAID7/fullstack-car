using MediatR;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Application.Features.Media.Podcasts.DTOs.Requests;

namespace Application.Features.Media.Podcasts.Commands;

public class UpdatePodcastCommand : IRequest<Result<PodcastDto>>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public UpdatePodcastRequest Request { get; set; } = new();
}