import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';
import { PresenceService } from 'src/app/services/presence.service';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,AfterViewInit,OnDestroy {
  member:Member={} as Member;
  @ViewChild('memberTabs',{static:true}) memberTabs?:TabsetComponent;
  // galleryOptions: NgxGalleryOptions[];
  // galleryImages: NgxGalleryImage[];
  images: GalleryItem[];
  activeTab?:TabDirective;
  messages:Message[]=[];
  user: User={} as User;


  constructor(private accountService:AccountService,
     private memberService:MembersService,
    private router:ActivatedRoute,
    private messageService:MessageService,
    public presenceService:PresenceService,
    private route:Router) { 
    
      this.accountService.currentuser$.pipe(take(1)).subscribe(
        {
          next:(user)=>{
            if (user) this.user=user;
            
          }
        }
      );

      this.route.routeReuseStrategy.shouldReuseRoute=()=>false;
   

    }
  ngOnDestroy(): void {
   this.messageService.stopHubConnection();
  }
 
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
  if(this.activeTab.heading==='Messages'&&this.user){
    this.messageService.createHubConnection(this.user,this.member.username)
  }
  else{
    this.messageService.stopHubConnection();
  }


  }
}
