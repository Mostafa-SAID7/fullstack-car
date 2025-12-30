using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Security.DTOs.Requests
{
    public class LockAccountRequest
    {
        [Required]
        public TimeSpan LockoutDuration { get; set; }

        [Required]
        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;
    }
}