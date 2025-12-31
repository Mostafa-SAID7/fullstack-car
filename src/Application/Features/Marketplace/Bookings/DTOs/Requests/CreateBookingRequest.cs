using System.ComponentModel.DataAnnotations;

namespace Application.Features.Marketplace.Bookings.DTOs.Requests
{
    public class CreateBookingRequest
    {
        [Required]
        public Guid ServiceId { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        [Required]
        public TimeSpan ScheduledTime { get; set; }

        [MaxLength(1000)]
        public string? CustomerNotes { get; set; }

        [MaxLength(500)]
        public string? CustomerAddress { get; set; }

        public double? CustomerLatitude { get; set; }
        public double? CustomerLongitude { get; set; }

        public bool IsEmergency { get; set; } = false;

        [MaxLength(1000)]
        public string? EmergencyDetails { get; set; }
    }
}