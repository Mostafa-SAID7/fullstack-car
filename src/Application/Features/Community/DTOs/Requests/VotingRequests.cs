using System.ComponentModel.DataAnnotations;
using Domain.Enums.Common;
using Domain.Enums.Community;
using VoteType = Domain.Enums.Community.VoteType;

namespace Application.Features.Community.DTOs.Requests;

public class CreateVoteRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    public ContentType ContentType { get; set; }

    [Required]
    public VoteType VoteType { get; set; }
}

public class ChangeVoteRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    public ContentType ContentType { get; set; }

    [Required]
    public VoteType NewVoteType { get; set; }
}
