import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member:Member;
  files: File[] = [];
  baseUrl=environment.apiUrl;
  user:User;
  constructor(private memberService:MembersService,private accountService:AccountService,private toastr:ToastrService) { 
    this.accountService.currentuser$.pipe(take(1)).subscribe(user=>this.user=user);
  }

  ngOnInit( ): void {
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(
      {
        next: (v)=>{
          this.member=v;
         
         },
         error:(e)=>{
        
         }
      }
    );
  }
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  setMainPhoto(photo){
   this.memberService.setMainPhoto(photo.id).subscribe({
    next: ()=>{
      this.user.photoUrl=photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl=photo.url;
      this.member.photos.forEach(p=>{
        if (p.isMain) p.isMain=false;
        if(p.id===photo.id) p.isMain=true;
      })
    },
    error: (e)=>{}
   });
  }
  deletePhoto(photoId:number){
    this.memberService.deletePhoto(photoId).subscribe({
      next: ()=>{
        this.member.photos=this.member.photos.filter(x=>x.id!=photoId);
      },
      error: (e)=>{}
    });
  }
  UploadFiles(){
    if (this.files.length>0) {
      this.files.forEach(item=>{
        this.accountService.UploadFiles(item)
        .subscribe({
          next: (v) =>{console.log(v)
            this.toastr.success('Photo Uploaded Sucessfully');
            this.files=[];
            
            this.loadMember();

            this.accountService.setCurrentUser(this.user);
            
          },
          error: (e) => {console.error(e)
            this.toastr.error(e.error)
          }
        })
      });
    }
   
  }
}
