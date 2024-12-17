using JailTracker.Common.Dto;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using JailTracker.Database;
using Microsoft.EntityFrameworkCore;

namespace JailTracker.Infrastructure.Services;

public class PermissionsService : IPermissionsService
{
    private readonly ApplicationDbContext _context;

    public PermissionsService(ApplicationDbContext context)
    {
        _context = context;
    }


    public bool UpdatePermissions(UpdatePermissionsDto updatePermissionsDto)
    {
        var user = _context.Users
            .Where(x => x.Id == updatePermissionsDto.UserId)
            //.Where(x => x.PrisonId == updatePermissionsDto.prisonId)
            .Include(x => x.Permissions)
            .FirstOrDefault();

        if (user == null) return false;

        var permissionsToRemove = user.Permissions
            .Where(x => x.IsActive())
            .Where(x => !updatePermissionsDto.PermissionTypes.Contains(x.PermissionType));
        foreach (var perm in permissionsToRemove)
        {
            perm.ExpirationDate = DateTime.UtcNow;
        }

        var permissionsToAdd = updatePermissionsDto.PermissionTypes
            .Where(x => !user.Permissions.Any(z => z.IsActive() && z.PermissionType == x));
        foreach (var permType in permissionsToAdd)
        {
            var newPermission = new PermissionModel() { 
                PermissionType = permType, 
                UserId = user.Id, 
                GrantDate = DateTime.UtcNow
            };
            user.Permissions.Add(newPermission);
        }

        _context.SaveChanges();

        return true;
    }
}