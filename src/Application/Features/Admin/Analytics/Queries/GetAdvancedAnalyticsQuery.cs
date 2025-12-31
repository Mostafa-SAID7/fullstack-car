using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Common.Models;
using MediatR;

namespace Application.Features.Admin.Analytics.Queries
{
    public class GetAdvancedAnalyticsQuery : IRequest<Result<AdvancedAnalyticsResponse>>
    {
        public string Period { get; set; } = "week"; // day, week, month, year
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<string> Metrics { get; set; } = new(); // Specific metrics to include
        public bool IncludeComparisons { get; set; } = true;
        public bool IncludeTrends { get; set; } = true;
        public bool IncludeForecasts { get; set; } = false;
    }
}