import { Injectable } from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage"

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage:AngularFireStorage) { }

  addFile(path:string,file:File){
    var uploadTask=this.storage.ref(path).put(file)
    return  uploadTask 
  }

}

