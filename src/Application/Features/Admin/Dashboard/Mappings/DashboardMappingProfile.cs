using AutoMapper;
using Application.Features.Admin.Dashboard.DTOs;
using Domain.Entities.Identity;

namespace Application.Features.Admin.Dashboard.Mappings
{
    public class DashboardMappingProfile : AutoMapper.Profile
    {
        public DashboardMappingProfile()
        {
            // Add mappings for Dashboard DTOs if needed
            // Most dashboard data is aggregated and doesn't map directly from entities
        }
    }
}
