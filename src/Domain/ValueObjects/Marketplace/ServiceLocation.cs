namespace Domain.ValueObjects.Marketplace;

public class ServiceLocation : ValueObject
{
    public string Address { get; private set; }
    public string City { get; private set; }
    public string State { get; private set; }
    public string ZipCode { get; private set; }
    public string Country { get; private set; }
    public double Latitude { get; private set; }
    public double Longitude { get; private set; }

    private ServiceLocation() { } // For EF Core

    public ServiceLocation(string address, string city, string state, string zipCode, 
        string country, double latitude, double longitude)
    {
        if (string.IsNullOrWhiteSpace(address))
            throw new ArgumentException("Address cannot be empty", nameof(address));
        
        if (string.IsNullOrWhiteSpace(city))
            throw new ArgumentException("City cannot be empty", nameof(city));

        if (latitude < -90 || latitude > 90)
            throw new ArgumentException("Latitude must be between -90 and 90", nameof(latitude));
        
        if (longitude < -180 || longitude > 180)
            throw new ArgumentException("Longitude must be between -180 and 180", nameof(longitude));

        Address = address;
        City = city;
        State = state;
        ZipCode = zipCode;
        Country = country;
        Latitude = latitude;
        Longitude = longitude;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Address;
        yield return City;
        yield return State;
        yield return ZipCode;
        yield return Country;
        yield return Latitude;
        yield return Longitude;
    }

    public override string ToString() => $"{Address}, {City}, {State} {ZipCode}, {Country}";
}