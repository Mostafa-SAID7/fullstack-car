namespace Infrastructure.Common;

public class DuplicatePreventionOptions
{
    public const string SectionName = "DuplicatePrevention";
    
    public double SimilarityThreshold { get; set; } = 0.8;
    public int CheckWindowHours { get; set; } = 24;
    public bool EnableTitleCheck { get; set; } = true;
    public bool EnableContentCheck { get; set; } = true;
    public bool EnableTagCheck { get; set; } = true;
    public int MaxSuggestionsCount { get; set; } = 5;
}