import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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


  constructor(public accountservices: AccountService, private router:Router,private toastr:ToastrService) { }

  ngOnInit(): void {
    //this.getCurrentUser();
  }
  login(){
    this.accountservices.login(this.model)
    .subscribe(
      {
        next: (v) => {
         this.router.navigateByUrl('/members');
          
        },
        error: (e) => {console.error(e)
        this.toastr.error(e.error)
        }

    }
    );

  }
  logout(){
    this.accountservices.logout();
    this.router.navigateByUrl('/');
   
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
