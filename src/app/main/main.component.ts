import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  dataLoad:boolean=false
  dataReceive:boolean=false

  email!:string;
  password!:string;
  error!:string;
  loader:boolean=false;


  constructor(private authService:AuthService,private router:Router,private dataService:DataServiceService) { 

    // console.log("Constructor called")


  }

  ngOnInit(): void {
    this.authService.getAuth().onAuthStateChanged((user)=>{
      if(user){
        // console.log("Current User OnAuth Called",user)
        this.authService.status=true
        this.dataReceive=true

        this.authService.go("")
      }
      else{
        // console.log("User is not there")
        this.dataLoad=true

      }
    })


  }



  CallSubmit(event:any){
    event.preventDefault()

    this.Loginbtn(this.email,this.password,event)


  }

  Loginbtn(email:string,password:string,event:any){
        this.loader=true;

        this.authService.signIn(this.email,this.password)
        .then((res)=>{
          this.loader=false;
          event.target.form[0].value=""
          event.target.form[1].value=""
    
        })
        .catch((error)=>{
          this.loader=false;
          if(error.message.includes("no user record")){
            this.error="Invalid Credential"
          }
          else{
            if( event.target.form[0].value==="" || event.target.form[1].value==="" )
            {
              this.error="Please fill the fields correctly."
            }
            else{
            this.error="Invalid Password"}
          }
          
        })
    }


}
