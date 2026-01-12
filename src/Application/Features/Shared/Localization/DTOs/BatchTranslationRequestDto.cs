namespace Application.Features.Shared.Localization.DTOs;

public class BatchTranslationRequestDto
{
    public string Culture { get; set; } = string.Empty;
    public IEnumerable<string> Features { get; set; } = Enumerable.Empty<string>();
}