namespace Application.Features.Identity.Password.DTOs.Responses
{
    public class PasswordStrengthResult
    {
        public int Score { get; set; } // 0-4 (Very Weak to Very Strong)
        public string Strength { get; set; } = string.Empty;
        public List<string> Suggestions { get; set; } = new();
        public List<string> Warning { get; set; } = new();
        public bool IsAcceptable { get; set; }
        public TimeSpan EstimatedCrackTime { get; set; }
    }
}
