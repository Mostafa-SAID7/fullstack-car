namespace Application.Features.Admin.Analytics.Models.Demographics
{
    public class UserDemographic
    {
        public string Category { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}