namespace Application.Features.Media.Podcasts.DTOs.Requests;

public class CreatePodcastRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public string? Tags { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool AllowComments { get; set; } = true;
    public bool AllowDownload { get; set; } = false;
    public string? Transcript { get; set; }
    public int EpisodeNumber { get; set; }
    public int SeasonNumber { get; set; } = 1;
    public Guid? SeriesId { get; set; }
}

public class UpdatePodcastRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public string? Tags { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool AllowComments { get; set; } = true;
    public bool AllowDownload { get; set; } = false;
    public string? Transcript { get; set; }
}

public class CreatePodcastSeriesRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public string? Category { get; set; }
    public string Language { get; set; } = "en";
}
