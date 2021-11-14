import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore"


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  constructor(private firestore:AngularFirestore) {


  }

  
  addDoc(collectionName:string,obj:any){
    return this.firestore.collection(collectionName).add(obj);
  }

  getFirestore(){
    return this.firestore;
  }

  readDocs(collectionName:string){
    return this.firestore.collection(collectionName).get();
  }

  readDocById(collectionName:string,docId:any){
    return this.firestore.collection(collectionName).doc(docId).get();
  }

  
  getDocIdCurrentUser(collectionName:string,whereGoes:string,uid:any){
  
    return this.firestore.collection(collectionName).ref.where(whereGoes,"==",uid)
    .get();
   
  }

  

  updateDoc(collectionName:string,obj:any,docId:any){
    return this.firestore.collection(collectionName).doc(docId).update(obj);
  }




}
