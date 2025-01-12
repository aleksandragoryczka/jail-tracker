using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Common.Interfaces;

public interface IUserService
{
    UserModel CreateUser(RegisterDto registerDto);
    UserModel GetUser(int Id);
    bool DeleteUser(int id);
    UserModel UpdateUser(UserModel existingUser, UpdateUserDto updateUserDto);
    bool UpdateUserSupervisor(UpdateUserSupervisorDto updateUserSupervisor);
    List<UserModel> GetActiveUsersByRole(Role role);
    bool UserEmailExists(string email);
    List<UserModel> GetAllUsers();
    UserModel ResetUserPassword(int id, string newPassword);
}