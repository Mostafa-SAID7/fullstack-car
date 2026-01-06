namespace Application.Features.Shared.Email.Models
{
    public class BulkEmailResult
    {
        public bool Success { get; set; }
        public string? BulkId { get; set; }
        public int TotalRecipients { get; set; }
        public int SuccessfulSends { get; set; }
        public int FailedSends { get; set; }
        public List<EmailError> Errors { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
        public DateTime SentAt { get; set; }
    }
}
