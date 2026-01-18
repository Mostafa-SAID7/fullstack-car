using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.StaticPages.Queries;

public class GetPageTemplatesQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetNavigationPagesQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetPageSeoAnalysisQuery : IRequest<ApiResponseDto<object>>
{
    public Guid PageId { get; set; }
}

public class GetUserStaticPagesQuery : IRequest<ApiResponseDto<List<object>>>
{
    public Guid UserId { get; set; }
}

public class GetStaticPagesStatsQuery : IRequest<ApiResponseDto<object>>
{
}