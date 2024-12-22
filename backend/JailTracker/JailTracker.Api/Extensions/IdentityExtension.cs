using System.Security.Claims;
using JailTracker.Common.Identity;

namespace JailTracker.Api.Extensions;
public static class IdentityExtension
{
    public static int GetUserId(this System.Security.Principal.IIdentity identity)
    {
        ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
        Claim claim = claimsIdentity?.FindFirst(IdentityData.UserIdClaimName);
        if (claim is not null) return int.Parse(claim.Value);
        else throw new UnauthorizedAccessException();
    }

    public static bool IsGuard(this System.Security.Principal.IIdentity identity)
    {
        ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
        Claim claim = claimsIdentity?.FindFirst(IdentityData.GuardUserClaimName);
        if (claim is not null)
        {
            return true;
        }
        return false;
        
    }
}