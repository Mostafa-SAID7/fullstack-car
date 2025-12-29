using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.DTOs.Requests
{
    public class ForgotPasswordRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = string.Empty;
    }
}
