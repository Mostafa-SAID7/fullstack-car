namespace Application.Features.Shared.Email.Models
{
    public class EmailResult
    {
        public bool Success { get; set; }
        public string? MessageId { get; set; }
        public List<string> Errors { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
        public DateTime SentAt { get; set; }
    }
}
