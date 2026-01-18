using Application.Common.DTOs;
using Application.Features.Admin.StaticPages.DTOs;
using MediatR;

namespace Application.Features.Admin.StaticPages.Queries;

public class GetStaticPageBySlugQuery : IRequest<ApiResponseDto<StaticPageDto>>
{
    public string Slug { get; set; } = string.Empty;
}