using Domain.Base;
using System.Text.RegularExpressions;

namespace Domain.ValueObjects.Identity
{
    public class PhoneNumber : ValueObject
    {
        public string Value { get; private set; }

        private PhoneNumber(string value)
        {
            Value = value;
        }

        public static PhoneNumber Create(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                throw new ArgumentException("Phone number cannot be empty", nameof(phoneNumber));

            var cleanedNumber = CleanPhoneNumber(phoneNumber);
            
            if (!IsValidPhoneNumber(cleanedNumber))
                throw new ArgumentException("Invalid phone number format", nameof(phoneNumber));

            return new PhoneNumber(cleanedNumber);
        }

        private static string CleanPhoneNumber(string phoneNumber)
        {
            return Regex.Replace(phoneNumber, @"[^\d+]", "");
        }

        private static bool IsValidPhoneNumber(string phoneNumber)
        {
            // Basic validation for international phone numbers
            var phoneRegex = new Regex(@"^\+?[1-9]\d{1,14}$");
            return phoneRegex.IsMatch(phoneNumber);
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }

        public static implicit operator string(PhoneNumber phoneNumber) => phoneNumber.Value;
        public override string ToString() => Value;
    }
}
