using Domain.Rules;

namespace Domain.Rules.Community.Maps
{
    public class LocationMustHaveValidCoordinatesRule : IBusinessRule
    {
        private readonly double _latitude;
        private readonly double _longitude;

        public LocationMustHaveValidCoordinatesRule(double latitude, double longitude)
        {
            _latitude = latitude;
            _longitude = longitude;
        }

        public string Message => "Location must have valid coordinates";

        public bool IsBroken()
        {
            return _latitude < -90 || _latitude > 90 ||
                   _longitude < -180 || _longitude > 180;
        }
    }
}