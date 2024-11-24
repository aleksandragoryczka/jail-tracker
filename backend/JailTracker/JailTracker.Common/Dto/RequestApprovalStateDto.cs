using JailTracker.Common.Enums;

namespace JailTracker.Common.Dto
{
    public class RequestApprovalStateDto
    {
        public Guid AbsenceId { get; set; }
        public ApprovalState ApprovalState { get; set; }
    }
}
