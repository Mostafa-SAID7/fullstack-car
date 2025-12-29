using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.DTOs.Requests
{
    public class RevokeTokenRequest
    {
        [Required]
        public string Token { get; set; } = string.Empty;
    }
}
