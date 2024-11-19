using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace JailTracker.Common.Models.DatabaseModels;

[Index(nameof(UrlName), IsUnique = true)]
public class PrisonModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
    [Required]
    public string UrlName { get; set; }
    [JsonIgnore]
    public virtual ICollection<UserModel> Users { get; set; }
}