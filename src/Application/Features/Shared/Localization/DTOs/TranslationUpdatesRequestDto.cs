namespace Application.Features.Shared.Localization.DTOs;

public class TranslationUpdatesRequestDto
{
    public IEnumerable<string> Features { get; set; } = Enumerable.Empty<string>();
    public DateTime Since { get; set; }
}
