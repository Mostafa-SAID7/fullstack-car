using System.ComponentModel.DataAnnotations;
using Domain.Enums.Common;

namespace Application.Features.Common.Votes.DTOs.Requests;

public class ChangeVoteRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    public ContentType ContentType { get; set; }

    [Required]
    public VoteType NewVoteType { get; set; }
}