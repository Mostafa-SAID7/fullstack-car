using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.OAuth.DTOs.Requests
{
    public class MicrosoftLoginRequest
    {
        [Required]
        public string AccessToken { get; set; } = string.Empty;
        
        public string? IdToken { get; set; }
        
        public string? Email { get; set; }
        
        public string? Name { get; set; }
        
        public string? FirstName { get; set; }
        
        public string? LastName { get; set; }
        
        public string? ProfilePictureUrl { get; set; }
        
        public string? MicrosoftId { get; set; }
    }
}