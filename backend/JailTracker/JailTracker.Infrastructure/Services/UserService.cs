using System.Security.Cryptography;
using System.Text;
using JailTracker.Common.Dto;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;
using JailTracker.Common.Enums;
using JailTracker.Database;
using Microsoft.EntityFrameworkCore;

namespace JailTracker.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        private readonly IEncodeService _encodeService;

        private readonly IEmailService _emailService;

        public UserService(ApplicationDbContext context, IEncodeService encodeService, IEmailService emailService)
        {
            _context = context;
            _encodeService = encodeService;
            _emailService = emailService;
        }

        public UserModel CreateUser(RegisterDto registerDto)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                string generatedPassword = registerDto.Password;
                if (registerDto.Role != Role.PrisonAdmin)
                {
                    generatedPassword = _encodeService.GeneratePassword(16);
                }

                var newUser = new UserModel
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    Password = HashPassword(generatedPassword),
                    Role = registerDto.Role,
                    IsActive = true,
                    CurrentRequestsSupervisorId = registerDto.SupervisorId
                };

                newUser.Permissions = new List<PermissionModel>();

                var perm = new PermissionModel()
                {
                    PermissionType = PermissionType.BasicRead,
                    GrantDate = DateTime.UtcNow
                };

                newUser.Permissions.Add(perm);

                if (newUser.Role == Role.Guard)
                {
                    var supervisePerm = new PermissionModel
                    {
                        PermissionType = PermissionType.CanSupervise,
                        GrantDate = DateTime.UtcNow
                    };
                    newUser.Permissions.Add(supervisePerm);
                }

                if (newUser.Role == Role.PrisonAdmin)
                {
                    var adminPerm = new PermissionModel()
                    {
                        PermissionType = PermissionType.CreateUser, GrantDate = DateTime.UtcNow
                    };
                    newUser.Permissions.Add(adminPerm);
                    adminPerm = new PermissionModel()
                    {
                        PermissionType = PermissionType.DeleteUser, GrantDate = DateTime.UtcNow
                    };
                    newUser.Permissions.Add(adminPerm);
                    adminPerm = new PermissionModel()
                    {
                        PermissionType = PermissionType.ModifyUser, GrantDate = DateTime.UtcNow
                    };
                    newUser.Permissions.Add(adminPerm);
                }

                if (newUser.Role == Role.User)
                {
                    var supervisor = FindSupervisorWithFewestSupervised();
                    if (supervisor != null)
                    {
                        newUser.CurrentRequestsSupervisorId = supervisor.Id;
                        newUser.CurrentRequestsSupervisor = supervisor;
                    }
                }

                _context.Users.Add(newUser);
                _context.SaveChanges();

                transaction.Commit();

                _emailService.SendEmail(newUser.Email, "Account created",
                    CreateBodyForPasswordMessage(generatedPassword));

                return newUser;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public UserModel GetUser(int id)
        {
            return _context.Users.Find(id);
        }

        public bool DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return false;
            }

            if (user.Role == Role.User)
            {
                var userRequests = _context.Requests
                    .Where(r => r.UserId == id)
                    .ToList();

                _context.Requests.RemoveRange(userRequests);
            }
            else
            {
                var supervisedUsers = _context.Users
                    .Where(u => u.CurrentRequestsSupervisorId == id)
                    .ToList();

                var selectedSupervisor = FindSupervisorWithFewestSupervised(id);

                if (selectedSupervisor != null)
                {
                    foreach (var supervisedUser in supervisedUsers)
                    {
                        supervisedUser.CurrentRequestsSupervisorId = selectedSupervisor.Id;
                        supervisedUser.CurrentRequestsSupervisor = selectedSupervisor;
                    }

                    var requestsToUpdateSupervisor = _context.Requests
                        .Where(r => r.RequestSupervisorId == id)
                        .ToList();

                    foreach (var request in requestsToUpdateSupervisor)
                    {
                        request.RequestSupervisorId = selectedSupervisor.Id;
                    }
                }
            }

            _context.SaveChanges();
            _context.Users.Remove(user);
            _context.SaveChanges();

            return true;
        }

        private UserModel FindSupervisorWithFewestSupervised(int? userId = null)
        {
            var availableSupervisors = _context.Users
                .Where(u => u.Role == Role.Guard)  
                .ToList();

            if (userId.HasValue)
            {
                availableSupervisors = availableSupervisors
                    .Where(u => u.Id != userId.Value)
                    .ToList();
            }

            var supervisorWithFewestSupervised = availableSupervisors
                .Select(u => new
                {
                    Supervisor = u,
                    SupervisedCount = _context.Users.Count(s => s.CurrentRequestsSupervisorId == u.Id) 
                })
                .OrderBy(x => x.SupervisedCount) 
                .FirstOrDefault();  

            return supervisorWithFewestSupervised?.Supervisor;  
        }


        public bool UpdateUserSupervisor(UpdateUserSupervisorDto updateUserSupervisorDto)
        {
            var user = _context.Users
                .Include(x => x.CurrentRequestsSupervisor)
                .Where(x => x.Id == updateUserSupervisorDto.UserId)
                .FirstOrDefault();

            if (user == null) return false;

            var newSupervisor = _context.Users
                .Where(x => x.Id == updateUserSupervisorDto.CurrentRequestsSupervisorId)
                .FirstOrDefault();

            if (newSupervisor == null) return false;

            user.CurrentRequestsSupervisorId = updateUserSupervisorDto.CurrentRequestsSupervisorId;
            user.CurrentRequestsSupervisor = newSupervisor;

            _context.Users.Update(user);
            _context.SaveChanges();

            return true;
        }

        public List<UserModel> GetActiveUsersByRole(Role role)
        {
            var users = _context.Users
                .Where(u => u.Role == role)
                .Where(u => u.IsActive);
            return users.ToList();
        }

        public List<UserModel> GetAllUsers()
        {
            var users = _context.Users
                .Where(u => u.IsActive);
            return users.ToList();
        }

        public bool UserEmailExists(string email)
        {
            return _context.Users.Any(u => u.Email == email);
        }

        public UserModel UpdateUser(UserModel existingUser, UpdateUserDto updateUserDto)
        {
            if (!String.IsNullOrEmpty(updateUserDto.FirstName) && !String.IsNullOrEmpty(updateUserDto.LastName))
            {
                existingUser.FirstName = updateUserDto.FirstName;
                existingUser.LastName = updateUserDto.LastName;
            }

            if (!String.IsNullOrEmpty(updateUserDto.Password) && !String.IsNullOrEmpty(updateUserDto.CurrentPassword))
            {
                if(!_encodeService.VerifyUser(existingUser.Password, updateUserDto.CurrentPassword))
                {
                    return null;
                }
                existingUser.Password = HashPassword(updateUserDto.Password);
            }

            _context.SaveChanges();

            return existingUser;
        }

        public UserModel ResetUserPassword(int id, string password)
        {
            var user = GetUser(id);
            user.Password = HashPassword(password);
            _context.Users.Update(user);
            _context.SaveChanges();
            return user;
        }
        
        private byte[] HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                return sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private string CreateBodyForPasswordMessage(string pass)
        {
            string res = @"
<body>
	<h1>New Password Created</h1>
	<p>Your new password is: <strong>" + pass + @"</strong></p>
	<p>Please make sure to keep this password safe and do not share it with anyone.</p>
    <p>You can later update your password under `Profile` tab after you log in.</p>
	<p>If this is a mistake please ignore this message.</p>
</body>";
            return res;
        }
    }
}