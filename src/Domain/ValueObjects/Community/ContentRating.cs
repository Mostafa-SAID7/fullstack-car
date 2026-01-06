using Domain.Base;
using Domain.Exceptions;

namespace Domain.ValueObjects.Community
{
    public class ContentRating : ValueObject
    {
        public int Value { get; private set; }
        public int MaxValue { get; private set; }

        public ContentRating(int value, int maxValue = 5)
        {
            if (value < 1 || value > maxValue)
                throw new InvalidValueObjectException($"Rating must be between 1 and {maxValue}");

            if (maxValue < 1)
                throw new InvalidValueObjectException("Max value must be at least 1");

            Value = value;
            MaxValue = maxValue;
        }

        public decimal Percentage => (decimal)Value / MaxValue * 100;

        public string ToStars()
        {
            return new string('★', Value) + new string('☆', MaxValue - Value);
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
            yield return MaxValue;
        }

        public override string ToString()
        {
            return $"{Value}/{MaxValue}";
        }

        public static implicit operator int(ContentRating rating)
        {
            return rating.Value;
        }

        public static implicit operator ContentRating(int value)
        {
            return new ContentRating(value);
        }
    }
}
