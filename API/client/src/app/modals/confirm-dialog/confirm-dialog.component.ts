import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  title='';
  message='';
  btnCancelText='';
  btnOkText='';
  result=false;
  constructor(public bdModalRef:BsModalRef) { }

  ngOnInit(): void {
  }

  confirm(){
    this.result=true;
    this.bdModalRef.hide();

  }

  decline(){
    this.bdModalRef.hide();
  }

}
