namespace JailTracker.Common.Interfaces;

public interface IEncodeService
{
    byte[] EncodePassword(string password);
    bool VerifyUser(byte[] userPassword, string loginPassword);
    string GeneratePassword(int length);
}