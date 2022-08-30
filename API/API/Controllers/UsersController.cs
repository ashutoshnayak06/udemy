using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
        [Authorize]
        public class UsersController : BaseApiController
    {
       
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        public UsersController(IMapper mapper,IUserRepository userRepository)
        {
            _userRepository=userRepository;
            _mapper=mapper;
        }
       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
             var users=await _userRepository.GetMembersAsync();
   
             return Ok(users);
            
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
             
        }
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user=await _userRepository.GetUserByUsernameAsync(username);
        
            _mapper.Map(memberUpdateDto,user);
            _userRepository.update(user);
            if (await _userRepository.SaveAllAsync() )
            {
                return NoContent();
            }
            return BadRequest("Failed To update user");
        }
       
    }
}