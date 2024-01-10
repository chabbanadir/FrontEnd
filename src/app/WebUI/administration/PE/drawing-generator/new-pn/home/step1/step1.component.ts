import { Component, OnInit } from '@angular/core';
import {ProjectModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Project.model";
import {HomeComponent} from "../home.component";
import {OemService} from "../../../../data/oem/services/oem.service";
import {Observable, Subject} from "rxjs";
import { FormControl, Validators } from '@angular/forms';
import { ArchiveService } from 'app/WebUI/administration/PE/drawing-archive/services/archive.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  public partNumber;
  public Rev;
  public static partNumberEdit;
  public static revEdit: any;
  private _unsubscribeAll: Subject<any>;
  static updateBool: boolean = false;
  updateBool: boolean = false;
  isAutocompleteOpen: boolean;
  partNumberExists = false; // Flag to track if the Part Number exists in the data
  revExistsForPartNumber = false; // Flag to track if the Rev exists for the Part Number


  filteredData: any[] ;

  data :any[] = [];


  
  
  constructor(private archiveService : ArchiveService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.archiveService.getAllDrawings().subscribe((data: any[]) => {
      this.data = data;
    });
    this.updateBool = Step1Component.updateBool
    this.partNumber = Step1Component.partNumberEdit
    this.Rev = Step1Component.revEdit
    console.log("step1");
  }

  inputChange(){
      this.partNumberExists = this.data.some(item => item.te_pn === this.partNumber);
      this.isAutocompleteOpen = true;
      const inputValue = this.partNumber.toLowerCase();
      if(inputValue == "") this.filteredData = [] ;
      else {this.filteredData = this.data.filter(item => item.te_pn.toLowerCase().includes(inputValue)).slice(0, 5);}
  }


  selectItem(item: any) {
    this.partNumber = item.te_pn;
    this.isAutocompleteOpen = false;
  }
  // Method to check if the Rev exists for the Part Number
  checkRevExistsForPartNumber() {
    this.revExistsForPartNumber = this.data.some(
      item => item.te_pn === this.partNumber && item.rev === this.Rev
    );
  }

  modernHorizontalNext() {
    let project = new ProjectModel();

    project.partNumber = this.partNumber;
    HomeComponent.config = project;
    console.log(this.Rev)
    if(this.Rev == null){
      HomeComponent.dataSaving.Rev ="A";
    }else{
      HomeComponent.dataSaving.Rev = this.Rev;
    }
    HomeComponent.modernHorizontalNext();
  }
}
