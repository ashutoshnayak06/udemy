import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model:any={};
  
  @Output() cancelRegister=new EventEmitter();
  constructor(private accountService:AccountService) { }

  ngOnInit(): void {
    console.log("Register Component");
  }
  register(){
    this.accountService.register(this.model)
    .subscribe({
      next: (v) =>{console.log(v)
      this.cancel()},
      error: (e) => console.error(e)
    }
     
    )
  }
  cancel(){
    this.cancelRegister.emit(false);
  }

}
