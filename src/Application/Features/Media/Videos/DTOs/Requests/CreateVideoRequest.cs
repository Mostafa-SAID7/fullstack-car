using Domain.Enums.Media;

namespace Application.Features.Media.Videos.DTOs.Requests;

public class CreateVideoRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public VideoQuality Quality { get; set; } = VideoQuality.HD_720p;
    public string? Tags { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool AllowComments { get; set; } = true;
}

public class UpdateVideoRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public string? Tags { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool AllowComments { get; set; } = true;
}