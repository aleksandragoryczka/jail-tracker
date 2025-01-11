using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JailTracker.Attributes;
using JailTracker.Api.Extensions;
using JailTracker.Common.Dto;
using JailTracker.Common.Enums;
using JailTracker.Common.Identity;
using JailTracker.Common.Interfaces;
using JailTracker.Common.Models.DatabaseModels;

namespace JailTracker.Api.Controllers;

[Route("api/[controller]")]
//[Authorize]
[AllowAnonymous]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// DONE
    /// </summary>s
    /// <param name="registerDto"></param>
    /// <returns></returns>
    [HttpPost]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CreateUser)]
    //[Authorize(Policy =  IdentityData.AdminUserClaimName)]
    public ActionResult<UserModel> CreateUser([FromBody] RegisterDto registerDto)
    {
        UserModel res = _userService.CreateUser(registerDto);

        return Ok(res);
    }

    /// <summary>
    /// DONE - DISPLAY USER'S PROFILE DETAILS and Guard's details
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public ActionResult<UserModel> GetUserProfile(int id)
    {
        var user = _userService.GetUser(id);

        if (user == null)
        {
            return NotFound();
        }
        
        return Ok(user);
    }

    /// <summary>
    /// DONE - Admin panel
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    //[Authorize(Policy = IdentityData.AdminUserPolicy)]
    public ActionResult<bool> DeleteUser(int id)
    {
        return Ok(_userService.DeleteUser(id));
    }

    /// <summary>
    /// DONE - Admin panel
    /// </summary>
    /// <param name="updateUserDto"></param>
    /// <returns></returns>
    [HttpPost("UpdateUserSupervisor")]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    public ActionResult<bool> UpdateUserSupervisor([FromBody] UpdateUserSupervisorDto updateUserSupervisor)
    {
        bool res = _userService.UpdateUserSupervisor(updateUserSupervisor);
        return Ok(res);
    }
    
    /// <summary>
    /// DONE - User's profoile - update name, surname, password
    /// </summary>
    /// <param name="updateUserDto"></param>
    /// <returns></returns>
    [HttpPut("UpdateUserForUser")]
    public ActionResult<UserModel> UpdateUserForUser([FromBody] UpdateUserDto updateUserDto)
    {
        UserModel existingUser = _userService.GetUser(User.Identity.GetUserId());

        if (existingUser == null)
        {
            return NotFound();
        }
        UserModel updatedUser = _userService.UpdateUser(existingUser, updateUserDto);
        if (updatedUser == null)
        {
            return BadRequest("Provided current password is incorrect.");
        }
        return Ok(updatedUser);
    }

    [HttpPut("ResetUserPassword")]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    public ActionResult<UserModel> ResetUserPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        UserModel updatedUser = _userService.ResetUserPassword(resetPasswordDto.Id, resetPasswordDto.Password);
        return Ok(updatedUser);
    }

    /// <summary>
    /// DONE - Admin's Panel - udpating User's supervisor - to list all available supervisors
    /// </summary>
    /// <returns></returns>
    [HttpGet("GetAllSupervisors")]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    public ActionResult<List<UserModel>> GetAllSupervisors()
    {
        List<UserModel> allSupervisors = _userService.GetActiveUsersByRole(Role.Guard);
        return Ok(allSupervisors);
    }
    
    /// <summary>
    /// DONE - Admin's Panel - udpating User's supervisor - to list all available priosners
    /// </summary>
    /// <returns></returns>
    [HttpGet("GetAllPrisoners")]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    public ActionResult<List<UserModel>> GetAllPrisoners()
    {
        List<UserModel> allPrisoners = _userService.GetActiveUsersByRole(Role.User);
        return Ok(allPrisoners);
    }

    [HttpPost("CheckEmailExists")]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    public ActionResult<bool> CheckEmailExists([FromBody] EmailCheckDto emailCheckDto)
    {
        bool emailExists = _userService.UserEmailExists(emailCheckDto.Email);
        return Ok(emailExists); 
    }

    [HttpGet("GetAllUsers")]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    public ActionResult<List<UserModel>> GetAllUsers()
    {
        List<UserModel> allUsers = _userService.GetAllUsers();
        return Ok(allUsers);
    }

    [HttpPut("SetUserSupervisor")]
    //[RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    public ActionResult<UserModel> SetUserSupervisor([FromBody] SetSupervisorDto setSupervisorDto)
    {
        UserModel updatedUser = _userService.SetUserSupervisor(setSupervisorDto.UserId, setSupervisorDto.SupervisorId);
        return Ok(updatedUser);
    }
}

public class EmailCheckDto
{
    public string Email { get; set; }
}

public class ResetPasswordDto
{
    public int Id { get; set; }
    public string Password { get; set; }
}

public class SetSupervisorDto
{
    public int UserId { get; set; }
    public int SupervisorId { get; set; }
}