import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email!:string;
  password!:string;
  firstName!:string;
  lastName!:string;
  signup_error:string="";
  signup_loader:boolean=false;

  constructor(private auth:AuthService,private dataService:DataServiceService,private router:Router) { }
  signUpUser(event:any)
  {
    event.preventDefault();
    this.signup_loader=true;

    this.auth.signUp(this.email,this.password,this.firstName,this.lastName).
    then((res)=>{
      // console.log("Success Sign Up")
      this.signup_loader=true;
      this.addUserInFirestore(res);
    })
    .catch((error)=>{
      this.signup_loader=false;
      if(error.message.includes(" This operation is restricted to administrators only.")){

        this.signup_error="Please fill empty fields";

      }
      else{

        if(error.message.includes("Password should be at least 6 characters")){

          this.signup_error="Password should be at least 6 characters"

        }
        else{
          this.signup_error="Something went wrong?"

        }
      }



    })
    
  }

  addUserInFirestore(res:any){
          var name=this.firstName+" "+this.lastName;
          var obj={
            uid:res?.user?.uid,
            postsLists:[],
            displayName:name,
            photoURL:"",


       
            
          }
          this.dataService.addDoc("Users",obj).then((res)=>{

            var userDocId=res.id;
            this.signup_loader=false;
            // console.log("User Updated In Firebase,Success",res)
            this.auth.getAuth().authState.subscribe((user)=>{
              user?.updateProfile({
                displayName:name,
                photoURL:"",
              }).then(()=>{
               
                // Friends
                this.createFriendsCollection(user?.uid);

               


             
              
              
              })        
            });

          }).catch((error)=>{
            this.signup_loader=false;
            this.signup_error="Something went wrong?"
            console.log(error.message)
          })
  }


  createFriendsCollection(uid:any){
    this.dataService.getFirestore().collection("Friends").doc(uid).set({friends:[]}).then((res)=>{
      // console.log("Success created Friends ")
  
      // Requests
      this.createRequestsCollection(uid);
  })
    .catch((error)=>{console.log("error")})
  
  
  }
  createRequestsCollection(uid:any){
      this.dataService.getFirestore().collection("Requests").doc(uid).set({requests:[]}).then((res)=>{
        // console.log("Success created Requests ")
        // console.log("Success");       
        this.createMessagesCollection(uid);   
      })
      .catch((error)=>{console.log("error",error)})
    
    
    }

  createMessagesCollection(uid:any){
    var mess={}
    this.dataService.getFirestore().collection("Messages").doc(uid).set(mess).then((res)=>{
      // console.log("Success created Messages ")
      // console.log("Success");          
      this.router.navigate(["/main"])
    })
    .catch((error)=>{console.log("error")})
  }
}
