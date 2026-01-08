namespace Application.Common.Models;

public class ValidationResult
{
    public bool IsValid { get; set; }
    public List<string> Errors { get; set; } = new();
    public Dictionary<string, object> Metadata { get; set; } = new();

    public static ValidationResult Success()
    {
        return new ValidationResult { IsValid = true };
    }

    public static ValidationResult Failure(string error)
    {
        return new ValidationResult 
        { 
            IsValid = false, 
            Errors = new List<string> { error } 
        };
    }

    public static ValidationResult Failure(IEnumerable<string> errors)
    {
        return new ValidationResult 
        { 
            IsValid = false, 
            Errors = errors.ToList() 
        };
    }

    public void AddError(string error)
    {
        Errors.Add(error);
        IsValid = false;
    }
}