using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Security.DTOs.Requests
{
    public class DisableTwoFactorRequest
    {
        [Required]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string TwoFactorCode { get; set; } = string.Empty;
    }
}
