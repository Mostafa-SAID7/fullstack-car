using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Auth.DTOs.Requests
{
    public class ConfirmEmailRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;
    }
}