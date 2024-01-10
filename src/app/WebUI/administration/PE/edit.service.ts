import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private sharedData: any;
  private updateBool:boolean = false;

  setUpdateBool(){
    this.updateBool = true;
  }

  getUpdateBool(){
    return this.updateBool;
  }

  clearUpdateBool(){
    this.updateBool = false;
    return this.updateBool
  }
  
  setSharedData(data: any) {
    this.sharedData = data;
  }

  getSharedData() {
    return this.sharedData;
  }

  clearSharedData() {
    this.sharedData = null;
    return this.sharedData
  }
}
