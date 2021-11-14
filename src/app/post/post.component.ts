import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  constructor(private dataService:DataServiceService,private authService:AuthService,private router:Router) { }
  Data:any=[]
  Posts:any=[];
  commentValue:string="";




  currentUid:any="";


  loader:boolean=true;
  
  

  ngOnInit(): void {

    this.authService.getAuth().authState.subscribe((res)=>{
      this.currentUid=res?.uid;
    })

    this.dataService.getFirestore().collection("Posts").ref.onSnapshot((snap)=>{
      snap.docChanges().forEach((change)=>{
          if(change.type==="added"){
            
          
            var obj=Object(change.doc.data())
            Object.assign(obj,{"postId":change.doc.id})
            this.Posts.push(obj)
          
            console.log("Added",change.doc.id,change.doc.data())

           
            

          }

          if(change.type==="modified"){
            
            var obj1=Object(change.doc.data());

            let i=0;
            let m=0;
            for( i=0;i<=this.Posts.length;i++){
              if(this.Posts[i].postId===change.doc.id){
                m=i;
                break;
              }
            
            }
            console.log(this.Posts[m],obj1)
            Object.assign(obj1,{"postId":change.doc.id})

            this.Posts[m]=obj1;
    
            
          
          }
          if(change.type==="removed"){console.log("Destroy")}

      })
    });



   setTimeout(()=>{
      this.loader=false
    },5000)
  
  
  
  
  
  }

  addComment(event:any){
    var postId=event.getAttribute("value");
    var userDocId=event.getAttribute("id");

    
    this.authService.getAuth().authState.subscribe((user)=>{

          var nameCommentor=user?.displayName;
          var profileImg=user?.photoURL;


          // Read Previous Comments
          this.dataService.readDocById("Posts",postId).subscribe((post)=>{

                var previousComments=Object(post.data()).comments;
                previousComments.push({
                  value:this.commentValue,
                  who:userDocId,
                  userimg:profileImg,
                  commentor:nameCommentor

                })
              // Add new Comment
              this.dataService.updateDoc("Posts",{comments:previousComments},postId).then((res)=>{
                console.log("Success Comment Added")
              }).catch((error)=>console.log("error in comments"))

          });


    })
   

  }


  
  getPostId(x:any){
    this.checkUserInLikes(x)
   
  }
  checkUserInLikes(postId:any){
    this.authService.getAuth().authState.subscribe((res)=>{
      var uid=res?.uid;
      this.readLikes(postId,uid);
    })
  }

  readLikes(id:any,currentId:any){
    var check=false;
    this.dataService.readDocById("Posts",id).subscribe((res)=>{
      var allLikes=Object(res.data()).likes;
      if(allLikes.includes(currentId)){
        check=false;
        //Not add
      }
      else{
        check=true;
        //Add in Likes
        allLikes.push(currentId)
        this.dataService.updateDoc("Posts",{
          likes:allLikes,
        },id).then(()=>{console.log("Likes Add")}).catch((error)=>console.log(error.message))



      }
    });
    return check;

 



  }


  checkImageOrNot(el:any ){
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




}
