using JailTracker.Database;
using Microsoft.EntityFrameworkCore;

namespace JailTracker.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddCustomDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var conn = configuration.GetConnectionString("Default");
        services.AddDbContext<ApplicationDbContext>(options => { options.UseNpgsql(conn); });
    }
}