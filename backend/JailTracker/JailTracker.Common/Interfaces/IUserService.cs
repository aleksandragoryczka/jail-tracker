using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Common.Interfaces;

public interface IUserService
{
    UserModel CreateUser(RegisterDto registerDto, Role role = Role.User);
    UserModel GetUser(int Id);
    bool DeleteUser(int Id);
    UserModel UpdateUser(UserModel existingUser, UpdateUserDto updateUserDto);
    bool UpdateUserSupervisor(UpdateUserSupervisorDto updateUserSupervisor);
    IEnumerable<UserModel> GetAllUsers();
}