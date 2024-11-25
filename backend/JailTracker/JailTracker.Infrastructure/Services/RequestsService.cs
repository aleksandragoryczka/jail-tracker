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
            var supervisor = _context.Users.Where(x => x.Id == supervisorId).First();
            if (supervisor == null)
            {
                throw new ArgumentException("Supervisor not found");
            }

            var request = _context.Requests
                .Where(x => x.IsActive)
                .Where(x => x.Id == requestApprovalState.RequestId)
                .Where(x => x.PassSupervisorId == supervisorId)
                .FirstOrDefault();

            if (request == default) return default;

            request.ApprovalState = requestApprovalState.ApprovalState;
            _context.SaveChanges();

            return request;
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
            var fromDateUtc = requestDto.FromDate.ToUniversalTime();
            var toDateUtc = requestDto.ToDate.ToUniversalTime();

            RequestModel newRequest = new RequestModel
            {
                Id = Guid.NewGuid(),
                FromDate = fromDateUtc,
                ToDate = toDateUtc,
                IsActive = true,
                UserId = userId,
                ApprovalState = ApprovalState.Pending,
                PassSupervisorId = user.CurrentPassesSupervisor.Id,
                RequestType = requestDto.RequestType
            };

            _context.Add(newRequest);
            _context.SaveChanges();
            return newRequest;
        }
    }
}
