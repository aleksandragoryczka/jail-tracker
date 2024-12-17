using System.Security.Cryptography;
using System.Text;
using JailTracker.Common.Interfaces;

namespace JailTracker.Infrastructure.Services;

public class EncodeService : IEncodeService
{
    private const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";
    public byte[] EncodePassword(string password)
    {
        return Encoding.UTF8.GetBytes(BCrypt.Net.BCrypt.HashPassword(password));
    }

    public bool VerifyUser(byte[] userPassword, string loginPassword)
    {
#if DEBUG
        return true;
#endif
        return BCrypt.Net.BCrypt.Verify(loginPassword, Encoding.UTF8.GetString(userPassword));
    }

    public string GeneratePassword(int length)
    {
        var randomBytes = new byte[length];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
            
        var sb = new StringBuilder(length);
        foreach (var b in randomBytes)
        {
            sb.Append(validChars[b % validChars.Length]);
        }
        return sb.ToString();

    }
}