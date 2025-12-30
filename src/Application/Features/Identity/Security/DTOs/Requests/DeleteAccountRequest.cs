using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Security.DTOs.Requests
{
    public class DeleteAccountRequest
    {
        [Required]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string Reason { get; set; } = string.Empty;
        
        public bool DeleteAllContent { get; set; } = false;
    }
}
