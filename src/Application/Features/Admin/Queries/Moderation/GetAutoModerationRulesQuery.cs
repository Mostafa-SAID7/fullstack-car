using Application.Common.Models;
using Application.Features.Admin.DTOs.Moderation;
using MediatR;

namespace Application.Features.Admin.Queries.Moderation
{
    public class GetAutoModerationRulesQuery : IRequest<Result<List<AutoModerationRuleDto>>>
    {
        public bool? IsActive { get; set; }
        public string? ContentType { get; set; }
    }
}