using Application.Common.Models;
using Application.Features.Marketplace.Services.DTOs.Requests;
using Application.Features.Marketplace.Services.DTOs.Responses;
using Domain.Entities.Marketplace;
using Domain.Enums.Marketplace;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Marketplace.Services.Commands
{
    public class CreateCarServiceCommand : IRequest<Result<CarServiceDto>>
    {
        public Guid ServiceProviderId { get; set; }
        public CreateCarServiceRequest Request { get; set; } = null!;
    }

    public class CreateCarServiceCommandHandler : IRequestHandler<CreateCarServiceCommand, Result<CarServiceDto>>
    {
        private readonly IRepository<CarService> _carServiceRepository;
        private readonly IRepository<ServiceProvider> _serviceProviderRepository;
        private readonly IRepository<ServiceAvailability> _availabilityRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateCarServiceCommandHandler(
            IRepository<CarService> carServiceRepository,
            IRepository<ServiceProvider> serviceProviderRepository,
            IRepository<ServiceAvailability> availabilityRepository,
            IUnitOfWork unitOfWork)
        {
            _carServiceRepository = carServiceRepository;
            _serviceProviderRepository = serviceProviderRepository;
            _availabilityRepository = availabilityRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<CarServiceDto>> Handle(CreateCarServiceCommand request, CancellationToken cancellationToken)
        {
            var serviceProvider = await _serviceProviderRepository.GetByIdAsync(request.ServiceProviderId, cancellationToken);
            if (serviceProvider == null)
            {
                return Result<CarServiceDto>.Failure(new[] { "Service provider not found" });
            }

            var carService = new CarService
            {
                Title = request.Request.Title,
                Description = request.Request.Description ?? string.Empty,
                Type = request.Request.Type,
                Status = ServiceStatus.Draft,
                BasePrice = request.Request.BasePrice,
                MaxPrice = request.Request.MaxPrice,
                Currency = request.Request.Currency,
                EstimatedDurationMinutes = request.Request.EstimatedDurationMinutes,
                IsEmergencyService = request.Request.IsEmergencyService,
                IsAvailable24x7 = request.Request.IsAvailable24x7,
                Requirements = request.Request.Requirements,
                IncludedItems = request.Request.IncludedItems,
                ExcludedItems = request.Request.ExcludedItems,
                ServiceProviderId = request.ServiceProviderId
            };

            await _carServiceRepository.AddAsync(carService, cancellationToken);

            // Add availability if provided
            if (request.Request.Availability != null && request.Request.Availability.Any())
            {
                foreach (var availability in request.Request.Availability)
                {
                    var serviceAvailability = new ServiceAvailability
                    {
                        ServiceId = carService.Id,
                        DayOfWeek = availability.DayOfWeek,
                        StartTime = availability.StartTime,
                        EndTime = availability.EndTime,
                        IsAvailable = availability.IsAvailable,
                        Notes = availability.Notes
                    };

                    await _availabilityRepository.AddAsync(serviceAvailability, cancellationToken);
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var result = new CarServiceDto
            {
                Id = carService.Id,
                Title = carService.Title,
                Description = carService.Description,
                Type = carService.Type,
                TypeName = carService.Type.ToString(),
                Status = carService.Status,
                StatusName = carService.Status.ToString(),
                BasePrice = carService.BasePrice,
                MaxPrice = carService.MaxPrice,
                Currency = carService.Currency,
                EstimatedDurationMinutes = carService.EstimatedDurationMinutes,
                EstimatedDuration = FormatDuration(carService.EstimatedDurationMinutes),
                IsEmergencyService = carService.IsEmergencyService,
                IsAvailable24x7 = carService.IsAvailable24x7,
                Requirements = carService.Requirements,
                IncludedItems = carService.IncludedItems,
                ExcludedItems = carService.ExcludedItems,
                AverageRating = carService.AverageRating,
                TotalReviews = carService.TotalReviews,
                TotalBookings = carService.TotalBookings,
                LastBookedAt = carService.LastBookedAt,
                CreatedAt = carService.CreatedAt,
                ServiceProviderId = carService.ServiceProviderId,
                ServiceProviderName = serviceProvider.BusinessName
            };

            return Result<CarServiceDto>.Success(result);
        }

        private static string FormatDuration(int minutes)
        {
            if (minutes < 60)
                return $"{minutes} min";
            
            var hours = minutes / 60;
            var remainingMinutes = minutes % 60;
            
            if (remainingMinutes == 0)
                return $"{hours} hr";
            
            return $"{hours} hr {remainingMinutes} min";
        }
    }
}