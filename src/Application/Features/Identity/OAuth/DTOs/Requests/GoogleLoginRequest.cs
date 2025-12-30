using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.OAuth.DTOs.Requests
{
    public class GoogleLoginRequest
    {
        [Required]
        public string IdToken { get; set; } = string.Empty;
    }
}