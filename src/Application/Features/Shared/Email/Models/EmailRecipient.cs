namespace Application.Features.Shared.Email.Models
{
    public class EmailRecipient
    {
        public string Email { get; set; } = string.Empty;
        public string? Name { get; set; }
        public Dictionary<string, object> MergeData { get; set; } = new();
    }
}
