namespace Application.Features.Community.Stories.DTOs;

public class CreateStoryRequest
{
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaType { get; set; } = "image"; // image, video
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public int Duration { get; set; } = 5; // seconds
    public List<string> Tags { get; set; } = new();
    public StoryLocationDto? Location { get; set; }
    public string? Privacy { get; set; } = "public"; // public, friends, private
}

public class CreateHighlightRequest
{
    public string Title { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public List<Guid> StoryIds { get; set; } = new();
    public bool IsPublic { get; set; } = true;
}

public class ReportStoryRequest
{
    public string Reason { get; set; } = string.Empty; // inappropriate_content, spam, harassment, etc.
    public string? Description { get; set; }
    public string? Category { get; set; }
}

public class StoryLocationDto
{
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}