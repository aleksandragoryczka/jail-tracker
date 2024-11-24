using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using JailTracker.Database;

namespace JailTracker.Infrastructure.Services
{
    public class RequestsService : IRequestsService
    {
        private readonly ApplicationDbContext _context;

        public RequestsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public RequestModel SetApprovalState(RequestApprovalStateDto requestApprovalState, int supervisorId)
        {
            var absence = _context.Requests
                .Where(x => x.IsActive)
                .Where(x => x.Id == requestApprovalState.AbsenceId)
                .Where(x => x.PassSupervisorId == supervisorId)
                .FirstOrDefault();

            if (absence == default) return default;

            absence.ApprovalState = requestApprovalState.ApprovalState;
            _context.SaveChanges();

            return absence;
        }

        public RequestModel CreateRequest(int userId, CreateRequestDto requestDto)
        {
            var user = _context.Users.Where(x => x.Id == userId).First();
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            if (user.CurrentPassesSupervisor == null)
            {
                throw new ArgumentException("CurrentPassesSupervisor is not assigned to the user");
            }
            RequestModel newRequest = new RequestModel
            {
                Id = Guid.NewGuid(),
                FromDate = requestDto.FromDate,
                ToDate = requestDto.ToDate,
                IsActive = true,
                UserId = userId,
                ApprovalState = ApprovalState.Pending,
                //PassSupervisorId = user.CurrentPassesSupervisor.Id,
                PassSupervisorId = 1,
                RequestType = requestDto.RequestType
            };

            _context.Add(newRequest);
            _context.SaveChanges();
            return newRequest;
        }
    }
}
