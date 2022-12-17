import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseurl=environment.apiUrl;
  private currentuserSource=new ReplaySubject<User>(1);

  currentuser$=this.currentuserSource.asObservable();
  constructor(private http:HttpClient,private presenceService:PresenceService) { }

  login(model:any){
    return this.http.post(this.baseurl+'account/login',model).pipe(
      map((res:User)=>{
        const user=res;
        if(user)
        {
         
          this.setCurrentUser(user);
        }
      })
    )
  }
  register(model:any){
    return this.http.
    post(this.baseurl+'account/register',model)
    .pipe(map((user:User)=>{
      if(user){
         
        this.setCurrentUser(user);
      }
 
    }));

  }
  setCurrentUser(user:User)
  {
    user!.roles=[];
    const roles=this.getDecodedToken(user.token).role;
    Array.isArray(roles)?user.roles=roles:user.roles.push(roles);
    
    localStorage.setItem('user',JSON.stringify(user) );
    this.currentuserSource.next(user);

    this.presenceService.createHubConnection(user);
  }


  logout(){
    localStorage.removeItem('user');
    this.currentuserSource.next(null);

    this.presenceService.stopConnection();
  }

  UploadFiles(file:File){
    const formData = new FormData();
    formData.append('File', file);
   return this.http.post(this.baseurl+'users/add-photo',formData)
  }

  getDecodedToken(token:string){
   return JSON.parse(atob(token.split('.')[1]))
  }
}
