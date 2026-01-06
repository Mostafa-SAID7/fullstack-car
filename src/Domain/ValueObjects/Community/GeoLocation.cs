using Domain.Base;
using Domain.Exceptions;

namespace Domain.ValueObjects.Community
{
    public class GeoLocation : ValueObject
    {
        public double Latitude { get; private set; }
        public double Longitude { get; private set; }

        public GeoLocation(double latitude, double longitude)
        {
            if (latitude < -90 || latitude > 90)
                throw new InvalidValueObjectException("Latitude must be between -90 and 90 degrees");

            if (longitude < -180 || longitude > 180)
                throw new InvalidValueObjectException("Longitude must be between -180 and 180 degrees");

            Latitude = latitude;
            Longitude = longitude;
        }

        public double DistanceTo(GeoLocation other)
        {
            const double earthRadius = 6371; // Earth's radius in kilometers

            var lat1Rad = ToRadians(Latitude);
            var lat2Rad = ToRadians(other.Latitude);
            var deltaLatRad = ToRadians(other.Latitude - Latitude);
            var deltaLonRad = ToRadians(other.Longitude - Longitude);

            var a = Math.Sin(deltaLatRad / 2) * Math.Sin(deltaLatRad / 2) +
                    Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
                    Math.Sin(deltaLonRad / 2) * Math.Sin(deltaLonRad / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return earthRadius * c;
        }

        private static double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Latitude;
            yield return Longitude;
        }

        public override string ToString()
        {
            return $"{Latitude}, {Longitude}";
        }
    }
}
