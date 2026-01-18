namespace Application.Features.Media.Playlists.DTOs;

public class CreatePlaylistRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublic { get; set; } = true;
    public List<string> Tags { get; set; } = new();
    public string? CoverImageUrl { get; set; }
}