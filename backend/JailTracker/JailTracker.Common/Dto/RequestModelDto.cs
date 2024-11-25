using JailTracker.Common.Enums;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Common.Dto;

public class RequestModelDto
{
    public RequestModelDto(RequestModel requestModel)
    {
        Id = requestModel.Id;
        FromDate = requestModel.FromDate;
        ToDate = requestModel.ToDate;
        RequestType = requestModel.RequestType;
        UserId = requestModel.UserId;
        UserFirstName = requestModel.User?.FirstName;
        UserLastName = requestModel.User?.LastName;
        SupervisorFirstName = requestModel.RequestSupervisor?.FirstName;
        SupervisorLastName = requestModel.RequestSupervisor?.LastName;
        ApprovalState = requestModel.ApprovalState;
        TimeOffSupervisorId = requestModel.RequestSupervisorId;
    }
    public Guid Id { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public RequestType RequestType { get; set; }
    public int UserId { get; set; }
    public string UserFirstName { get; set; }
    public string UserLastName { get; set; }
    public string SupervisorFirstName { get; set; }
    public string SupervisorLastName { get; set; }
    public ApprovalState ApprovalState { get; set; }
    public int? TimeOffSupervisorId { get; set; }
}