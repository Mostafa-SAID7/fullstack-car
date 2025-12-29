namespace Application.Features.Community.Posts.DTOs
{
    public class UpdatePostRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public bool IsPublic { get; set; } = true;
    }
}