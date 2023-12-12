import { InfoService } from './info.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ControlContainer, NgForm} from "@angular/forms";
import {OemModel} from "../../../../../../Domain/Entities/MasterData/Oem.model";
import {HarnessMakerModel} from "../../../../../../Domain/Entities/MasterData/HarnessMaker.model";
import {Subject} from "rxjs";
//import {HomeComponent} from "../home.component";
import {takeUntil} from "rxjs/operators";
//import {SetupModel} from "../../../models/setup.model";
//import {DrawingService} from "../../services/drawing.service";
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]

})

export class InfoComponent implements OnInit , OnDestroy{
//infos: any;
  public oemId: string;
  public harnessMakerId: string;
  public componentId: string;
  public cableId: string;

  /* ------------------- */
  //public data: SetupModel;

/*  public harnessMakers: HarnessMakerModel[];
  public ems: OemModel[];*/

  public name;
  public customerPN;
  public projectNumber;
  public countSides = 2;
  /* ------------------- */

infos : any;

  private _unsubscribeAll: Subject<any>;

constructor(private infoData: InfoService)
{
  this.infoData.infos().subscribe((data) => {
   this.infos = data;
  });
}
  

  ngOnInit(): void {
   

  }

  ngOnDestroy(): void {
  }


  /***
   * On touchspin count change
   */
  countChange(value) {
    this.countSides = value;
  }


 

url = 'https://localhost:5001/api/infos';


  

  
}
