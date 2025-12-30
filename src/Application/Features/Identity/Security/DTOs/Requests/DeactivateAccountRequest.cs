using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.Security.DTOs.Requests
{
    public class DeactivateAccountRequest
    {
        [Required]
        public string Reason { get; set; } = string.Empty;
        
        public bool DeleteContent { get; set; } = false;
    }
}
