namespace Domain.Enums.Shared;

public enum ErrorCategory
{
    Application = 1,
    Database = 2,
    Network = 3,
    Authentication = 4,
    Authorization = 5,
    Validation = 6,
    Business = 7,
    Infrastructure = 8,
    ThirdParty = 9,
    Unknown = 10
}
