namespace Application.Features.Admin.Styles.DTOs;

public class StyleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Css { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}