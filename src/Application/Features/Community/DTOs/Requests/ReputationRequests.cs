using System.ComponentModel.DataAnnotations;

namespace Application.Features.Community.DTOs.Requests;

public class UpdateExpertiseAreasRequest
{
    [Required]
    [MinLength(1, ErrorMessage = "At least one expertise area is required")]
    public List<string> ExpertiseAreas { get; set; } = new();
}

public class AwardBadgeRequest
{
    [Required]
    [StringLength(100, ErrorMessage = "Badge name cannot exceed 100 characters")]
    public string BadgeName { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Reason cannot exceed 500 characters")]
    public string Reason { get; set; } = string.Empty;
}
