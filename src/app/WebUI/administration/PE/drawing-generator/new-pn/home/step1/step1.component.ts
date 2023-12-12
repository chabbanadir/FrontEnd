import { Component, OnInit } from '@angular/core';
import {ProjectModel} from "../../../../../../../Domain/Entities/DrawingGenerator/Project.model";
import {HomeComponent} from "../home.component";
import {OemService} from "../../../../data/oem/services/oem.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  public partNumber;
  private _unsubscribeAll: Subject<any>;


  constructor() {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    console.log("step1");
  }

  modernHorizontalNext() {
    let project = new ProjectModel();

    project.partNumber = this.partNumber;
    HomeComponent.config = project;
    console.log("PN !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + this.partNumber);

  
    HomeComponent.modernHorizontalNext();
  }
}
