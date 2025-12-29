namespace Application.Common.Models
{
    public class ErrorResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string[]? Errors { get; set; }
    }
}
