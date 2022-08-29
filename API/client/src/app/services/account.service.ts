import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseurl=environment.apiUrl;
  private currentuserSource=new ReplaySubject<User>(1);

  currentuser$=this.currentuserSource.asObservable();
  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post(this.baseurl+'account/login',model).pipe(
      map((res:User)=>{
        const user=res;
        if(user)
        {
          localStorage.setItem('user',JSON.stringify(user) );
          this.currentuserSource.next(user);
        }
      })
    )
  }
  register(model:any){
    return this.http.
    post(this.baseurl+'account/register',model)
    .pipe(map((user:User)=>{
      if(user){
         
        localStorage.setItem('user',JSON.stringify(user));
        this.currentuserSource.next(user);
      }
 
    }));

  }
  setCurrentUser(user:User)
  {
    this.currentuserSource.next(user);
  }


  logout(){
    localStorage.removeItem('user');
    this.currentuserSource.next(null);
  }
}
