namespace Domain.Rules
{
    public class ServiceCanBeBookedRule : BusinessRule
    {
        private readonly bool _isServiceActive;
        private readonly bool _isProviderActive;
        private readonly bool _isTimeSlotAvailable;
        private readonly DateTime _bookingDate;

        public ServiceCanBeBookedRule(bool isServiceActive, bool isProviderActive, bool isTimeSlotAvailable, DateTime bookingDate)
        {
            _isServiceActive = isServiceActive;
            _isProviderActive = isProviderActive;
            _isTimeSlotAvailable = isTimeSlotAvailable;
            _bookingDate = bookingDate;
        }

        public override bool IsBroken()
        {
            return !_isServiceActive || 
                   !_isProviderActive || 
                   !_isTimeSlotAvailable || 
                   _bookingDate <= DateTime.UtcNow;
        }

        public override string Message => "Service cannot be booked due to availability or status restrictions.";
    }
}