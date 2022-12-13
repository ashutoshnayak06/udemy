import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { Pagination } from '../models/pagination';
import { MembersService } from '../services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  predicate='liked';
  pageNumber=1;
  pageSize=5;
  pagination:Pagination;
  constructor(private memberService:MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.memberService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe(
      {
        next: (v) => {
          this.members=v.result;
          this.pagination=v.pagination;
          },
          error: (e) => {
          }
      }
    )
  }
  pageChanged(event: any){
     this.pageNumber=event.page;
     this.loadLikes();
  }

}
