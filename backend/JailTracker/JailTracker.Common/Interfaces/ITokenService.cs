using JailTracker.Common.Dto;

namespace JailTracker.Common.Interfaces;

public interface ITokenService
{
    public bool TryAuthenticateUser(LoginDto loginData, out string token);
}