namespace Application.Features.Community.Pages.DTOs;

public class CreatePageRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool IsPublished { get; set; } = false;
}

public class UpdatePageRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool IsPublished { get; set; } = false;
}