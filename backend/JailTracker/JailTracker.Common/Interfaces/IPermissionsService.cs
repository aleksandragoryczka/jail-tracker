using JailTracker.Common.Dto;
using JailTracker.Common.Enums;

namespace JailTracker.Common.Interfaces;

public interface IPermissionsService
{
    bool UpdatePermissions(UpdatePermissionsDto updatePermissionsDto);
    bool VerifyPermissionDatabase(int userId, PermissionType permType, int? prisonId);
}