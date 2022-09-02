import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';



@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl= environment.apiUrl;
  members:Member[]=[];
  constructor(private httpclint:HttpClient) { }

   getMembers()
   {
      if (this.members.length>0) {
         return of(this.members);
      }
      return this.httpclint.get<Member[]>(this.baseUrl+'users')
      .pipe(map(members=>{
         this.members=members
         return members;
      }));
   }
   getMember(username:string):Observable<any>
   {
      const member=this.members.find(x => x.username===username);
      if (member!==undefined) {
         return of(member);
      }
      return this.httpclint.get<Member>(this.baseUrl+'users/'+username);
   }
   updateMember(member:Member){
      return this.httpclint.put(this.baseUrl+'users',member).pipe(
         map(()=>{
            const index=this.members.indexOf(member);
            this.members[index]=member;
         })
      );
   }
   setMainPhoto(photoId:number){
      return this.httpclint.put(this.baseUrl+'users/set-main-photo/'+photoId,{});
   }
   deletePhoto(photoId:number){
     return this.httpclint.delete(this.baseUrl+'users/delete-photo/'+photoId);
   }
}
