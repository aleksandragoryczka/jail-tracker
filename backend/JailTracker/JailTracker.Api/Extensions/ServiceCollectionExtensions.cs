using JailTracker.Common.Interfaces;
using JailTracker.Database;
using JailTracker.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace JailTracker.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddCustomDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var conn = configuration.GetConnectionString("Default");
        services.AddDbContext<ApplicationDbContext>(options => { options.UseNpgsql(conn); });
    }

    public static void AddCustomServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton(configuration);
        services.AddScoped<IRequestsService, RequestsService>();
    }
}