using JailTracker.Common.Enums;

namespace JailTracker.Common.Dto
{
    public class CreateRequestDto
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public bool IsActive { get; set; }
        public RequestType RequestType { get; set; }
        public Guid? TimeOffSupervisorId { get; set; }
    }
}
