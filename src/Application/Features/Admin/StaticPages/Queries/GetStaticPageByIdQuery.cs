using Application.Common.DTOs;
using Application.Features.Admin.StaticPages.DTOs;
using MediatR;

namespace Application.Features.Admin.StaticPages.Queries;

public class GetStaticPageByIdQuery : IRequest<ApiResponseDto<StaticPageDto>>
{
    public Guid Id { get; set; }
}