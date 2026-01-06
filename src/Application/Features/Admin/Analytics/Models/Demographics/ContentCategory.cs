namespace Application.Features.Admin.Analytics.Models.Demographics
{
    public class ContentCategory
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
        public double GrowthRate { get; set; }
    }
}
