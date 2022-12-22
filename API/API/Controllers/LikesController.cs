using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Extensions;
using API.Helper;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
   [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUnitofWork _uow;

        // private readonly IUserRepository _userRepository;
        // private readonly ILikesRepository _likesRepository;

        public LikesController(IUnitofWork uow)
        {
            _uow = uow;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username){
            var sourceUserId=User.GetUserId();
            var likedUser=await _uow.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser=await _uow.LikesRepository.GetUserWithLikes(sourceUserId);

            if (likedUser==null)
            {
                return NotFound();
            }
            if (sourceUser.UserName==username)
            {
                return BadRequest("You Cannnot like yourself");
            }  

            var userLike=await _uow.LikesRepository.GetUserLike(sourceUserId,likedUser.Id);

            if (userLike!=null)
            {
                return BadRequest("You Already Like this user");
            }

            userLike=new Entities.UserLike{
                SourceUserId=sourceUserId,
                LikedUserId=likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Falied to like a user");

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        { 
          likesParams.UserId=  User.GetUserId();
          var users= await _uow.LikesRepository.GetUserLikes(likesParams);
          
          
          Response.AddpaginationMember(users.CurrentPage,users.PageSize,
          users.TotalCount,users.TotalPages);
          return Ok(users);
        }
    }
}