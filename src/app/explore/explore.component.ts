import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  posts:any=[];
  showSkel:boolean=true;
  load:number=0;

  constructor(private auth:AuthService,private router:Router,private dataService:DataServiceService) { }

  ngOnInit(): void {

    this.dataService.getFirestore().collection("Posts").get().subscribe
      ((docs)=>{

        docs.forEach((doc)=>{
          this.posts.push(Object(doc.data()));
          this.load=this.load+1
        })


      })

    if(this.load===this.posts.length){
      setTimeout(()=>{
        this.showSkel=false;
      },1000)
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

}
