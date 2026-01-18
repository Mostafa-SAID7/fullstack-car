using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Layouts.Queries;

public class GetActiveLayoutsQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetAllLayoutsQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetLayoutByIdQuery : IRequest<ApiResponseDto<object>>
{
    public Guid Id { get; set; }
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