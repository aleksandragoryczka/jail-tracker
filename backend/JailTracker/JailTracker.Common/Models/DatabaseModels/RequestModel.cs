using System.Text.Json.Serialization;
using JailTracker.Common.Enums;

namespace JailTracker.Common.Models.DatabaseModels;

public class RequestModel
{
    public Guid Id { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public bool IsActive { get; set; }
    public int UserId { get; set; }
    [JsonIgnore]
    public virtual UserModel User { get; set; }
    public ApprovalState ApprovalState { get; set; }
    public int? PassSupervisorId { get; set; }
    public RequestType RequestType { get; set; }
    [JsonIgnore]
    public virtual UserModel PassSupervisor { get; set; }
}