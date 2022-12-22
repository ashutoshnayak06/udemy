import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { Userparams } from 'src/app/models/userparams';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
   
  members : Member[];
  pagination:Pagination;
  pageSize=5;
  userParams:Userparams;
  user:User;
  genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}]
  constructor(private memberService: MembersService) { 
      this.userParams=this.memberService.getUserParams();
  }
  resetFilters(){
    this.userParams=this.memberService.resetUserParams();
    this.loadMembers();
  }
  ngOnInit(): void {
    this.loadMembers();
  }
  pageChanged(event:any){
      this.userParams.pageNumber=event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
  }
  loadMembers(){
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(
      {
        next: (res)=>{
          this.members=res.result;
          this.pagination=res.pagination;
        },
        error: (e)=>{}
      }
    )
  }

}
