import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import {AccountService} from '../services/account.service'
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any={}
  loggedin:boolean;


  constructor(public accountservices: AccountService) { }

  ngOnInit(): void {
    //this.getCurrentUser();
  }
  login(){
    this.accountservices.login(this.model)
    .subscribe(
      {
        next: (v) => {
          console.log(v)
          
        },
        error: (e) => console.error(e)
    }
    );

  }
  logout(){
    this.accountservices.logout();
   
  }

  getCurrentUser(){
    // this.accountservices.currentuser$.subscribe(
    //   { next: user=>{
    //     this.loggedin=!!user;
    //   },
    //   error:res=>console.log(res)
    // }
     
    //)
  }
}
