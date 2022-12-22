import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-test-inputs',
  templateUrl: './test-inputs.component.html',
  styleUrls: ['./test-inputs.component.css']
})
export class TestInputsComponent implements ControlValueAccessor {

  @Input() label:string;
  @Input() type='text';
  constructor(@Self() public ngControl:NgControl) {
    this.ngControl.valueAccessor=this;
   }
  writeValue(obj: any): void {
    
  }
  registerOnChange(fn: any): void {
    
  }
  registerOnTouched(fn: any): void {
   
  }



}
