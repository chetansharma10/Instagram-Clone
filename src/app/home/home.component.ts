import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  postFile!:any;
  fileName!:string;
  PostUrl!:string;
  file!:File;
  progressValue:number=0;
  userImg!:any;
  displayName!:any;
  emailName!:any;
  storiesLoaded:boolean=true;
  suggestList:any=[]


  dark:any=[]
  stories:any=[];
  constructor(private auth:AuthService,private router:Router,private dataService:DataServiceService,private storage:StorageService) { }

  ngOnInit(): void {
    this.auth.getAuth().authState.subscribe((res)=>{
      this.userImg=res?.photoURL;
      this.displayName=res?.displayName;
      this.emailName=res?.email?.split("@")[0];


      this.dataService.readDocById("Friends",res?.uid).subscribe((doc)=>{
        var obj=Object(doc.data()).friends;
        // console.log("Stories",obj)

        for(let i=0;i<obj.length;i++){
          console.log(obj[i].uid)
        

         // Reading in Users
          let u=obj[i].uid;
          // console.log(u)
          this.dataService.getFirestore().collection("Users").ref.where("uid","==",u)
          .get().then((response)=>{
            response.forEach((story)=>{
              var storiesx=Object(story.data());
              var x={
                name:storiesx.displayName,
                url:storiesx.photoURL,
              }
              this.stories.push(x);  
            });
          }).catch((error)=>console.log(error))
          //End Reading in Users

        }

        setTimeout(()=>{this.storiesLoaded=false;},2000);
      });



    })
  
    this.showSuggestions();
    


  
  }

  visit(id:string){
    this.auth.go(id)
  }
  onFileSelected(e:any){

    const fileX:File=e.target.files[0];
    if(fileX){
      this.fileName=fileX.name;
      this.file=fileX;

    }//end of if

  }


  addPost(){
    

    this.auth.getAuth().authState.subscribe((res)=>{

      // console.log("User Uid",res?.uid)
      
      this.dataService.getDocIdCurrentUser("Users","uid",res?.uid)
      .then((res)=>{
        res.forEach((doc)=>{
          // console.log("Doc Id",doc.id,Object(doc.data()))

          // Post Upload
          this.storage.addFile("PostFiles/"+this.fileName,this.file).snapshotChanges().subscribe((snapshot)=>{
            if(snapshot){
                var progress=(snapshot?.bytesTransferred/snapshot?.totalBytes)*100;
                // console.log(progress);
                this.progressValue=progress;
                // console.log(snapshot.state);

                if(snapshot.state==="success"){
                  snapshot.ref.getDownloadURL().then((url)=>{
                    // console.log(url)
                     this.PostUrl=url

                        //*** 

                        var obj={
                          likes:[],
                          userDocId:doc.id,
                          whoAddPost:Object(doc.data()).displayName,
                          userProfileImg:Object(doc.data()).photoURL,
                          postUrl:this.PostUrl,
                          comments:[],
                        
                        }

                        this.dataService.addDoc("Posts",obj).then((post)=>{

                          // console.log("Post Added",post.id);
                          this.dataService.readDocById("Users",doc.id).subscribe((result)=>{
                            var m=Object(result.data())
                            var previousPosts=m.postsLists;
                            previousPosts.push(post.id)
                            this.addPostInUserCollection(doc.id,{postsLists:previousPosts})
                            this.progressValue=0


                              // Add Post ID
                            // this.dataService.updateDoc("Posts",{postId:post.id},post.id).then((res)=>{console.log("Updated Post Id ")})
                            // .catch((error)=>console.log(error.message))


                          })

                        }).catch((error)=>console.log(error));

                        //***

                   });
                }
    
            }     
          });




        })
      })
   
    });

  }



  addPostInUserCollection(Id:any,obj:any){
    
    this.dataService.updateDoc("Users",obj,Id).then((res)=>{
      // console.log("Post is added Successfully in User Collection")
    }).catch((error)=>{console.log(error.message)});

  }


  showSuggestions(){
    
    this.dataService.getFirestore().collection("Friends")
    .get().subscribe((docs)=>{
        docs.forEach((doc)=>{
          
          this.auth.getAuth().authState.subscribe((user)=>{
            var userId=user?.uid

            this.dataService.readDocById("Friends",userId).subscribe((dc)=>{
              
              var currFriends=Object(dc.data()).friends;
              var allFriends=Object(doc.data()).friends;
              


              var allFriendsUids=[]
              for(let i=0;i<allFriends.length;i++){
                allFriendsUids.push(allFriends[i].uid)
              }
              var currFriendUids=[]
              for(let j=0;j<currFriends.length;j++){
                currFriendUids.push(currFriends[j].uid)
              }
              

              for(let k=0;k<allFriendsUids.length;k++){
                if(allFriendsUids[k]!=userId){
                
                  var cx=currFriendUids.includes(allFriendsUids[k])
                  if(cx){
                    continue;
                  }
                  else{
                      for(let m=0;m<allFriends.length;m++){
                        if(allFriends[m].uid!=allFriendsUids[k]){
                        this.suggestList.push(allFriends[k])
                          break;
                        }
                      }
                  }
                  // 
  
                }



              }
            


            })

  

          });
          
          
          



        });
    });

   
   
   

  }



  signOut(){
    this.auth.signOut()
    this.router.navigate(["/"])
  }

  goSuggest(id:any){
    this.dataService.getDocIdCurrentUser("Users","uid",id).then((docs)=>{
      docs.forEach((doc)=>{
        var idx=doc.id;
        this.router.navigate(["dashboard/anotherUser/"+idx])

      })
    })
  }



}
