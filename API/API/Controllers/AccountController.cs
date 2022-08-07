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
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController:BaseApiController
    {
        private readonly DataContext _context;
        ITokenService _tokenService;
        public AccountController(DataContext context,ITokenService tokenService)
        {
            _context=context;
            _tokenService=tokenService;   
        }
        [HttpPost("Register")]

        public async Task<ActionResult<UserDto>> Register(RegisterDTO rdto)
        {
            
            using var hmac=new HMACSHA512();
            if(await UserExists(rdto.Username)){
                return BadRequest("Username is Taken");

            }
            var user=new AppUser{

                UserName=rdto.Username.ToLower(),
                PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(rdto.Password)),
                PasswordSalt=hmac.Key
            };

            _context.User.Add(user);
            await _context.SaveChangesAsync();
             return new UserDto{
                    Username=user.UserName,
                    Token=_tokenService.CreateToken(user)
                };

        }
        [HttpPost("login")]
         public async Task<ActionResult<UserDto>>Login(LoginDTO rdto)
         {
                var user=await _context.User.SingleOrDefaultAsync(x=>x.UserName==rdto.Username);
                if(user==null) return Unauthorized("Invalid Username");
                using var hmac=new HMACSHA512(user.PasswordSalt);
                var computedhasg=hmac.ComputeHash(Encoding.UTF8.GetBytes(rdto.Password));
                for (int i = 0; i < computedhasg.Length; i++)
                {
                    if (computedhasg[i]!=user.PasswordHash[i])
                    {
                        return Unauthorized("Invalid password");
                    }
                }
                return new UserDto{
                    Username=user.UserName,
                    Token=_tokenService.CreateToken(user)
                };
         }

        private async Task<bool> UserExists(string Username)
        {
            return await _context.User.AnyAsync(x=>x.UserName==Username.ToLower());
        }
    }
}