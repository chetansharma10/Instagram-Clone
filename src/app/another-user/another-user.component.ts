import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-another-user',
  templateUrl: './another-user.component.html',
  styleUrls: ['./another-user.component.css']
})
export class AnotherUserComponent implements OnInit {
  userDocId:any=window.location.pathname.split("anotherUser/")[1];

  accessGranted:boolean=false;
  pendingRequest:boolean=false;
  anotherUid!:any;
  current_uid!:any;


  previousRequests:any=[];
  previousFriends:any=[];
  previousFriendsCurrent:any=[];


  allUsersPosts:any=[];
  no_followes:number=0;
  name_user:string="";
  url:any="";
  no_ofFollow:any=0;

  constructor(private auth:AuthService,private router:Router,private dataService:DataServiceService) { }

  ngOnInit(): void {

    this.dataService.readDocById("Users",this.userDocId).subscribe((doc)=>{
      var obj=Object(doc.data());
      this.anotherUid=obj.uid;

      this.auth.getAuth().authState.subscribe((user)=>{
        this.current_uid=user?.uid;
        if(user?.uid===this.anotherUid){
          this.auth.go("Profile");
        }
        else{

          console.log(this.anotherUid,user?.uid)
          this.checking(this.anotherUid,user?.uid);
          this.readPreviousRequest(this.anotherUid);
          this.readPreviousFriends(this.anotherUid);
          this.readPreviousFriendsOfCurrentUser(this.current_uid);
        }
      });

   

   
    });


  
  }

  checkImageOrNot(el:any){
    if(el.includes("jpeg") || el.includes("jpg") || el.includes("png") ){
      return true
    }
    else{
      return false
    }
  }

  togglePlay(event:any){
    var X=event.target.getAttribute("value")
    if(X===false||X==="false"){
      event.target.play()
      event.target.setAttribute("value","true")

    }
    else{
      event.target.pause()
      event.target.setAttribute("value","false")

    }
  }


  readPreviousRequest(anotherUserUid:any){
    this.dataService.readDocById("Requests",anotherUserUid).subscribe((doc)=>{
      this.previousRequests=Object(doc.data()).requests;
      console.log(this.previousRequests)
    });
  }

  readPreviousFriends(anotherUserUid:any){
    this.dataService.readDocById("Friends",anotherUserUid).subscribe((doc)=>{
      this.previousFriends=Object(doc.data()).friends;
      console.log(this.previousFriends)

    });
  }

  readPreviousFriendsOfCurrentUser(currentUid:any){
    this.dataService.readDocById("Friends",currentUid).subscribe((doc)=>{
      this.previousFriendsCurrent=Object(doc.data()).friends;
      console.log(this.previousFriendsCurrent)
    });
  }

  checking(anotherUid:any,currentUid:any){
    this.dataService.readDocById("Friends",anotherUid).subscribe((doc)=>{
      if(doc.exists){

        //
        let data=Object(doc.data()).friends;
        let isFoundInFriends=false;
        if(data.length===0){
         isFoundInFriends=false;

        }
        else{
          for(let i=0;i<=data.length;i++){
            let singleObj=data[i];
            if(singleObj.uid===currentUid){
              isFoundInFriends=true;
              break;
            }
          }//end for
        }
      
  
  
  
        if(isFoundInFriends){
          this.accessGranted=true;

          this.dataService.readDocById("Users",this.userDocId).subscribe((doc)=>{
            var obj=Object(doc.data());

            this.name_user=obj.displayName;
            this.url=obj.photoURL;
            var userId=obj.uid;
            var postsL=obj.postsLists;

            postsL.map((item:any)=>{

              this.dataService.readDocById("Posts",item).subscribe((dc)=>{
               var obj1=Object(dc.data());
               this.allUsersPosts.push(obj1)
              });

            });


            this.dataService.readDocById("Friends",userId).subscribe((dc)=>{
              var obj1=Object(dc.data()).friends;

              this.no_ofFollow=obj1.length;
              
             });
         



          });


          





        }
        else{
          this.accessGranted=false;
          this.dataService.readDocById("Requests",anotherUid).subscribe((doc)=>{
            let data=Object(doc.data()).requests;
            let isFoundedInRequests=false;

            if(data.length===0){
              isFoundedInRequests=false;
            }
            else{
              for(let i=0;i<=data.length;i++){
                let singleObj=data[i];
                if(singleObj.uid===currentUid){
                  isFoundedInRequests=true;
                  break;
                }
              }//end for
            }
          
  
            if(isFoundedInRequests){
              this.pendingRequest=true;
              this.accessGranted=false;
            }
            else{
              this.pendingRequest=false;
              this.accessGranted=false;
  
  
            }
  
  
          });
  
        }
  
  
  
        //







      }
     
    
    });
  }

  followUser(){

    this.auth.getAuth().authState.subscribe((user)=>{

      var details_of_current_user={
        displayName:user?.displayName,
        url:user?.photoURL,
        email:user?.email,
        uid:user?.uid,
      }
      var previousData=this.previousRequests;
      
      previousData.push(details_of_current_user);


      

  

      this.dataService.updateDoc("Requests",{
        requests:previousData,
      },this.anotherUid).then(()=>{

          this.pendingRequest=true;  
          console.log("Success")
      }).catch((error)=>console.log(error));




    })






  }




unfollowUser(){

  console.log(this.previousFriends,this.current_uid,this.anotherUid)
  //go to another uid friends and delete current uid
  
  let temp=-1;
  for(let i=0;i<=this.previousFriends.length;i++)
  {
    if(this.previousFriends[i].uid===this.current_uid){
      temp=i;
      break;
    }
  }

  var previousFriendsList=this.previousFriends;
  previousFriendsList.splice(temp,1);
  this.dataService.updateDoc("Friends",{
    friends:previousFriendsList,
  },this.anotherUid).then(()=>{
      this.pendingRequest=false;
      console.log("Success")
      this.accessGranted=false;

      this.callAnother()
      // console.log(this.previousFriendsCurrent,this.current_uid,this.anotherUid)
  }).catch((error)=>console.log(error))







  
}


callAnother(){
  let temp2=-1;
  for(let i=0;i<=this.previousFriendsCurrent.length;i++)
  {
    if(this.previousFriendsCurrent[i].uid===this.anotherUid){
      temp2=i;
      break;
    }
  }

  var previousFriendsList2=this.previousFriendsCurrent;
  previousFriendsList2.splice(temp2,1);
  this.dataService.updateDoc("Friends",{
    friends:previousFriendsList2,
  },this.current_uid).then(()=>{
      this.pendingRequest=false;
      console.log("Success prev")
      this.accessGranted=false;
  }).catch((error)=>console.log(error))
}

cancelRequest(){

  //remove current uid from another uid

  console.log(this.previousRequests,this.current_uid)

  var prev=this.previousRequests;
  if(prev.length==0){
    console.log("Empty")
  }
  else{
    var temp=-1;
    for(let i=0;i<=prev.length;i++){
      if(prev[i].uid===this.current_uid){
        temp=i;
        break;
      }
    }

    prev.splice(temp,1);


    this.dataService.updateDoc("Requests",{
      requests:prev,
    },this.anotherUid).then(()=>{

        this.pendingRequest=false;  
        console.log("Success")
    }).catch((error)=>console.log(error))
  
  }
 

  







 }







}
