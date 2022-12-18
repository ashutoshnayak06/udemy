import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl=environment.hubUrl;
  private hubConnection?;HubConnection;
  private onlineUserSource=new BehaviorSubject<string[]>([]);
  onlineUsers=this.onlineUserSource.asObservable();


  constructor(private toastr:ToastrService,private router:Router) { }

  createHubConnection(user:User){
   this.hubConnection=new HubConnectionBuilder()
   .withUrl(this.hubUrl+'presence',{
    accessTokenFactory:()=>user.token
   })
   .withAutomaticReconnect()
   .build()

   this.hubConnection.start().catch(error=>console.log(error));
   this.hubConnection.on('UserIsOnline',username=>{
    this.onlineUsers.pipe(take(1)).subscribe({
      next:usernames=>this.onlineUserSource.next([...usernames,username])
    });
   })

   this.hubConnection.on('UserIsOffline',username=>{
    this.onlineUsers.pipe(take(1)).subscribe({
      next:usernames=>this.onlineUserSource.next(usernames.filter(x=>x !==username))
    });
   })

   this.hubConnection.on('GetOnlineUsers',username=>{
    this.onlineUserSource.next(username);
   })

   this.hubConnection.on('NewMessageRecieved',({username,knownAs})=>{
    this.toastr.info(knownAs+' has sent you anew message! Click me to see it')
    .onTap
    .pipe(take(1))
    .subscribe({
      next:()=> this.router.navigateByUrl('/members/'+username+'?tab=Messages')
    })
   });
  }



  stopConnection(){
    this.hubConnection.stop().catch(error=>console.log(error));
  }
}
