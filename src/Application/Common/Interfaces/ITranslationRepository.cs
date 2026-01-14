namespace Application.Common.Interfaces;

/// <summary>
/// Repository interface for managing translation resources with caching support
/// </summary>
public interface ITranslationRepository
{
    /// <summary>
    /// Gets all translations for a specific culture and feature
    /// </summary>
    /// <param name="culture">Culture code (e.g., en-US, ar-EG)</param>
    /// <param name="feature">Feature name (e.g., posts, groups, qa)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dictionary of translation keys and values</returns>
    Task<Dictionary<string, string>> GetTranslationsAsync(string culture, string feature, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets translations for multiple features in a single culture
    /// </summary>
    /// <param name="culture">Culture code</param>
    /// <param name="features">List of feature names</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dictionary with feature names as keys and translation dictionaries as values</returns>
    Task<Dictionary<string, Dictionary<string, string>>> GetBatchTranslationsAsync(string culture, IEnumerable<string> features, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a specific translation by key with fallback logic
    /// </summary>
    /// <param name="culture">Culture code</param>
    /// <param name="key">Translation key (supports hierarchical keys with dot notation)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Translation value or fallback value</returns>
    Task<string?> GetTranslationAsync(string culture, string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates if all required translation keys exist for a culture and feature
    /// </summary>
    /// <param name="culture">Culture code</param>
    /// <param name="feature">Feature name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if all keys are present, false otherwise</returns>
    Task<bool> ValidateTranslationCompletenessAsync(string culture, string feature, CancellationToken cancellationToken = default);

    /// <summary>
    /// Invalidates cached translations for a specific culture and feature
    /// </summary>
    /// <param name="culture">Culture code (null to invalidate all cultures)</param>
    /// <param name="feature">Feature name (null to invalidate all features)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task InvalidateCacheAsync(string? culture = null, string? feature = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all supported cultures
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of supported culture codes</returns>
    Task<IEnumerable<string>> GetSupportedCulturesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all available features for a culture
    /// </summary>
    /// <param name="culture">Culture code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of available feature names</returns>
    Task<IEnumerable<string>> GetAvailableFeaturesAsync(string culture, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new translation
    /// </summary>
    Task<object> CreateTranslationAsync(string key, string value, string culture, string feature, string? description = null, bool isActive = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing translation
    /// </summary>
    Task<object> UpdateTranslationAsync(string id, string key, string value, string culture, string feature, string? description = null, bool isActive = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a translation
    /// </summary>
    Task<bool> DeleteTranslationAsync(string id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets translations that were updated after a certain date
    /// </summary>
    Task<IEnumerable<object>> GetTranslationUpdatesAsync(string culture, IEnumerable<string> features, DateTime since, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all physical resource files and their metadata
    /// </summary>
    Task<IEnumerable<Application.Features.Shared.Localization.DTOs.ResourceFileDto>> GetResourceFilesAsync(CancellationToken cancellationToken = default);
}