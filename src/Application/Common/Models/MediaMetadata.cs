namespace Application.Common.Models;

public class MediaMetadata
{
    public TimeSpan Duration { get; set; }
    public string? Format { get; set; }
    public string? Codec { get; set; }
    public long Bitrate { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public double? FrameRate { get; set; }
    public int? SampleRate { get; set; }
    public int? Channels { get; set; }
    public string? Title { get; set; }
    public string? Artist { get; set; }
    public string? Album { get; set; }
    public int? Year { get; set; }
    public Dictionary<string, object> AdditionalProperties { get; set; } = new();
}