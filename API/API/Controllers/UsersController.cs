using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IPhotoService _photoService;

        public UsersController(IMapper mapper,IUserRepository userRepository
        , IPhotoService photoService)
        {
            _userRepository=userRepository;
            this._photoService = photoService;
            _mapper =mapper;
        }
       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
             var user=await _userRepository.GetUserByUsernameAsync(User.GetUsername());
             userParams.CurrentUsername=User.GetUsername();
             if (string.IsNullOrEmpty(userParams.Gender))
             {
              userParams.Gender=user.Gender=="male"?"female":"male";
             }
             var users=await _userRepository.GetMembersAsync(userParams);
             Response.AddpaginationMember(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);
             return Ok(users);
            
        }

        [HttpGet("{username}",Name ="GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
             
        }
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user=await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        
            _mapper.Map(memberUpdateDto,user);
        
            _userRepository.update(user);
            if (await _userRepository.SaveAllAsync() )
            {
                return NoContent();
            }
            return BadRequest("Failed To update user");
        }
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto([FromForm] IFormFile file)
        {
              var user= await _userRepository.GetUserByUsernameAsync(User.GetUsername());
              var result=await _photoService.AddPhotoAsync(file);

              if (result.Error!=null)
              {
                return BadRequest(result.Error.Message);
              }
              var photo=new Photo{
                Url=result.SecureUrl.AbsoluteUri,
                publicId=result.PublicId
              };
              if (user.Photos?.Count== 0)
              {
                 photo.IsMain=true;
              }
              user.Photos.Add(photo);
              if (await _userRepository.SaveAllAsync())
              {
                //return _mapper.Map<PhotoDto>(photo);
                  return CreatedAtRoute("GetUser",new{username=user.UserName} ,_mapper.Map<PhotoDto>(photo));
                
              }
            return BadRequest("Problem Adding photo");
        }
       
         [HttpPut("set-main-photo/{photoId}")]
         public async Task<ActionResult> SetMainPhoto(int photoId){
          
          var user =await _userRepository.GetUserByUsernameAsync(User.GetUsername());
          var photo=user.Photos.FirstOrDefault(x=>x.Id==photoId);
          if (photo.IsMain)
          {
            return BadRequest("This is already your main photo");
          }
          var currentMain=user.Photos.FirstOrDefault(x=>x.IsMain);
          if (currentMain!=null)
          {
            currentMain.IsMain=false;

          }
          photo.IsMain=true;
          if(await _userRepository.SaveAllAsync()) return NoContent();

          return BadRequest("Failed to Set Main Photo");
         }
         [HttpDelete("delete-photo/{photoId}")]

         public async Task<ActionResult> Deletephoto(int photoId){
              var user= await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo=user.Photos.FirstOrDefault(x=>x.Id==photoId);
            if(photo==null) return NotFound();
            if(photo.IsMain) return BadRequest("You cannot delete your main photo");
            if(photo.publicId!=null)
            {
              var result=await _photoService.DeletePhotoAsync(photo.publicId);
               if (result.Error!=null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);
            if(await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to delete the photo");
         }
    }
}