import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmService } from '../services/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsaveChangesGuard implements CanDeactivate<any> {
  
  constructor(private confirmService:ConfirmService){

  }
  canDeactivate(component: MemberEditComponent): Observable<boolean> {
    if (component.editForm.dirty) {
      return this.confirmService.confirm();
    }
    return of(true);
  }

  
}
