using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Password.DTOs.Requests
{
    public class SetPasswordRequest
    {
        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}