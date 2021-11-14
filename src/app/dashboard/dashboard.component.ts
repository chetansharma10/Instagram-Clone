import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {


    constructor(private auth:AuthService,private router:Router,private dataService:DataServiceService,private storage:StorageService) { }


    visit(id:string){
      this.auth.go(id)
    }


    signOut(){
      this.auth.signOut()
      this.router.navigate(["/"])
    }


}
