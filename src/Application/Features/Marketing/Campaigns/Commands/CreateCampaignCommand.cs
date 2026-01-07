using Application.Common.Models;
using Application.Features.Marketing.Campaigns.DTOs;
using Application.Features.Marketing.Campaigns.DTOs.Requests;
using MediatR;

namespace Application.Features.Marketing.Campaigns.Commands;

public class CreateCampaignCommand : IRequest<Result<CampaignDto>>
{
    public CreateCampaignRequest Request { get; set; }

    public CreateCampaignCommand(CreateCampaignRequest request)
    {
        Request = request;
    }
}

public class UpdateCampaignCommand : IRequest<Result<CampaignDto>>
{
    public Guid Id { get; set; }
    public UpdateCampaignRequest Request { get; set; }

    public UpdateCampaignCommand(Guid id, UpdateCampaignRequest request)
    {
        Id = id;
        Request = request;
    }
}

public class DeleteCampaignCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }

    public DeleteCampaignCommand(Guid id)
    {
        Id = id;
    }
}

public class CreateCampaignContentCommand : IRequest<Result<CampaignContentDto>>
{
    public CreateCampaignContentRequest Request { get; set; }

    public CreateCampaignContentCommand(CreateCampaignContentRequest request)
    {
        Request = request;
    }
}

public class UpdateCampaignContentCommand : IRequest<Result<CampaignContentDto>>
{
    public Guid Id { get; set; }
    public UpdateCampaignContentRequest Request { get; set; }

    public UpdateCampaignContentCommand(Guid id, UpdateCampaignContentRequest request)
    {
        Id = id;
        Request = request;
    }
}

public class DeleteCampaignContentCommand : IRequest<Result<bool>>
{
    public Guid Id { get; set; }

    public DeleteCampaignContentCommand(Guid id)
    {
        Id = id;
    }
}