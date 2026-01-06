namespace Application.Features.Shared.Localization.Interfaces
{
    public interface ICultureInfoProvider
    {
        Task<object> GetCultureInfoAsync(string language);
    }
}
