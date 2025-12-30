using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.OAuth.DTOs.Requests
{
    public class FacebookLoginRequest
    {
        [Required]
        public string AccessToken { get; set; } = string.Empty;
    }
}