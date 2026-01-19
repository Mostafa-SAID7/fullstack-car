using System.ComponentModel.DataAnnotations;

namespace Application.Features.Community.DTOs.Requests;

public class CreateAnswerRequest
{
    [Required]
    public Guid? QuestionId { get; set; }
    
    [Required]
    [StringLength(10000, MinimumLength = 20)]
    public string Content { get; set; } = string.Empty;
}

public class UpdateAnswerRequest
{
    [Required]
    [StringLength(10000, MinimumLength = 20)]
    public string Content { get; set; } = string.Empty;
}
