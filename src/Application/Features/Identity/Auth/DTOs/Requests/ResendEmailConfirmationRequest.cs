using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Auth.DTOs.Requests
{
    public class ResendEmailConfirmationRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
