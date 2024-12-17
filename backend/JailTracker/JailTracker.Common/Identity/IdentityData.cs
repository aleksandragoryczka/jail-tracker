namespace JailTracker.Common.Identity;

public static class IdentityData
{
    public const string GuardUserClaimName = "guard";
    public const string OwnerUserClaimName = "owner";
    public const string UserIdClaimName = "userId";
    public const string PermissionsClaimName = "permissions";


    public const string GuardUserPolicy = "Guard";
    public const string CreateUserPolicy = "CreateUserPolicy";
    public const string MatchPrisonIdQueryPolicy = "MatchPrisonIdQueryPolicy";
    public const string MatchPrisonIdBodyPolicy = "MatchPrisonIdBodyPolicy";
}