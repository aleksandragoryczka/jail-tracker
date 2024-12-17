using JailTracker.Common.Enums;

namespace JailTracker.Common.Dto;

public class CreatePrisonDto
{
    public string Name { get; set; }
    public string UrlName { get; set; }
    public bool IsActive { get; set; } = true;
}