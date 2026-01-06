using Application.Common.Models;
using Application.Features.Marketplace.ServiceProviders.DTOs.Requests;
using Application.Features.Marketplace.ServiceProviders.DTOs.Responses;
using Domain.Entities.Marketplace;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Marketplace.ServiceProviders.Commands
{
    public class CreateServiceProviderCommand : IRequest<Result<ServiceProviderDto>>
    {
        public Guid UserId { get; set; }
        public CreateServiceProviderRequest Request { get; set; } = null!;
    }

    public class CreateServiceProviderCommandHandler : IRequestHandler<CreateServiceProviderCommand, Result<ServiceProviderDto>>
    {
        private readonly IRepository<ServiceProvider> _serviceProviderRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateServiceProviderCommandHandler(
            IRepository<ServiceProvider> serviceProviderRepository,
            IUnitOfWork unitOfWork)
        {
            _serviceProviderRepository = serviceProviderRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<ServiceProviderDto>> Handle(CreateServiceProviderCommand request, CancellationToken cancellationToken)
        {
            var serviceProvider = new ServiceProvider
            {
                BusinessName = request.Request.BusinessName,
                Description = request.Request.Description ?? string.Empty,
                ContactEmail = request.Request.ContactEmail,
                ContactPhone = request.Request.ContactPhone ?? string.Empty,
                Address = request.Request.Address ?? string.Empty,
                City = request.Request.City ?? string.Empty,
                State = request.Request.State ?? string.Empty,
                ZipCode = request.Request.ZipCode ?? string.Empty,
                Country = request.Request.Country ?? string.Empty,
                Latitude = request.Request.Latitude ?? 0,
                Longitude = request.Request.Longitude ?? 0,
                WebsiteUrl = request.Request.WebsiteUrl,
                BusinessLicense = request.Request.BusinessLicense,
                InsuranceInfo = request.Request.InsuranceInfo,
                OwnerId = request.UserId,
                IsActive = true,
                IsVerified = false
            };

            await _serviceProviderRepository.AddAsync(serviceProvider, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var result = new ServiceProviderDto
            {
                Id = serviceProvider.Id,
                BusinessName = serviceProvider.BusinessName,
                Description = serviceProvider.Description,
                ContactEmail = serviceProvider.ContactEmail,
                ContactPhone = serviceProvider.ContactPhone,
                Address = serviceProvider.Address,
                City = serviceProvider.City,
                State = serviceProvider.State,
                ZipCode = serviceProvider.ZipCode,
                Country = serviceProvider.Country,
                Latitude = serviceProvider.Latitude,
                Longitude = serviceProvider.Longitude,
                WebsiteUrl = serviceProvider.WebsiteUrl,
                IsVerified = serviceProvider.IsVerified,
                IsActive = serviceProvider.IsActive,
                AverageRating = serviceProvider.AverageRating,
                TotalReviews = serviceProvider.TotalReviews,
                BusinessLicense = serviceProvider.BusinessLicense,
                InsuranceInfo = serviceProvider.InsuranceInfo,
                VerifiedAt = serviceProvider.VerifiedAt,
                CreatedAt = serviceProvider.CreatedAt,
                TotalServices = 0,
                TotalBookings = 0
            };

            return Result<ServiceProviderDto>.Success(result);
        }
    }
}
