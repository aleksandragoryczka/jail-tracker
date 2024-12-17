using JailTracker.Common.Enums;

namespace JailTracker.Common.Dto;

public class RegisterDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public Role Role { get; set; } = Role.User;
    public int? SupervisorId { get; set; }
    public int? prisonId { get; set; }
}