using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController:BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        ITokenService _tokenService;
        public AccountController(IMapper mapper, UserManager<AppUser> userManager,ITokenService tokenService)
        {
            this._mapper = mapper;
            _userManager =userManager;
            _tokenService=tokenService;   
        }
        [HttpPost("Register")]

        public async Task<ActionResult<UserDto>> Register(RegisterDTO rdto)
        {
            
            
            if(await UserExists(rdto.Username)){
                return BadRequest("Username is Taken");

            }
             var user=_mapper.Map<AppUser>(rdto);
           

            user.UserName=rdto.Username.ToLower();
                
            
            var result=await _userManager.CreateAsync(user,rdto.Password);
            if(!result.Succeeded) return BadRequest(result.Errors);
             
            var roleResult=await _userManager.AddToRoleAsync(user,"Member");

            if(!roleResult.Succeeded) return BadRequest(result.Errors);

             return new UserDto{
                    Username=user.UserName,
                    Token=await _tokenService.CreateToken(user),
                    KnownAs=user.KnownAs,
                    Gender=user.Gender
                };

        }
        [HttpPost("login")]
         public async Task<ActionResult<UserDto> >Login(LoginDTO rdto)
         {
                var user=await _userManager.Users.Include(x=>x.Photos).SingleOrDefaultAsync(x=>x.UserName==rdto.Username);
                if(user==null) return Unauthorized("Invalid Username");
            
               var result=await _userManager.CheckPasswordAsync(user,rdto.Password);
                
                if(!result) return Unauthorized("Inavalif Password");
             
                return new UserDto{
                    Username=user.UserName,
                    Token=await _tokenService.CreateToken(user),
                    photoUrl=user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
                    KnownAs=user.KnownAs,
                    Gender=user.Gender
                };
         }

        private async Task<bool> UserExists(string Username)
        {
            return await _userManager.Users.AnyAsync(x=>x.UserName==Username.ToLower());
        }
    }
}