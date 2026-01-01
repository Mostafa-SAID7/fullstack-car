namespace Domain.ValueObjects.Marketplace;

public class Rating : ValueObject
{
    public int Value { get; private set; }
    public int MaxValue { get; private set; }

    private Rating() { } // For EF Core

    public Rating(int value, int maxValue = 5)
    {
        if (value < 0)
            throw new ArgumentException("Rating value cannot be negative", nameof(value));
        
        if (value > maxValue)
            throw new ArgumentException($"Rating value cannot exceed {maxValue}", nameof(value));
        
        if (maxValue <= 0)
            throw new ArgumentException("Max value must be positive", nameof(maxValue));

        Value = value;
        MaxValue = maxValue;
    }

    public double Percentage => MaxValue > 0 ? (double)Value / MaxValue * 100 : 0;
    
    public bool IsExcellent => Value >= MaxValue * 0.8;
    public bool IsGood => Value >= MaxValue * 0.6;
    public bool IsAverage => Value >= MaxValue * 0.4;
    public bool IsPoor => Value < MaxValue * 0.4;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
        yield return MaxValue;
    }

    public override string ToString() => $"{Value}/{MaxValue}";
}