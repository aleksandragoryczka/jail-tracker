using System.Text;
using JailTracker.Common.Enums;
using JailTracker.Common.Identity;
using JailTracker.Common.Interfaces;
using JailTracker.Database;
using JailTracker.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace JailTracker.Api.Extensions;

public static class ServiceCollectionExtensions
{
    
    public static void AddCustomAuth(this IServiceCollection services, IConfiguration config)
        {
            if (string.IsNullOrEmpty(config["JwtSettings:Issuer"])
                    || string.IsNullOrEmpty(config["JwtSettings:Audience"])
                    || string.IsNullOrEmpty(config["JwtSettings:Key"]))
                throw new SecurityTokenException("Settings are empty");

            services
                .AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {

                    x.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidIssuer = config["JwtSettings:Issuer"],
                        ValidAudience = config["JwtSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!)),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true
                    };
                });

            /*services.AddAuthorization(options =>
            {
                options.AddPolicy(IdentityData.AdminUserPolicy, policy => policy.RequireClaim(IdentityData.AdminUserClaimName, "true"));

                options.AddPolicy(IdentityData.CreateUserPolicy,
                    policy => policy
                    .RequireClaim(IdentityData.OrganizationIdClaimName)
                    .RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CreateUser.ToString()));

                options.AddPolicy(IdentityData.MatchOrganizationIdQueryPolicy, policy => policy.Requirements.Add(new MatchOrganizationQueryRequirement()));
                options.AddPolicy(IdentityData.MatchOrganizationIdBodyPolicy, policy => policy.Requirements.Add(new MatchOrganizationBodyRequirement()));
            });*/
        }
    
    public static void AddCustomDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var conn = configuration.GetConnectionString("Default");
        services.AddDbContext<ApplicationDbContext>(options => { options.UseNpgsql(conn); });
    }

    public static void AddCustomServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton(configuration);
        
        services.AddScoped<IRequestsService, RequestsService>();
        services.AddScoped<IRequestsManagementService, RequestsManagementService>();
        services.AddScoped<IEncodeService, EncodeService>();
        services.AddScoped<IPermissionsService, PermissionsService>();
        services.AddScoped<IPrisonService, PrisonService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITokenService, TokenService>();

    }
}