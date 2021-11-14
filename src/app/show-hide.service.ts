import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowHideService {
  visible:boolean=true;
  constructor() { }

  getVisible(){

    return this.visible;
  }
  updateVisible(){
    this.visible=!this.visible;
  }

  normalizeVisible(){
    this.visible=true;
  }


}
