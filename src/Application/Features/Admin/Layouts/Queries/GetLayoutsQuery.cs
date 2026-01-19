using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Layouts.Queries;

public class GetLayoutsQuery : IRequest<ApiResponseDto<object>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetActiveLayoutsQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetAllLayoutsQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetLayoutByIdQuery : IRequest<ApiResponseDto<object>>
{
    public Guid LayoutId { get; set; }
}

public class GetLayoutByPageTypeQuery : IRequest<ApiResponseDto<object>>
{
    public string PageType { get; set; } = string.Empty;
}

public class GetAvailableComponentsQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetLayoutTemplatesQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetResponsiveBreakpointsQuery : IRequest<ApiResponseDto<object>>
{
}

// Handlers
public class GetLayoutsQueryHandler : IRequestHandler<GetLayoutsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetLayoutsQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Layouts = new object[0], TotalCount = 0 });
    }
}

public class GetActiveLayoutsQueryHandler : IRequestHandler<GetActiveLayoutsQuery, ApiResponseDto<List<object>>>
{
    public async Task<ApiResponseDto<List<object>>> Handle(GetActiveLayoutsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        var layouts = new List<object>
        {
            new { Id = Guid.NewGuid(), Name = "Default Layout", IsActive = true },
            new { Id = Guid.NewGuid(), Name = "Modern Layout", IsActive = true }
        };
        return ApiResponseDto<List<object>>.Success(layouts);
    }
}

public class GetAllLayoutsQueryHandler : IRequestHandler<GetAllLayoutsQuery, ApiResponseDto<List<object>>>
{
    public async Task<ApiResponseDto<List<object>>> Handle(GetAllLayoutsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        var layouts = new List<object>
        {
            new { Id = Guid.NewGuid(), Name = "Default Layout", IsActive = true },
            new { Id = Guid.NewGuid(), Name = "Modern Layout", IsActive = true },
            new { Id = Guid.NewGuid(), Name = "Classic Layout", IsActive = false }
        };
        return ApiResponseDto<List<object>>.Success(layouts);
    }
}

public class GetLayoutByIdQueryHandler : IRequestHandler<GetLayoutByIdQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetLayoutByIdQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        var layout = new
        {
            Id = request.LayoutId,
            Name = "Sample Layout",
            Description = "A sample layout",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        return ApiResponseDto<object>.Success(layout);
    }
}

public class GetLayoutByPageTypeQueryHandler : IRequestHandler<GetLayoutByPageTypeQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetLayoutByPageTypeQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        var layout = new
        {
            PageType = request.PageType,
            Layout = new { Id = Guid.NewGuid(), Name = $"Layout for {request.PageType}" }
        };
        return ApiResponseDto<object>.Success(layout);
    }
}

public class GetAvailableComponentsQueryHandler : IRequestHandler<GetAvailableComponentsQuery, ApiResponseDto<List<object>>>
{
    public async Task<ApiResponseDto<List<object>>> Handle(GetAvailableComponentsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        var components = new List<object>
        {
            new { Id = Guid.NewGuid(), Name = "Header Component", Type = "header" },
            new { Id = Guid.NewGuid(), Name = "Footer Component", Type = "footer" },
            new { Id = Guid.NewGuid(), Name = "Sidebar Component", Type = "sidebar" }
        };
        return ApiResponseDto<List<object>>.Success(components);
    }
}

public class GetLayoutTemplatesQueryHandler : IRequestHandler<GetLayoutTemplatesQuery, ApiResponseDto<List<object>>>
{
    public async Task<ApiResponseDto<List<object>>> Handle(GetLayoutTemplatesQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        var templates = new List<object>
        {
            new { Id = Guid.NewGuid(), Name = "Basic Template", Category = "Basic" },
            new { Id = Guid.NewGuid(), Name = "Advanced Template", Category = "Advanced" }
        };
        return ApiResponseDto<List<object>>.Success(templates);
    }
}

public class GetResponsiveBreakpointsQueryHandler : IRequestHandler<GetResponsiveBreakpointsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetResponsiveBreakpointsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        var breakpoints = new
        {
            Mobile = 576,
            Tablet = 768,
            Desktop = 992,
            LargeDesktop = 1200
        };
        return ApiResponseDto<object>.Success(breakpoints);
    }
}