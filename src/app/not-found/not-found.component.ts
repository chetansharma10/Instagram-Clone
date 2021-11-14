import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
   <div 
      style="display:flex;width:100%;height:100vh;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      "
   
   >
    <img src="./../../assets/logo.png"
      style="width:150px;height:50px;"
    
    >
    <p style="font-family:sans-serif;font-weight:bolder;color:#000000;opacity:0.5;
      border-bottom:1px solid red;
    ">Page Not Found</p>
   </div>
  `,
  styles: [
   
  ]
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
