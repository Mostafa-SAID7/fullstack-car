using System.ComponentModel.DataAnnotations;
using Domain.Enums.Common;

namespace Application.Features.Common.Views.DTOs.Requests;

public class TrackViewRequest
{
    [Required]
    public Guid ContentId { get; set; }

    [Required]
    public ContentType ContentType { get; set; }

    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}