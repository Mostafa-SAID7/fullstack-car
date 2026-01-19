using System.ComponentModel.DataAnnotations;

namespace Application.Features.Community.DTOs.Requests;

public class CreateQuestionRequest
{
    [Required]
    [StringLength(300, MinimumLength = 10)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(10000, MinimumLength = 20)]
    public string Content { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = new();

    public bool IsScheduled { get; set; } = false;

    public DateTime? ScheduledAt { get; set; }
}

public class UpdateQuestionRequest
{
    [Required]
    [StringLength(300, MinimumLength = 10)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(10000, MinimumLength = 20)]
    public string Content { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = new();
}

public class CloseQuestionRequest
{
    [Required]
    [StringLength(200, MinimumLength = 5)]
    public string Reason { get; set; } = string.Empty;
}
