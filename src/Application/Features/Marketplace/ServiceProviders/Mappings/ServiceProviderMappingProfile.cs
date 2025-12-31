using AutoMapper;
using Application.Features.Marketplace.ServiceProviders.DTOs.Responses;
using Domain.Entities.Marketplace;

namespace Application.Features.Marketplace.ServiceProviders.Mappings
{
    public class ServiceProviderMappingProfile : AutoMapper.Profile
    {
        public ServiceProviderMappingProfile()
        {
            CreateMap<ServiceProvider, ServiceProviderDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => $"{src.Owner.FirstName} {src.Owner.LastName}"))
                .ForMember(dest => dest.TotalServices, opt => opt.MapFrom(src => src.Services.Count))
                .ForMember(dest => dest.TotalBookings, opt => opt.MapFrom(src => src.Services.SelectMany(s => s.Bookings).Count()));
        }
    }
}