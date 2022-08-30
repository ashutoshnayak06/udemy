import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';
import { GalleryItem, ImageItem } from 'ng-gallery';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,AfterViewInit {
  member:Member;
  // galleryOptions: NgxGalleryOptions[];
  // galleryImages: NgxGalleryImage[];
  images: GalleryItem[];
  constructor(private memberService:MembersService,private router:ActivatedRoute) { }
 
  ngAfterViewInit(): void {
   
 
  }

  ngOnInit(): void {
    this.loadMenber()

    // this.galleryOptions=[
    //   {
    //     width:'500px',
    //     height:'500px',
    //     imagePercent:100,
    //     thumbnailsColumns:4,
    //     imageAnimation:NgxGalleryAnimation.Slide,
    //     preview:false

    //   }
    // ]
    
  }
  getImages(){
   this.images=[];
   for(const photo of this.member.photos){
     this.images.push(new ImageItem({ src:photo.url, thumb: photo.url }))
   }
  
  }
   loadMenber(){
    this.memberService.getMember(this.router.snapshot.paramMap.get('username')).subscribe(
      {
        next: (v) => {
        this.member=v;
          if(this.member){
             this.getImages(); 
          }
        },
        error: (e) => {
        }

    }

    );

     
    
  }
}
