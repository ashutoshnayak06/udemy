import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  message?:Message[];
  pagination?: Pagination;
  container='Unread';
  pageNumber=1;
  pageSize=5;
  loading=false;
  constructor(private messageService:MessageService) { }

  ngOnInit(): void {
  this.loadMessages();
  }
  loadMessages(){
    this.loading=true;
    this.messageService.getMessage(this.pageNumber,this.pageSize,this.container).subscribe(
      {
        next: (res)=>{
          this.message=res.result;
          this.pagination=res.pagination;
          this.loading=false;
        },
        error: (e)=>{}
      }
    )
  }

  deleteMessage(id:number)
  {
     this.messageService.deleteMessage(id).subscribe({
      next:()=>{
        this.message.splice(this.message.findIndex(m=>m.id===id),1);
      }
     })
  }
  pageChanged(event:any){
    if(this.pageNumber!==event.page){
       this.pageNumber=event.page;
       this.loadMessages();
    }  

  }

}
