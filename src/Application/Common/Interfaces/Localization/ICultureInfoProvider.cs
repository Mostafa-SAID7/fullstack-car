namespace Application.Common.Interfaces.Localization
{
    public interface ICultureInfoProvider
    {
        Task<object> GetCultureInfoAsync(string language);
    }
}
