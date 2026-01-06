using Domain.Base;

namespace Domain.ValueObjects.Shared;

public class DateRange : ValueObject
{
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }

    private DateRange() { } // For EF Core

    public DateRange(DateTime startDate, DateTime endDate)
    {
        if (startDate > endDate)
            throw new ArgumentException("Start date cannot be after end date");

        StartDate = startDate;
        EndDate = endDate;
    }

    public bool Contains(DateTime date) => date >= StartDate && date <= EndDate;

    public bool Overlaps(DateRange other) => StartDate <= other.EndDate && EndDate >= other.StartDate;

    public TimeSpan Duration => EndDate - StartDate;

    public int DaysCount => (int)Math.Ceiling(Duration.TotalDays);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return StartDate;
        yield return EndDate;
    }

    public override string ToString() => $"{StartDate:yyyy-MM-dd} to {EndDate:yyyy-MM-dd}";
}
