namespace Application.Features.Shared.Email.Models
{
    public class EmailError
    {
        public string Recipient { get; set; } = string.Empty;
        public string Error { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }
}