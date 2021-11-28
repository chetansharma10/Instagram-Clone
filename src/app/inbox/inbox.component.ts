import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  @ViewChild('elm') elm!:ElementRef;
  @ViewChild('inp') inp!:ElementRef;

  showEmojis:boolean=false;
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
                if(doc.url===null){
                  let docx=doc
                  docx.url="data:image/jpeg;base64,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"
                  this.friends.push(docx)

                }
                else{
                this.friends.push(doc)

                }
                
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
        setTimeout(()=>{
          this.elm.nativeElement.scrollTop = this.elm.nativeElement.scrollHeight;
        },1000)

       
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
        
          this.elm.nativeElement.scrollTop = this.elm.nativeElement.scrollHeight;
         
        
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

  addEmoji(event:any){
    this.messageValue=this.messageValue+event.emoji.native;
    this.inp.nativeElement.value=this.messageValue;
  }

  toggleEmojis(){
    this.showEmojis=!this.showEmojis;
  }

}
