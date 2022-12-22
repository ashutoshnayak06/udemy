using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController:BaseApiController
    {
        private readonly IMapper _mapper;
        // private readonly IUserRepository _userRepository;
        // private readonly IMessageRepository _messageRepository;

         private readonly IUnitofWork _uow;
        public MessagesController(IMapper mapper, IUnitofWork uow)
        {
            _uow=uow;
            
        }

        [HttpPost]

        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username=User.GetUsername();

            if(username==createMessageDto.RecipientUsername.ToLower())
                return BadRequest("You cannot send message to yourself");

            var sender =await _uow.UserRepository.GetUserByUsernameAsync(username);
             var recipient=await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

             if(recipient==null) return NotFound();

             var message=new Message{
                Sender=sender,
                Recipient=recipient,
                SenderUsername=sender.UserName,
                RecipentUsername=recipient.UserName,
                Content=createMessageDto.Content
             };

             _uow.MessageRepository.AddMessage(message);            
             
             if(await _uow.Complete()) return Ok(_mapper.Map<MessageDto>(message));

             return BadRequest("Failed to send message");
        }

        [HttpGet]

        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageparams)
        {
            messageparams.Username=User.GetUsername();

            var messages=await _uow.MessageRepository.GetMessagesForUser(messageparams);
            Response.AddpaginationMember(messages.CurrentPage,messages.PageSize,
            messages.TotalCount,messages.TotalPages);
            return messages;
        }

  

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id){

            var username=User.GetUsername();

            var message=await _uow.MessageRepository.GetMessage(id);

            if(message.SenderUsername!=username 
            && message.RecipentUsername!=username)
             return Unauthorized();

            if(message.SenderUsername==username) message.SenderDeleted=true;
            if(message.RecipentUsername==username) message.RecipientDeleted=true;

            if(message.SenderDeleted&&message.RecipientDeleted)
            {
                _uow.MessageRepository.DeleteMessage(message);
            }
            if(await _uow.Complete()) return Ok();
            return BadRequest("Problrm deleting the message");

        }
        
    }
}