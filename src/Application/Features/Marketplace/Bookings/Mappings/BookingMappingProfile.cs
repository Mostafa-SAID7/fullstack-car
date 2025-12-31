using AutoMapper;
using Application.Features.Marketplace.Bookings.DTOs.Responses;
using Domain.Entities.Marketplace;

namespace Application.Features.Marketplace.Bookings.Mappings
{
    public class BookingMappingProfile : AutoMapper.Profile
    {
        public BookingMappingProfile()
        {
            CreateMap<ServiceBooking, ServiceBookingDto>()
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.Customer.Id))
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => $"{src.Customer.FirstName} {src.Customer.LastName}"))
                .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Customer.Email))
                .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.Customer.PhoneNumber))
                .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.Service.Id))
                .ForMember(dest => dest.ServiceTitle, opt => opt.MapFrom(src => src.Service.Title))
                .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.Service.Type))
                .ForMember(dest => dest.ServiceTypeName, opt => opt.MapFrom(src => src.Service.Type.ToString()))
                .ForMember(dest => dest.ServiceProviderId, opt => opt.MapFrom(src => src.Service.ServiceProvider.Id))
                .ForMember(dest => dest.ServiceProviderName, opt => opt.MapFrom(src => src.Service.ServiceProvider.BusinessName))
                .ForMember(dest => dest.ServiceProviderPhone, opt => opt.MapFrom(src => src.Service.ServiceProvider.ContactPhone));
        }
    }
}