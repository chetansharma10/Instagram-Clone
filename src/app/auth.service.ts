import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth"
import { DataServiceService } from './data-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isHome:boolean=false;
  isActivity:boolean=false;
  isExplore:boolean=false;
  isInbox:boolean=false;
  isAddPost:boolean=false;
  isProfile:boolean=false;
  status=false
  constructor(private router:Router,private auth:AngularFireAuth,private dataService:DataServiceService) { }

  getAuth(){
    return this.auth
  }

 


  signUp(email: string,password:string,firstName:string,lastName:string){
 
      return this.auth.createUserWithEmailAndPassword(email,password);
 
    
  }

  signIn(email:string,password:string){
    return this.auth.signInWithEmailAndPassword(email,password)
   
  }

  signOut(){
    this.auth.signOut();
    this.router.navigate(["/"])
  }

  updateProfile(name:string,url:string){
    
    this.auth.authState.subscribe((user)=>{
      user?.updateProfile({
        displayName:name,
        photoURL:url,
      }).then(()=>console.log("Success"))



    })


  }

  go(id:string){
    if(id==="" || id==="home"){
      this.isHome=true;
      this.isExplore=false;
      this.isAddPost=false;
      this.isActivity=false;
      this.isInbox=false;
      this.isProfile=false;
      
      this.router.navigate(["dashboard/home"])
     
    }
    if(id=="explore")
    {
      this.isHome=false;
      this.isExplore=true;
      this.isAddPost=false;
      this.isActivity=false;
      this.isInbox=false;
      this.isProfile=false;
      
      this.router.navigate(["dashboard/explore"])
    }


    if(id=="activity"){
      this.isHome=false;
      this.isExplore=false;
      this.isAddPost=false;
      this.isActivity=true;
      this.isInbox=false;
      this.isProfile=false;
      

    }
    if(id=="inbox"){
      this.isHome=false;
      this.isExplore=false;
      this.isAddPost=false;
      this.isActivity=false;
      this.isInbox=true;
      this.isProfile=false;

      this.router.navigate(["dashboard/inbox"])
    }
    
    
    if(id=="addPost"){
      this.isHome=false;
      this.isExplore=false;
      this.isAddPost=true;
      this.isActivity=false;
      this.isInbox=false;
      this.isProfile=false;

      this.router.navigate(["dashboard/addPost"])
    }
    

     
    if(id=="Profile"){
      this.isHome=false;
      this.isExplore=false;
      this.isAddPost=false;
      this.isActivity=false;
      this.isInbox=false;
      this.isProfile=true;
      this.router.navigate(["dashboard/profile"])
    }
    
    
    
    
    
  }
  



}
