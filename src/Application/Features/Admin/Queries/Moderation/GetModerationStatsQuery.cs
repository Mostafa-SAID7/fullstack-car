using Application.Common.Models;
using Application.Features.Admin.DTOs.Moderation;
using MediatR;

namespace Application.Features.Admin.Queries.Moderation
{
    public class GetModerationStatsQuery : IRequest<Result<ModerationStatsDto>>
    {
    }
}