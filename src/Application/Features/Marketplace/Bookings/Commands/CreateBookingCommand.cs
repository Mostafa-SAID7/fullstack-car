using Application.Common.Models;
using Application.Features.Marketplace.Bookings.DTOs.Requests;
using Application.Features.Marketplace.Bookings.DTOs.Responses;
using Domain.Entities.Marketplace;
using Domain.Enums.Marketplace;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Marketplace.Bookings.Commands
{
    public class CreateBookingCommand : IRequest<Result<ServiceBookingDto>>
    {
        public Guid CustomerId { get; set; }
        public CreateBookingRequest Request { get; set; } = null!;
    }

    public class CreateBookingCommandHandler : IRequestHandler<CreateBookingCommand, Result<ServiceBookingDto>>
    {
        private readonly IRepository<ServiceBooking> _bookingRepository;
        private readonly IRepository<CarService> _carServiceRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateBookingCommandHandler(
            IRepository<ServiceBooking> bookingRepository,
            IRepository<CarService> carServiceRepository,
            IUnitOfWork unitOfWork)
        {
            _bookingRepository = bookingRepository;
            _carServiceRepository = carServiceRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<ServiceBookingDto>> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
        {
            var service = await _carServiceRepository.GetQueryable()
                .Include(s => s.ServiceProvider)
                .FirstOrDefaultAsync(s => s.Id == request.Request.ServiceId, cancellationToken);

            if (service == null)
            {
                return Result<ServiceBookingDto>.Failure(new[] { "Service not found" });
            }

            if (service.Status != ServiceStatus.Active)
            {
                return Result<ServiceBookingDto>.Failure(new[] { "Service is not available for booking" });
            }

            // Generate booking number
            var bookingNumber = await GenerateBookingNumber();

            var booking = new ServiceBooking
            {
                BookingNumber = bookingNumber,
                ScheduledDate = request.Request.ScheduledDate.Date,
                ScheduledTime = request.Request.ScheduledTime,
                Status = BookingStatus.Pending,
                TotalAmount = service.BasePrice,
                Currency = service.Currency,
                CustomerNotes = request.Request.CustomerNotes,
                CustomerAddress = request.Request.CustomerAddress,
                CustomerLatitude = request.Request.CustomerLatitude,
                CustomerLongitude = request.Request.CustomerLongitude,
                IsEmergency = request.Request.IsEmergency,
                EmergencyDetails = request.Request.EmergencyDetails,
                CustomerId = request.CustomerId,
                ServiceId = request.Request.ServiceId,
                ServiceProviderId = service.ServiceProviderId
            };

            await _bookingRepository.AddAsync(booking, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Load the booking with related data for response
            var bookingWithData = await _bookingRepository.GetQueryable()
                .Include(b => b.Customer)
                .Include(b => b.Service)
                .Include(b => b.ServiceProvider)
                .FirstOrDefaultAsync(b => b.Id == booking.Id, cancellationToken);

            var result = new ServiceBookingDto
            {
                Id = booking.Id,
                BookingNumber = booking.BookingNumber,
                ScheduledDate = booking.ScheduledDate,
                ScheduledTime = booking.ScheduledTime,
                ScheduledDateTime = booking.ScheduledDate.Add(booking.ScheduledTime),
                Status = booking.Status,
                StatusName = booking.Status.ToString(),
                TotalAmount = booking.TotalAmount,
                Currency = booking.Currency,
                CustomerNotes = booking.CustomerNotes,
                CustomerAddress = booking.CustomerAddress,
                CustomerLatitude = booking.CustomerLatitude,
                CustomerLongitude = booking.CustomerLongitude,
                IsEmergency = booking.IsEmergency,
                EmergencyDetails = booking.EmergencyDetails,
                CreatedAt = booking.CreatedAt,
                CustomerId = booking.CustomerId,
                CustomerName = $"{bookingWithData?.Customer.FirstName} {bookingWithData?.Customer.LastName}",
                CustomerEmail = bookingWithData?.Customer.Email ?? string.Empty,
                CustomerPhone = bookingWithData?.Customer.PhoneNumber,
                ServiceId = booking.ServiceId,
                ServiceTitle = service.Title,
                ServiceType = service.Type,
                ServiceTypeName = service.Type.ToString(),
                ServiceProviderId = booking.ServiceProviderId,
                ServiceProviderName = service.ServiceProvider.BusinessName,
                ServiceProviderPhone = service.ServiceProvider.ContactPhone,
                HasReview = false
            };

            return Result<ServiceBookingDto>.Success(result);
        }

        private async Task<string> GenerateBookingNumber()
        {
            var prefix = "BK";
            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
            var random = new Random().Next(1000, 9999);
            
            var bookingNumber = $"{prefix}{timestamp}{random}";
            
            // Ensure uniqueness
            var exists = await _bookingRepository.GetQueryable()
                .AnyAsync(b => b.BookingNumber == bookingNumber);
            
            if (exists)
            {
                return await GenerateBookingNumber(); // Recursive call if collision
            }
            
            return bookingNumber;
        }
    }
}