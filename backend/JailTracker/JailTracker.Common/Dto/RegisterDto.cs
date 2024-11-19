namespace JailTracker.Common.Dto;

public class RegisterDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public int? SupervisorId { get; set; }
    public int? prisonId { get; set; }
}