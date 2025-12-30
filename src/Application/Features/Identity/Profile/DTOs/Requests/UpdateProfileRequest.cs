using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Profile.DTOs.Requests
{
    public class UpdateProfileRequest
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Bio { get; set; }
    }
}
