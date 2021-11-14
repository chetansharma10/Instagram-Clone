import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';
import { ShowHideService } from '../show-hide.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  results:boolean=false;
  profileImg!:any;
  searchQuery:any="";

  requests:any=[];
  reqReceive:boolean=false;
  username:any="";
  searchData:any=[]
  constructor(private authService:AuthService,private dataService:DataServiceService,private showHide:ShowHideService,private router:Router) { }

  ngOnInit(): void {

    
    
    this.authService.getAuth().authState.subscribe((res)=>{

      this.profileImg=res?.photoURL;
      this.username=res?.displayName;



      this.dataService.getFirestore().collection("Requests").doc(res?.uid).snapshotChanges().subscribe((snap)=>{
          if(snap.type==="modified"){
            console.log(snap.payload)

            this.dataService.getFirestore().collection("Requests")
            .doc(res?.uid).get().subscribe((doc)=>{
            
              var obj=Object(doc.data()).requests;
              this.requests=obj;
              if(this.requests.length>0){
                this.reqReceive=true;
      
              }
              else{
                this.reqReceive=false;
              }
      
            });

            

          }
      })      


    });




    

  }

  toggleVisible(){
    this.showHide.updateVisible()
  }
  visible(){
    return this.showHide.getVisible()
  }
  caller(e:any){
    if(e.code==="Enter"){
      this.searchData=[]
      if(this.searchQuery===this.username){
        console.log("No Result Founded")
      }
      else{
      this.dataService.getDocIdCurrentUser("Users","displayName",this.searchQuery)
      .then((res)=>{
        res.docs.forEach((doc)=>{
         
          this.searchData.push(doc.data())
          console.log(doc.data())
        })
      })
      .catch((error)=>{
        console.log(error)
      });
    }

      


    }
  }

  visit(id:any){
    this.authService.go(id);
    this.showHide.normalizeVisible();


  }
  getHome(){
    return this.authService.isHome;
  }
  getExplore(){
    return this.authService.isExplore;
  }

  getInbox(){
    return this.authService.isInbox;
  }

  goToProfile(e:any){
    this.router.navigate(["/dashboard/anotherUser/"+e])
    this.toggleResults();
  }

  getActivity(){
    return this.authService.isActivity;
  }
  toggleResults(){
    this.results=!this.results;
  }

  signedOut(){
    this.authService.signOut()
    this.showHide.normalizeVisible();
  }




  

}
