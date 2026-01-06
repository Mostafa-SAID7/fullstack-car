using AutoMapper;
using Application.Features.Admin.Analytics.DTOs;
using Domain.Entities.Identity;

namespace Application.Features.Admin.Analytics.Mappings
{
    public class AnalyticsMappingProfile : AutoMapper.Profile
    {
        public AnalyticsMappingProfile()
        {
            // Add mappings for Analytics DTOs if needed
            // For now, most analytics data is aggregated and doesn't map directly from entities
        }
    }
}
