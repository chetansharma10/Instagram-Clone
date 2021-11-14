import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fileName:string="";
  file!:File;
  photoImg!:any;
  toggles:any=[false,false,false];
  userPosts:any=[]
  lengthPosts:number=0;
  lengthComments:number=0;
  lengthLikes:number=0;
  userName:any="";
  userEmail:any="";


  showSkel:boolean=true;
  load:number=0;
  progressValue:number=0;
  constructor(private authService:AuthService,private dataService:DataServiceService,private storage:StorageService) { }

  ngOnInit(): void {

    this.authService.getAuth().authState.subscribe((res)=>{
      this.photoImg=res?.photoURL;
      this.userName=res?.displayName;
      this.userEmail=res?.email;
      
    
      
      this.dataService.getDocIdCurrentUser("Users","uid",res?.uid).then((docs)=>{
        docs.forEach((doc)=>{
          var posts=Object(doc.data()).postsLists;

          posts?.map((item:any,index:any)=>{
            this.dataService.readDocById("Posts",item).subscribe((res)=>{
              console.log(res.data())
              this.lengthComments=Object(res.data()).comments.length;
              this.lengthLikes=Object(res.data()).likes.length;
              this.userPosts.push(res.data())

              this.load=this.load+1;

            });
            
          });



        })
      }).catch((error)=>{console.log(error.message)})
      
    
    
    })
    this.toggles[0]=true;

    if(this.load===this.userPosts.length){
      setTimeout(()=>{
        this.showSkel=false;
      },1000)
    }


  }



















  onFileSelectedForProfile(e:any){
    const fileX:File=e.target.files[0];
    if(fileX){
      this.fileName=fileX.name;
      this.file=fileX;
    }
  }

  changeProfileImage(){
    this.authService.getAuth().authState.subscribe((res)=>{

      this.dataService.getDocIdCurrentUser("Users","uid",res?.uid)
      .then((docs)=>{
       
        docs.forEach((doc)=>{

          var data=Object(doc.data())
          var docId=doc.id;


          this.storage.addFile("UserImages/"+this.fileName,this.file).snapshotChanges().subscribe((snapshot)=>{
            if(snapshot){
                var progress=(snapshot?.bytesTransferred/snapshot?.totalBytes)*100;
                this.progressValue=progress
              
                console.log(snapshot.state);

                if(snapshot.state==="success"){
                  snapshot.ref.getDownloadURL().then((url)=>{
                    
                    
                    // Update in FireAuth
                    this.authService.updateProfile(data.displayName,url);

                    //Update in Firestore
                    this.dataService.updateDoc("Users",{
                      photoURL:url,
                    },docId).then((res)=>{
                      console.log("Updated in Firestore")
                    }).catch((error)=>{console.log(error.message)})

                    
                    // Update in Posts
                    this.updateImageInPosts(docId,url);

                    this.progressValue=0;

                   });
                }
    
            }     
          });
          //End





        });

      }).catch((error)=>console.log(error.message));

    });//End of Subscribe
  }




  updateImageInPosts(docId:any,url:any){
    
    this.dataService.getFirestore().collection("Posts").ref.where("userDocId","==",docId)
    .get()
    .then((res)=>{

      res.forEach((doc)=>{

             //Update in Firestore
             this.dataService.updateDoc("Posts",{
              userProfileImg:url,
            },doc.id).then((res)=>{
              console.log("Updated in Firestore")
            }).catch((error)=>{console.log(error.message)})
            
      });
      console.log(res);

    
    }).catch((error)=>{console.log(error.message)});

  }


  userElements(id:any){

    switch(id){
      case "posts":
        this.toggles[0]=true;
        this.toggles[1]=false;
        this.toggles[2]=false;
        break;
      case "saved":
        this.toggles[0]=false;
        this.toggles[1]=true;
        this.toggles[2]=false;
        break;
      case "tagged":
        this.toggles[0]=false;
        this.toggles[1]=false;
        this.toggles[2]=true;
      
    }

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

}

