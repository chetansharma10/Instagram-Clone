import { Component, DoCheck, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.css']
})
export class ErrorHandlerComponent implements OnInit {
  showError:boolean=false;
  @Input() messageError!:string;
  @ViewChild('selectionError') selectionError!:ElementRef;
   constructor() { }

  ngOnInit(): void {
  
    window.addEventListener('offline',()=>{
      
      this.showError=true;
      this.messageError="You'are Offline,Please check your Internet Connection "
    })
  }

 
  
  toggleError(){
  

    
    (this.selectionError.nativeElement as HTMLDivElement)
    .style.transition="1s ease";

    (this.selectionError.nativeElement as HTMLDivElement)
    .style.bottom="-50px";


    setTimeout(()=>{
      this.showError=!this.showError;
    },2000);
  
  }

}
