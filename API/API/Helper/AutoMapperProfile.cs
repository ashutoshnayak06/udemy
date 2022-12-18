using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helper
{
    public class AutoMapperProfile:Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AppUser,MemberDto>()
            .ForMember(dest=>dest.PhotoUrl,opt=>opt.MapFrom(src=>src.Photos.FirstOrDefault(x=>x.IsMain).Url))
            .ForMember(dest=>dest.Age,opt=>opt.MapFrom(src=>src.DateOfBirth.CalculateAge()));
            
            CreateMap<Photo,PhotoDto>();
            CreateMap<MemberUpdateDto,AppUser>();
            CreateMap<RegisterDTO,AppUser>();
            CreateMap<Message,MessageDto>()
                      .ForMember(dest=>dest.SenderPhotoUrl,opt=>opt.MapFrom(src=>
                      src.Sender.Photos.FirstOrDefault(x=>x.IsMain).Url))
                      .ForMember(dest=>dest.RecipientPhotoUrl ,opt=>opt.MapFrom(src=>
                      src.Recipient.Photos.FirstOrDefault(x=>x.IsMain).Url));
            // CreateMap<DateTime,DateTime>().ConstructUsing(d=>DateTime.SpecifyKind(d,DateTimeKind.Utc));
            // CreateMap<DateTime?,DateTime?>().ConstructUsing(d=>d.HasValue? DateTime.SpecifyKind(d.Value,DateTimeKind.Utc):null);
        }
    }
}