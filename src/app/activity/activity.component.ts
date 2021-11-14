import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  


  requests:any=[];
  friends:any=[];
  current_uid!:any;
  constructor(private auth:AuthService,private dataService:DataServiceService) { }

  ngOnInit(): void {


   this.auth.getAuth().authState.subscribe((user)=>{
      this.current_uid=user?.uid;
      this.dataService.getFirestore().collection("Requests")
      .doc(user?.uid).get().subscribe((doc)=>{
      
        var obj=Object(doc.data()).requests;
        this.requests=obj;


      })

      this.dataService.getFirestore().collection("Friends")
      .doc(user?.uid).get().subscribe((doc)=>{
      
        var obj=Object(doc.data()).friends;
        this.friends=obj;


      });

   });//end of subs
   

  }


  confirmRequest(elm:any){
    // console.log(elm)
    let temp=-1;
    for(let i=0;i<=this.requests.length;i++){
      if(this.requests[i].uid===elm){
        temp=i
        break;
      }
    }

    var obj=this.requests[temp]
    this.friends.push(obj);

    var prevFriends=this.friends;



    this.dataService.updateDoc("Friends",{
      friends:prevFriends,
    },this.current_uid).then(()=>{

        this.requests.splice(temp,1)
        var prevReq=this.requests;
        this.dataService.updateDoc("Requests",{requests:prevReq},this.current_uid)
        .then(()=>{
          
          // console.log("success")

          //Update Another User Also
          this.dataService.getDocIdCurrentUser("Users","uid",this.current_uid)
          .then((docs)=>{
            docs.forEach((doc)=>{
              var obj=Object(doc.data());
              var x={
                displayName:obj.displayName,
                url:obj.photoURL,
                uid:obj.uid,
                email:"",
              }

              this.dataService.readDocById("Friends",elm).subscribe
              (resp=>{
                var details=Object(resp.data()).friends;
                // console.log(details,this.current_uid,x)
                details.push(x);
                this.dataService.updateDoc("Friends",{friends:details},elm).then((res)=>{
                  // console.log("Success In Friends")
                }).catch((error)=>console.log(error))

              })



            })
          })
          .catch((error)=>console.log(error))

          //Update Another User Also
      
      
      
      
      })
        .catch((error)=>{console.log(error)})


    }).catch((error)=>console.log(error))


    //update requests
    //update friends
    
  }







}
