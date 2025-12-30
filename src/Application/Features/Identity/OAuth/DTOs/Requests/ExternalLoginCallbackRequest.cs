using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.OAuth.DTOs.Requests
{
    public class ExternalLoginCallbackRequest
    {
        [Required]
        public string Provider { get; set; } = string.Empty;
        
        [Required]
        public string Code { get; set; } = string.Empty;
        
        public string? State { get; set; }
        public string? ReturnUrl { get; set; }
    }
}
