using Domain.Entities.Marketing;
using System.ComponentModel.DataAnnotations;

namespace Application.Features.Marketing.Campaigns.DTOs.Requests;

public class CreateCampaignRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public CampaignType Type { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Budget { get; set; }

    [MaxLength(500)]
    public string? TargetAudience { get; set; }

    public List<string> Tags { get; set; } = new();
    public List<Guid> PlatformIds { get; set; } = new();
}

public class UpdateCampaignRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public CampaignType Type { get; set; }
    public CampaignStatus Status { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Budget { get; set; }

    [MaxLength(500)]
    public string? TargetAudience { get; set; }

    public List<string> Tags { get; set; } = new();
    public List<Guid> PlatformIds { get; set; } = new();
}

public class CreateCampaignContentRequest
{
    public Guid CampaignId { get; set; }

    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public string? Content { get; set; }
    public ContentType Type { get; set; }

    [MaxLength(500)]
    public string? MediaUrl { get; set; }

    [MaxLength(200)]
    public string? ThumbnailUrl { get; set; }

    public DateTime? ScheduledDate { get; set; }

    [MaxLength(100)]
    public string? Author { get; set; }

    public List<string> Tags { get; set; } = new();
    public List<Guid> PlatformIds { get; set; } = new();
}

public class UpdateCampaignContentRequest
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public string? Content { get; set; }
    public ContentType Type { get; set; }
    public ContentStatus Status { get; set; }

    [MaxLength(500)]
    public string? MediaUrl { get; set; }

    [MaxLength(200)]
    public string? ThumbnailUrl { get; set; }

    public DateTime? ScheduledDate { get; set; }

    [MaxLength(100)]
    public string? Author { get; set; }

    public List<string> Tags { get; set; } = new();
    public List<Guid> PlatformIds { get; set; } = new();
}