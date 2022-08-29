import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';



@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl= environment.apiUrl;
  constructor(private httpclint:HttpClient) { }

   getMembers()
   {
      return this.httpclint.get<Member[]>(this.baseUrl+'users');
   }
   getMember(username:string):Observable<any>
   {
      return this.httpclint.get<Member>(this.baseUrl+'users/'+username);
   }
}
