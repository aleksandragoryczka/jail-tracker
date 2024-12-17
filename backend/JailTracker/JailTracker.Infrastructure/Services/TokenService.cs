using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Identity;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using JailTracker.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace JailTracker.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IEncodeService _encodeService;
        private readonly IConfiguration _configuration;

        public TokenService(ApplicationDbContext dbContext, IEncodeService encodeService, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _encodeService = encodeService;
            _configuration = configuration;
        }
        public bool TryAuthenticateUser(LoginDto loginData, out string token)
        {
            token = String.Empty;
            try
            {
                if (loginData == null || string.IsNullOrEmpty(loginData.Email) || string.IsNullOrEmpty(loginData.Password))
                    return false;

                var userModel = _dbContext.Users.Where(x => x.Email == loginData.Email && x.IsActive).Include(x => x.Permissions).FirstOrDefault();

                if (userModel is null)
                    return false;

                if (!_encodeService.VerifyUser(userModel.Password, loginData.Password))
                    return false;

                token = CreateToken(userModel);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private string CreateToken(UserModel userModel)
        {
            var x = _configuration["JwtSettings:Key"];
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(x!));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha512Signature);
            var tokeOptions = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: GetUserClaims(userModel),
#if DEBUG
                expires: DateTime.UtcNow.AddHours(3),
#else
                expires: DateTime.UtcNow.AddHours(1),
#endif
                signingCredentials: signinCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return tokenString;
        }

        private static List<Claim> GetUserClaims(UserModel user)
        {
            var claims = new List<Claim>
            {
                new Claim(IdentityData.UserIdClaimName, user.Id.ToString())
            };

            if (user.Role == Role.PrisonOwner)
                claims.Add(new Claim(IdentityData.OwnerUserClaimName, "true"));
            else if (user.Role == Role.Guard)
                claims.Add(new Claim(IdentityData.GuardUserClaimName, "true"));

            AddPermissionClaims(claims, user);
            return claims;
        }

        private static void AddPermissionClaims(List<Claim> claims, UserModel user)
        {
            /*if (!user.OrganizationId.HasValue) return;
            
            claims.Add(new Claim(IdentityData.OrganizationIdClaimName, user.OrganizationId.ToString()));*/

            if (user.Permissions == null) return;
            
            var userPerms = user.Permissions.Where(x => x.IsActive());

            foreach (var perm in userPerms)
            {
                claims.Add(new Claim(IdentityData.PermissionsClaimName, perm.PermissionType.ToString()));
            }
        }
    }
}