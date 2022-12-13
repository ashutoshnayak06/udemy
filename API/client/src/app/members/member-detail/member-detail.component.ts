import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,AfterViewInit {
  member:Member={} as Member;
  @ViewChild('memberTabs',{static:true}) memberTabs?:TabsetComponent;
  // galleryOptions: NgxGalleryOptions[];
  // galleryImages: NgxGalleryImage[];
  images: GalleryItem[];
  activeTab?:TabDirective;
  messages:Message[]=[];
  constructor(private memberService:MembersService,private router:ActivatedRoute,private messageService:MessageService) { }
 
  ngAfterViewInit(): void {
   
 
  }

  ngOnInit(): void {
    this.router.data.subscribe(
      {
        next:(dat)=>{this.member=dat['member'];}
      }
    )
    this.router.queryParams.subscribe(
      {
        next:(params=>{
          params['tab']&& this.selectTab((params['tab']))
        })
      }
    );
    this.loadMenber();
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
  selectTab(heading:string){
    if(this.memberTabs){
       this.memberTabs.tabs.find(x=>x.heading===heading).active=true;
    }
  }

  loadMessages(){
    if(this.member){
      this.messageService.getMessageThread(this.member.username).subscribe(
      {
        next:(messages)=>{this.messages=messages;}
      }
        
      );
    }
  }

  onTabActivated(data:TabDirective){
  this.activeTab=data;
  if(this.activeTab.heading==='Messages'){
    this.loadMessages();
  }
  }
}
