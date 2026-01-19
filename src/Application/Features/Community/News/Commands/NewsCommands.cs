using Application.Common.DTOs;
using Application.Features.Community.News.DTOs;
using MediatR;

namespace Application.Features.Community.News.Commands;

public class CreateArticleCommand : IRequest<ApiResponseDto<object>>
{
    public CreateArticleRequest Request { get; set; } = new();
    public Guid AuthorId { get; set; }
}

public class UpdateArticleCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ArticleId { get; set; }
    public UpdateArticleRequest Request { get; set; } = new();
    public Guid UserId { get; set; }
}

public class DeleteArticleCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ArticleId { get; set; }
    public Guid UserId { get; set; }
}

public class PublishArticleCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ArticleId { get; set; }
    public Guid UserId { get; set; }
}

public class UnpublishArticleCommand : IRequest<ApiResponseDto<object>>
{
    public Guid ArticleId { get; set; }
    public Guid UserId { get; set; }
}
