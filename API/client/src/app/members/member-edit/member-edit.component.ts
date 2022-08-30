import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm;
  member:Member;
  user:User;
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander($event:any) {
      if (this.editForm.dirty) {
        $event.returnValue=true;
      }
  }
  constructor(private accountService:AccountService, 
    private memberService:MembersService,
    private toastr:ToastrService) { 

    this.accountService.currentuser$.pipe(take(1)).subscribe({
      next: (v)=>{
       this.user=v;
      },
      error:(e)=>{
     
      }
    })
  }

  ngOnInit(): void {
    console.log("Member Edit Compent");
    this.loadMember();
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
  updateMember(){
    this.memberService.updateMember(this.member).subscribe({
      next: (v)=>{
        this.toastr.success('Profile Updated Successfully');
        this.editForm.reset(this.member);
      },
      error: (e)=>{

      }
    })
   
  }
}
