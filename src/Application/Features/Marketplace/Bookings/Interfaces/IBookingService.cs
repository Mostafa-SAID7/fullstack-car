using Application.Common.Models;
using Domain.Entities.Marketplace;

namespace Application.Features.Marketplace.Bookings.Interfaces
{
    public interface IBookingService
    {
        Task<Result<ServiceBooking>> GetBookingByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<ServiceBooking>>> GetBookingsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<ServiceBooking>>> GetUserBookingsAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Result<ServiceBooking>> CreateBookingAsync(ServiceBooking booking, CancellationToken cancellationToken = default);
        Task<Result<ServiceBooking>> UpdateBookingAsync(ServiceBooking booking, CancellationToken cancellationToken = default);
        Task<Result> CancelBookingAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result> ConfirmBookingAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result> CompleteBookingAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
