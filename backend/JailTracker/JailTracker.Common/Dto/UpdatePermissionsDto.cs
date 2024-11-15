using JailTracker.Common.Enums;

namespace JailTracker.Common.Dto;

public class UpdatePermissionsDto
{
    public int UserId { get; set; }
    public int prisonId { get; set; }
    public List<PermissionType> PermissionTypes { get; set; }
}