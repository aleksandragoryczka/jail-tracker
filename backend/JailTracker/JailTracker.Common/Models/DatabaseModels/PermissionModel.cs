using System.Text.Json.Serialization;
using JailTracker.Common.Enums;

namespace JailTracker.Common.Models.DatabaseModels;

public class PermissionModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    [JsonIgnore]
    public virtual UserModel User { get; set; }
    public PermissionType PermissionType { get; set; }
    public DateTime GrantDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpirationDate { get; set; }


    public bool IsActive()
    {
        return GrantDate < DateTime.UtcNow && ExpirationDate.GetValueOrDefault(DateTime.MaxValue) > DateTime.UtcNow;
    }
}