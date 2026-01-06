namespace Application.Features.Shared.Email.Models
{
    public class EmailEvent
    {
        public string Type { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public Dictionary<string, object> Data { get; set; } = new();
    }
}
