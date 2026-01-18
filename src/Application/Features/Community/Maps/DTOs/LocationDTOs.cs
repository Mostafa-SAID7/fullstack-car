namespace Application.Features.Community.Maps.DTOs
{
    public class GetLocationsQuery
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Category { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? RadiusKm { get; set; }
    }

    public class CreateLocationRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? Category { get; set; }
    }

    public class UpdateLocationRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? Category { get; set; }
    }

    public class CheckInRequest
    {
        public string? Comment { get; set; }
        public bool ShareLocation { get; set; } = false;
    }

    public class CreateLocationReviewRequest
    {
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }

    public class SearchLocationsQuery
    {
        public string SearchTerm { get; set; } = string.Empty;
        public string? Category { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? RadiusKm { get; set; }
        public int MaxResults { get; set; } = 20;
    }
}