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
  private getpaginationHeaders(pageNumber:number,pageSize:number)
  {

   let params=new HttpParams()
   
      params= params.append("pageNumber",pageNumber.toString());
      params= params.append("pageSize",pageSize.toString());
      return params;
  }
   getMembers(userParams:Userparams)
   {
      var response=this.memberCache.get(Object.values(userParams).join('-'));
      if(response)
      {
          return of(response);
      }
      
      let params=this.getpaginationHeaders(userParams.pageNumber,userParams.pageSize);
      
      params=params.append('minAge',userParams.minAge.toString());
      params=params.append('maxAge',userParams.maxAge.toString());
      params=params.append('gender',userParams.gender);
      params=params.append('orderBy',userParams.orderBy);
      
      return this.getPaginatedResult<Member[]>(this.baseUrl, params)
            .pipe(map(response=>{
               this.memberCache.set(Object.values(userParams).join('-'),response);
               return response;
            }))   
   }
   private getPaginatedResult<T>(url,params) {
      const paginatedResult:PaginatedResult<T> = new PaginatedResult<T>();
      return this.httpclint.get<T>(this.baseUrl + 'users', { observe: 'response', params })
         .pipe(
            map(response => {
               paginatedResult.result = response.body;
               if (response.headers.get("Pagination") !== null) {
                  paginatedResult.pagination = JSON.parse(response.headers.get("pagination"));

               }
               return paginatedResult;
            })
         );
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
}
