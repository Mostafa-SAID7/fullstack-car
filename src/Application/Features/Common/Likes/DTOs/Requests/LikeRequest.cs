using System.ComponentModel.DataAnnotations;
using Domain.Enums.Common;

namespace Application.Features.Common.Likes.DTOs.Requests;

public class LikeRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    public ContentType ContentType { get; set; }
}