import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,AfterViewInit {
  member:Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private memberService:MembersService,private router:ActivatedRoute) { }
 
  ngAfterViewInit(): void {
   
 
  }

  ngOnInit(): void {
    this.loadMenber()
    this.galleryOptions=[
      {
        width:'500px',
        height:'500px',
        imagePercent:100,
        thumbnailsColumns:4,
        imageAnimation:NgxGalleryAnimation.Slide,
        preview:false

      }
    ]
    
  }
  getImages(){
   const ImageUrls=[];
   for(const photo of this.member.photos){
      ImageUrls.push({
        small:photo?.url,
        medium:photo?.url,
        big:photo?.url
      })
   }
   return ImageUrls;
  }
   loadMenber(){
    this.memberService.getMember(this.router.snapshot.paramMap.get('username')).subscribe(
      {
        next: (v) => {
        this.member=v;
          if(this.member){
            this.galleryImages=this.getImages(); 
          }
        },
        error: (e) => {
        }

    }

    );

     
    
  }
}
