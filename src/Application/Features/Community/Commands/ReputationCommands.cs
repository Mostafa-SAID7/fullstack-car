using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.QA.Commands;

public class UpdateExpertiseAreasCommand : IRequest<Result<UserReputationDto>>
{
    public Guid UserId { get; set; }
    public List<string> ExpertiseAreas { get; set; } = new();
}

public class AwardBadgeCommand : IRequest<Result<UserReputationDto>>
{
    public Guid UserId { get; set; }
    public string BadgeName { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}

public class UpdateReputationCommand : IRequest<Result<UserReputationDto>>
{
    public Guid UserId { get; set; }
    public int ReputationChange { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public Guid ContentId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}