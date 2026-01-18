using Application.Common.DTOs;
using Application.Features.Admin.StaticPages.DTOs;
using MediatR;

namespace Application.Features.Admin.StaticPages.Queries;

public class GetPublishedStaticPagesQuery : IRequest<ApiResponseDto<List<StaticPageDto>>>
{
    public string? Category { get; set; }
    public int? Limit { get; set; }
}