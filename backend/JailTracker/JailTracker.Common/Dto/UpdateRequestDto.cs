using JailTracker.Common.Enums;

namespace JailTracker.Common.Dto;

public class UpdateRequestDto
{
    public Guid RequestId { get; set; }
    public DateTime? NewFromDate { get; set; }
    public DateTime? NewToDate { get; set; }
    public RequestType NewRequestType { get; set; }
}