using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Password.DTOs.Requests
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
