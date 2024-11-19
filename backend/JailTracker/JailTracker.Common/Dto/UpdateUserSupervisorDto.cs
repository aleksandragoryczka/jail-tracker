namespace JailTracker.Common.Dto;

public class UpdateUserSupervisorDto
{
    public int prisonId { get; set; }
    public int UserId { get; set; }
    public int NewSupervisorId { get; set; }
}