using System.ComponentModel.DataAnnotations;
using Domain.Enums.Common;

namespace Application.Features.Common.Comments.DTOs.Requests;

public class CreateCommentRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    public ContentType ContentType { get; set; }

    [Required]
    [StringLength(2000, MinimumLength = 1)]
    public string Content { get; set; } = string.Empty;

    public Guid? ParentCommentId { get; set; }
}