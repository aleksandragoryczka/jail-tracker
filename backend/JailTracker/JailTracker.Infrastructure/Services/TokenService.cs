using JailTracker.Common.Dto;
using JailTracker.Common.Interfaces;

namespace JailTracker.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        public bool TryAuthenticateUser(LoginDto loginData, out string token)
        {
            // Authenticate everyone and return the dummy token "dupadupa"
            token = "xd";
            return true;
        }
    }
}