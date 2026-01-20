using System.ComponentModel.DataAnnotations;
using Domain.Enums.Common;

namespace Application.Features.Common.Bookmarks.DTOs.Requests;

public class BookmarkRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    public ContentType ContentType { get; set; }

    public string? Notes { get; set; }
}