using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.StaticPages.Commands;

public class CreateStaticPageRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

public class UpdateStaticPageRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

public class DuplicateStaticPageRequest
{
    public string NewTitle { get; set; } = string.Empty;
    public string NewSlug { get; set; } = string.Empty;
}

public class CreatePageTemplateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Template { get; set; } = string.Empty;
}

public class UpdatePageNavigationRequest
{
    public List<NavigationItem> NavigationItems { get; set; } = new();
}

public class NavigationItem
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int Order { get; set; }
}

public class CreateStaticPageCommand : IRequest<ApiResponseDto<object>>
{
    public CreateStaticPageRequest Request { get; set; } = new();
    public Guid CreatedBy { get; set; }
}

public class UpdateStaticPageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public UpdateStaticPageRequest Request { get; set; } = new();
    public Guid UpdatedBy { get; set; }
}

public class DeleteStaticPageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public Guid DeletedBy { get; set; }
}

public class PublishStaticPageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public Guid PublishedBy { get; set; }
}

public class UnpublishStaticPageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public Guid UnpublishedBy { get; set; }
}

public class DuplicateStaticPageCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public DuplicateStaticPageRequest Request { get; set; } = new();
    public Guid CreatedBy { get; set; }
}

public class CreatePageTemplateCommand : IRequest<ApiResponseDto<object>>
{
    public CreatePageTemplateRequest Request { get; set; } = new();
    public Guid CreatedBy { get; set; }
}

public class UpdatePageNavigationCommand : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
    public UpdatePageNavigationRequest Request { get; set; } = new();
    public Guid UpdatedBy { get; set; }
}

public class CreateStaticPageCommandHandler : IRequestHandler<CreateStaticPageCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(CreateStaticPageCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Id = Guid.NewGuid(), Title = request.Request.Title });
    }
}

public class GetUserStaticPagesQuery : IRequest<ApiResponseDto<object>>
{
    public Guid AuthorId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}