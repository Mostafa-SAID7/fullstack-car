using System.ComponentModel.DataAnnotations;

namespace Application.Features.Community.QA.DTOs.Requests;

public class CreateVoteRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    [RegularExpression("^(Question|Answer)$")]
    public string ContentType { get; set; } = string.Empty; // "Question" or "Answer"

    [Required]
    [RegularExpression("^(Up|Down)$")]
    public string VoteType { get; set; } = string.Empty; // "Up" or "Down"
}

public class ChangeVoteRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    [RegularExpression("^(Question|Answer)$")]
    public string ContentType { get; set; } = string.Empty; // "Question" or "Answer"

    [Required]
    [RegularExpression("^(Up|Down)$")]
    public string NewVoteType { get; set; } = string.Empty; // "Up" or "Down"
}