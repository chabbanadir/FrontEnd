import { BrowserModule } from '@angular/platform-browser';
import { InfoService } from './../../../../data/info/services/info.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ControlContainer, NgForm, FormsModule} from "@angular/forms";
import {OemModel} from "../../../../../../../Domain/Entities/MasterData/Oem.model";
import {HarnessMakerModel} from "../../../../../../../Domain/Entities/MasterData/HarnessMaker.model";
import {Subject} from "rxjs";
import {HomeComponent} from "../home.component";
import {takeUntil} from "rxjs/operators";
import {SetupModel} from "../../../models/setup.model";
import {DrawingService} from "../../services/drawing.service";
import {HttpClient} from "@angular/common/http";
import * as XLSX from 'xlsx';
import {ComponentModel} from "../../../../../../../Domain/Entities/MasterData/Component.model";
import {CategoryModel} from "../../../../../../../Domain/Entities/MasterData/Category.model";
import {CableModel} from "../../../../../../../Domain/Entities/MasterData/Cable.model";

import {CoreSidebarService} from "../../../../../../../../@core/components/core-sidebar/core-sidebar.service";
import {InfoModel} from "../../../../../../../Domain/Entities/MasterData/Info.model";


import {OemService} from "../../../../../../administration/PE/data/oem/services/oem.service";

@Component({
  //declarations: [],
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}],
  //imports: [BrowserModule, HttpClientModule],
  // imports: [
  //   {BrowserModule,
  //   FormsModule}]
 

})
export class Step2Component implements OnInit , OnDestroy{
 // cable: CableModel[];
  ems: OemModel[];
  cables: CableModel[];
 // ems: OemModel[];
  info: InfoModel; 
  harnessmakers: HarnessMakerModel[];
  components: ComponentModel[];
  formData : FormData =  new FormData();
  fileName= 'ExcelSheet.xlsx';
  public oemId: string;
  public harnessMakerId: string;

  public componentId: string;
  //public harnessMakerId: string;
  public categories: CategoryModel[];

  /* ------------------- */
  public data: SetupModel;

/*  public harnessMakers: HarnessMakerModel[];
  public ems: OemModel[];*/

  public name;
  public partNumber;
  public customerPN;
  public projectNumber;
  public PDMLINK;
  public countSides = 2;
  /* ------------------- */
infos: any;

  // Private
  private _unsubscribeAll: Subject<any>;


  constructor(private _drawingService: DrawingService, private _coreSidebarService: CoreSidebarService, private http: HttpClient,   private _infoService: InfoService, private infoData: InfoService, private _oemService: OemService) {
    this._unsubscribeAll = new Subject();
    // this.infoData.infos().subscribe((data) => {
    //   this.infos = data;
    // });
  }

  ngOnInit(): void {
    console.log("step2");

    this.partNumber = HomeComponent.config.partNumber;

    this._drawingService.onItemsChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(
        response => {
          this.data = response;
        });

  }

  ngOnDestroy(): void {
  }
  
  exportToExcel() {
    let arr = [
      { firstName: 'Jack', lastName: 'Sparrow', email: 'abc@example.com' },
      { firstName: 'Harry', lastName: 'Potter', email: 'abc@example.com' },
    ];
  
  
    let Heading = [['ID', 'Name', 'Status', 'actions']];
  
    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
  
    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, this.categories, { origin: 'A2', skipHeader: true });
  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    XLSX.writeFile(wb, 'filename.xlsx');
  }

  /***
   * On touchspin count change
   */
  countChange(value) {
    this.countSides = value;
  }
/**
   * toggleSidebar
   * @param BaseNumber)
   */
 toggleSidebar(name): void {
  this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
}

/**
 * submit
 * @param form
 */

 exportTo() {

this.formData.append("name", this.info.name);
  this.formData.append("CustomerPn", this.info.CustomerPn);
  this.formData.append("ProjectNumber", this.info.ProjectNumber);
  this.formData.append("ComponentsCount", this.info.ComponentsCount);
  this.formData.append("fk_OemId", this.info.fK_OemId);
  this.formData.append("fK_HarnessmakerId", this.info.fK_HarnessmakerId);
  //this.formData.append("status", this.cable.status.toString());



 }
async submit(form) {
  if (form.valid)
  {


    this.formData.append("name", this.info.name);
    this.formData.append("CustomerPn", this.info.CustomerPn);
    this.formData.append("ProjectNumber", this.info.ProjectNumber);
    this.formData.append("ComponentsCount", this.info.ComponentsCount);
    this.formData.append("fk_OemId", this.info.fK_OemId);
    this.formData.append("fK_HarnessmakerId", this.info.fK_HarnessmakerId);
    //this.formData.append("status", this.cable.status.toString());


    await this._infoService.CreateAsync(this.formData);
    this.info = new InfoModel();
    this.formData = new FormData();
    //this.toggleSidebar('add-info-sidebar');
  }
}




  modernHorizontalPrevious() {
    HomeComponent.modernHorizontalPrevious("step1");
  }
  getInfoFormData(data: any){

// console.warn(data);

this.infoData.saveInfos(data).subscribe((result)=>{
  console.warn(result)
});
  }
// this.http.post<HomeComponent>('https://localhost:5001/api/index.html#/Infos/Infos_GetAll', { title: 'Angular POST Request Example' }).subscribe(data => {
//       this.partNumber = data; 
      url = 'https://localhost:5001/api/index.html#/Infos/Infos_GetAll';


      
  saveInfo(data: any)
  {
    return this.http.post(this.url, data);
  }
  // getInfoFormData(data: any){
  //   console.warn(data);
  // }
  async modernHorizontalNext() {
    
    HomeComponent.config.oemId = this.oemId;
    HomeComponent.config.harnessMakerId = this.harnessMakerId;
    HomeComponent.config.componentId = this.componentId;

    HomeComponent.config.projectNumber = this.projectNumber;
    HomeComponent.dataSaving.project_number = this.projectNumber
    HomeComponent.config.customerPN = this.customerPN;
    
    HomeComponent.config.PDMLINK = this.PDMLINK;
    HomeComponent.config.countSides = this.countSides;


    HomeComponent.modernHorizontalNext();
    //return this.http.post(this.url, data);
  }
}
