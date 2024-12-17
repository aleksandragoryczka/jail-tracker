using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using JailTracker.Common.Enums;

namespace JailTracker.Common.Models.DatabaseModels;

[Index(nameof(Email), IsUnique = true)]
public class UserModel
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    [JsonIgnore]
    public byte[] Password { get; set; }
    public bool IsActive { get; set; }
    public Role Role { get; set; } = Role.User;
    //public int? PrisonId { get; set; }
    //[JsonIgnore]
    //public virtual PrisonModel Prison { get; set; }
    public int? CurrentRequestsSupervisorId { get; set; }
    [JsonIgnore]
    public virtual UserModel CurrentRequestsSupervisor { get; set; }
    [JsonIgnore]
    public virtual ICollection<UserModel> SupervisedPrisoners { get; set; }
    [JsonIgnore]
    public virtual ICollection<PermissionModel> Permissions { get; set; }
    [JsonIgnore]
    public virtual ICollection<RequestModel> Requests { get; set; }
    [JsonIgnore]
    public virtual ICollection<RequestModel> RequestsSupervised { get; set; }
}