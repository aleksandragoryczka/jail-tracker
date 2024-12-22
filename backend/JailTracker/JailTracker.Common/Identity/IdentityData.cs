namespace JailTracker.Common.Identity;

public static class IdentityData
{
    public const string GuardUserClaimName = "guard";
    public const string AdminUserClaimName = "admin";
    public const string UserIdClaimName = "userId";
    public const string PermissionsClaimName = "permissions";

    public const string AdminUserPolicy = "Admin";
    public const string CreateUserPolicy = "CreateUserPolicy";
}