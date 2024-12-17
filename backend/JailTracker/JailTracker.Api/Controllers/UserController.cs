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
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IPermissionsService _permissionsService;

    public UserController(IUserService userService, IPermissionsService permissionsService)
    {
        _userService = userService;
        _permissionsService = permissionsService;
    }

    [HttpGet]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.BasicRead)]
    public ActionResult<IEnumerable<UserModel>> GetUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }

    [HttpPost]
    // [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.CreateUser)]
    //[Authorize(Policy = IdentityData.MatchPrisonIdBodyPolicy)]
    public ActionResult<UserModel> CreateUser([FromBody] RegisterDto registerDto)
    {
        UserModel res = _userService.CreateUser(registerDto);

        return Ok(res);
    }

    [HttpPost("CreateOwner")]
    //[Authorize(Policy = IdentityData.GuardUserPolicy)]
    public ActionResult<UserModel> CreateOwner([FromBody] RegisterDto registerDto)
    {
        UserModel res = _userService.CreateUser(registerDto, Role.PrisonOwner);

        return Ok(res);
    }

    [HttpGet("{id}")]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.BasicRead)]
    public ActionResult<UserModel> GetUser(int Id)
    {
        var res = _userService.GetUser(Id);

        if (res == null)
        {
            return NotFound();
        }

        return Ok(res);
    }

    [HttpDelete("{id}")]
    //[Authorize(Policy = IdentityData.GuardUserPolicy)]
    public ActionResult <bool> DeleteUser(int Id)
    {
        return Ok(_userService.DeleteUser(Id));
    }

    [HttpPost("UpdateUserSupervisor")]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    //[Authorize(Policy = IdentityData.MatchPrisonIdBodyPolicy)]
    public ActionResult<bool> UpdateUserSupervisor([FromBody] UpdateUserSupervisorDto updateUserSupervisor)
    {
        bool res = _userService.UpdateUserSupervisor(updateUserSupervisor);
        return Ok(res);
    }

    [HttpPut("{id}")]
    [RequireClaim(IdentityData.PermissionsClaimName, PermissionType.ModifyUser)]
    //[Authorize(Policy = IdentityData.MatchPrisonIdQueryPolicy)]
    public ActionResult<UserModel> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto, [FromQuery] int PrisonId)
    {
        UserModel existingUser = _userService.GetUser(id);

        if (existingUser == null)
        {
            return NotFound();
        }
        UserModel updatedUser = _userService.UpdateUser(existingUser, updateUserDto);
        return Ok(updatedUser);
    }

    [HttpPut("UpdateUserForUser")]
    public ActionResult<UserModel> UpdateUserForUser([FromBody] UpdateUserDto updateUserDto)
    {
        UserModel existingUser = _userService.GetUser(User.Identity.GetUserId());

        if (existingUser == null)
        {
            return NotFound();
        }
        UserModel updatedUser = _userService.UpdateUser(existingUser, updateUserDto);
        return Ok(updatedUser);
    }

    [HttpGet("Users")]
    public ActionResult<IEnumerable<UserModel>> ListAllUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }
}