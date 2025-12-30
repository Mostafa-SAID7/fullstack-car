using System.ComponentModel.DataAnnotations;

namespace Application.Features.Identity.OAuth.DTOs.Requests
{
    public class GitHubLoginRequest
    {
        [Required]
        public string Code { get; set; } = string.Empty;

        public string? State { get; set; }
    }
}
