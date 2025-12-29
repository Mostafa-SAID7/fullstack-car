namespace Application.Features.Community.Posts.DTOs
{
    public class ReportPostRequest
    {
        public string Reason { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }
}