import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { GalleryModule } from 'ng-gallery';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker'
import {PaginationModule} from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimeagoModule } from 'ngx-timeago';
import { ModalModule } from 'ngx-bootstrap/modal';

// import {NgxGalleryModule} from '@kolkov/ngx-gallery';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass:'toast-bottom-right'
    }),
    TabsModule.forRoot(),
    GalleryModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    ModalModule.forRoot()
    //TimeagoModule.forRoot()
    // NgxGalleryModule
  ],
  exports:[
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    GalleryModule,
    BsDatepickerModule,
    PaginationModule,
    ButtonsModule,
    ModalModule
    //TimeagoModule
    // NgxGalleryModule
  ]
})
export class SharedModule { }
