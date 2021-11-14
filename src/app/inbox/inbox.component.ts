import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  friends:any=[]
  messagesList:any=[]
  messageValue:string="";
  allConversations:any=[];
  anotherConversations:any=[];
  currentUserName:any="";

  allImportantMessages:any=[];
  friendName:any="";
  friendUrl:any="";
  cuuid:any="";
  friendId:any="";

  focused:boolean=true;
  friendsLoaded:boolean=true;
  namesLoaded:boolean=true;

  constructor(private dataService:DataServiceService,private auth:AuthService,private router:Router) { }
  ngOnInit(): void {
   this.auth.getAuth().authState.subscribe((user)=>{
    
      this.cuuid=user?.uid;
      this.currentUserName=user?.displayName;
   
      this.dataService.getFirestore().collection("Messages").doc(user?.uid).snapshotChanges().subscribe
      ((change)=>{
        // console.log(change.type,change.payload)
        if(this.friendId.length>0){
          // this.messagesList=[]
          this.fetchAllMessages(this.friendId,this.cuuid)

        }
      });
   
      this.dataService.readDocById("Friends",user?.uid)
          .subscribe((doc)=>{
              
            var obj=Object(doc.data()).friends;
              obj.forEach((doc:any)=>{
                // console.log(doc)
                this.friends.push(doc)
                
              })
              setTimeout(()=>{
                this.friendsLoaded=false;
                this.namesLoaded=false;
              },2000)
          });

      });


     


  }

  addField(id:any,e:any){
    // console.log("friend Uid",id,"current Uid",this.cuuid,this.allConversations)
    // this.messageValue=""
    // e.target.parentNode.children[0].value="";
    var date=new Date();
    var addedMessage={
      user:this.cuuid,
      value:this.messageValue,
      timestamp:`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

    }
    // console.log(addedMessage)

    let temp=-1;
    if(this.allConversations.length>0){
     
      for(let i=0;i<this.allConversations.length;i++){
        // console.log(this.allConversations[i])
        if(this.allConversations[i].uid===this.cuuid){
          temp=i
          break;
        }
      }


      if(temp!=-1){
        // console.log("No Equal to -1")
        var messagesList=this.allConversations[temp].messages;
        var newMessagesList=[...messagesList,addedMessage]

        this.allConversations[temp].messages=newMessagesList;
    
        this.dataService.updateDoc("Messages",{
      
          conversations:this.allConversations,
    
        },id).then
        ((res)=>{
          // console.log("Succes Message Added if one")
        })
        .catch((error)=>{console.log(error.message)});

      }
      else{

        var newConv=this.allConversations;
        var newObj={
          uid:this.cuuid,
          messages:[addedMessage]
        };
        newConv.push(newObj)
        this.dataService.updateDoc("Messages",{
      
          conversations:newConv,
    
        },id).then
        ((res)=>{
          // console.log("Succes Message Added else one")
        })
        .catch((error)=>{console.log(error.message)});
      }



    }

    else{
      this.dataService.updateDoc("Messages",{
      
        conversations:[
          {
          uid:this.cuuid,
          messages:[addedMessage]
          }
        ],
  
      },id).then
      ((res)=>{
        
        // console.log("Succes Message Added second else")
      })
      .catch((error)=>{console.log(error.message)});


    }
    this.fetchAllMessages(id,this.cuuid)
 

    
 



  }

  getId(id:any,e:any,name:any,url:any){
    this.friendName=name;
    this.friendUrl=url;
    this.friendId=id;

    var elms=document.querySelectorAll(".friend");
    elms.forEach((each)=>{
      each.className="friend blured"
    });
 
    if(e instanceof HTMLDivElement){
      e.setAttribute("class","foucused friend");
    }

    this.focused=false;

    this.messagesList=[]
    this.allConversations=[]
    this.anotherConversations=[]
    this.fetchAllMessages(id,this.cuuid);
    



  }


  fetchAllMessages(id:any,currentUserId:any){
  
    this.dataService.readDocById("Messages",id).subscribe((docs)=>{
     
      if(docs.exists){
        var x=Object(docs.data()).conversations
        if(x===undefined){
          // console.log("Undefined First")
          this.allConversations=[]
        }
        else{
        this.allConversations=Object(docs.data()).conversations;

        this.showReadMessages();
       
        }
      }
      else{
        // console.log("Doc Not exists")
      }
    });


    this.dataService.readDocById("Messages",currentUserId).subscribe((docs)=>{
     
      if(docs.exists){
        var x=Object(docs.data()).conversations
        // console.log("Another User",x)

        if(x===undefined){
          // console.log("Undefined First")
          this.anotherConversations=[]
        }
        else{
        this.anotherConversations=Object(docs.data()).conversations;

        this.showReadMessagesSecond();
        
        }
      }
      else{
        // console.log("Doc Not exists")
      }
    });



  }

 
  send(e:any){
    if(e.key==="Enter"){
      this.messageValue=e.target.value;
      this.addField(this.friendId,this.cuuid)
      e.target.value=""
    }
  }
  

  showReadMessages(){
    let temp=-1

    for(let i=0;i<this.allConversations.length;i++){
      if(this.allConversations[i].uid===this.cuuid){
        temp=i
        break;

      }
    }
    if(temp!=-1){
      var allMessages=this.allConversations[temp].messages
      for(let i=0;i<allMessages.length;i++){
        var index=this.messagesList.findIndex((l:any)=>l.timestamp===allMessages[i].timestamp)
        // console.log(index)

        if(index===-1){
          var target=Object.assign(allMessages[i],{dir:'left'})
          this.messagesList.push(target)
        
        }
      }
    
    }
    
   

  }

  showReadMessagesSecond(){
  
    let temp=-1

    for(let i=0;i<this.anotherConversations.length;i++){
      if(this.anotherConversations[i].uid===this.friendId){
        temp=i
        break;

      }
    }
    if(temp!=-1){
      var allMessages=this.anotherConversations[temp].messages
      for(let i=0;i<allMessages.length;i++){
        var index=this.messagesList.findIndex((l:any)=>l.timestamp===allMessages[i].timestamp)
        // console.log(index)
        
        if(index===-1){
          var target=Object.assign(allMessages[i],{dir:'right'})
          this.messagesList.push(target)
          
        }

      }


      
    }
  
  }

  



}
