import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { map, Observable, of, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { User } from '../models/user';
import { Userparams } from '../models/userparams';
import { AccountService } from './account.service';
import { take } from 'rxjs';
import { getPaginatedResult, getpaginationHeaders } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl= environment.apiUrl;
  members:Member[]=[];
  memberCache=new Map();
  user:User;
  userParams:Userparams;
  constructor(private httpclint:HttpClient, private accountService:AccountService) {

   this.accountService.currentuser$.pipe(take(1)).subscribe({
      next: (v)=>{
       this.user=v;
       this.userParams=new Userparams(this.user);
      },
      error:(e)=>{
     
      }
    })
   }
getUserParams(){
   return this.userParams;
}
resetUserParams(){
   this.userParams=new Userparams(this.user);
   return this.userParams;
}
setUserParams(params:Userparams){
  this.userParams=params;
}
  
   getMembers(userParams:Userparams)
   {
      var response=this.memberCache.get(Object.values(userParams).join('-'));
      if(response)
      {
          return of(response);
      }
      
      let params=getpaginationHeaders(userParams.pageNumber,userParams.pageSize);
      
      params=params.append('minAge',userParams.minAge.toString());
      params=params.append('maxAge',userParams.maxAge.toString());
      params=params.append('gender',userParams.gender);
      params=params.append('orderBy',userParams.orderBy);
      
      return getPaginatedResult<Member[]>(this.baseUrl+'users', params,this.httpclint)
            .pipe(map(response=>{
               this.memberCache.set(Object.values(userParams).join('-'),response);
               return response;
            }))   
   }
  

   getMember(username:string):Observable<any>
   {
      const member=[...this.memberCache.values()]
                 .reduce((arr,elem)=> arr.concat(elem.result),[])
                 .find((member:Member)=>member.username===username);
      if(member){
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

   addLike(username:string){

      return this.httpclint.post(this.baseUrl+'likes/'+username,{

      });
   }
   getLikes(predicate:string,pageNumber,pageSize){

      let params= getpaginationHeaders(pageNumber,pageSize);
      params=params.append('predicate',predicate);

      return getPaginatedResult<Partial<Member[]>>(this.baseUrl+'likes',params,this.httpclint);
      //return this.httpclint.get<Partial<Member[]>>(this.baseUrl+'likes?predicate='+predicate)
   }
}
