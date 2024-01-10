import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import Stepper from "bs-stepper";
import {ProjectModel} from "../../../../../../Domain/Entities/DrawingGenerator/Project.model";
import {ComponentModel} from "../../../../../../Domain/Entities/MasterData/Component.model";
import { DataSavingModel } from 'app/Domain/Entities/DrawingGenerator/DataSaving.model';
import { EditService } from '../../../edit.service';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step6Component } from './step6/step6.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'chat-application' }
})
export class HomeComponent implements OnInit , OnDestroy{

  // step 1
  public updateBool : boolean = false
  public receivedData:any;
  static modernWizardStepper: Stepper;
  static dataSaving: DataSavingModel = new DataSavingModel();
  static config: ProjectModel = new ProjectModel();
  
  static compo: ComponentModel = new ComponentModel();
  static diagramNodeData = [];

  constructor(private editService:EditService){

  }
  ngOnInit(): void {
    console.log("iniiiiiit");


    HomeComponent.modernWizardStepper = new Stepper(document.querySelector('#stepper'), {
      linear: false,
      animation: true
    });

    this.updateBool = this.editService.getUpdateBool();
    Step1Component.updateBool = this.updateBool;
    Step6Component.updateBool = this.updateBool;
    this.receivedData = this.editService.getSharedData();
    Step1Component.partNumberEdit = this.receivedData.te_pn;
    Step1Component.revEdit = this.receivedData.rev;
    Step2Component.cpn= this.receivedData.cpn;
    Step2Component.project_number = this.receivedData.project_number;
    Step2Component.id_harnesmaker = this.receivedData.id_harnessmaker;
    Step2Component.id_oem = this.receivedData.id_oem;  
    Step2Component.countConnectors = this.receivedData.connectorDrawings.length;  

  }

  ngOnDestroy(): void {
    this.updateBool = this.editService.clearUpdateBool();
    this.receivedData = this.editService.clearSharedData();
    Step1Component.partNumberEdit = "";
    Step1Component.revEdit = "";
    Step2Component.cpn= "";
    Step2Component.project_number = "";
    Step2Component.id_harnesmaker = "";
    Step2Component.id_oem = "";  
    Step2Component.countConnectors = 2; 
    Step1Component.updateBool = false;
    Step6Component.updateBool = false;
    console.log("detroy");
  }



  static modernHorizontalPrevious(step) {

    switch (step) {
      case "step4":
        this.config.cd_picture = null;
        this.config.cd_bom = null;
        this.config.cd_notes = null;
        this.config.cd_lengths = null;
        this.config.pd_picture = null;
        this.config.pd_notes = null;
        this.config.pd_bom = null;
        this.config.pd_lengths = null;
        this.config.packaging = null;
        this.config.pinning = null;
        this.config.cableId = null;        
        this.config.categoryId = null;
        this.config.oemId = null;
        this.config.oemname = null;
        
        this.config.PDMLINK = null;
        break;
      case "step3":
        this.config.left = null;
        this.config.right = null;
        this.config.cd_bom = null;
        break;
      case "step2":
        this.config.countSides = null;
        this.config.projectNumber = null;
        this.config.customerPN = null;
        this.config.oemId = null;
        this.config.oemname = null;
        this.config.harnessMakerId = null;
        break;
      case "step1":
        this.config.partNumber = null;
        break;
    }
    this.modernWizardStepper.previous();
  }

  modernHorizontalPrevious() {
    //   NewDrawingComponent.modernHorizontalPrevious("ste");
  }

  modernHorizontalNext() {
    HomeComponent.modernHorizontalNext();
  }

  static modernHorizontalNext() {
    this.modernWizardStepper.next();
   // console.log(HomeComponent.config);
  }


  static updateConfig(config) {
    this.config = config;
    this.modernWizardStepper.next();
  }

  getConfig(){
    return HomeComponent.config;
  }

  cd_allTablesLoaded() {
    return HomeComponent.config.cd_bom != null
        && HomeComponent.config.cd_lengths!=null
        && HomeComponent.config.pinning!=null
        && HomeComponent.config.cd_picture!=null
        && HomeComponent.config.cd_notes!=null;
  }


  pd_allTablesLoaded() {
    return HomeComponent.config.pd_bom != null
        && HomeComponent.config.pd_picture!=null
        && HomeComponent.config.pinning!=null
        && HomeComponent.config.pd_notes!=null
        && HomeComponent.config.packaging!=null;
  }

  sides_Loaded() {
    return HomeComponent.config.left != null
        && HomeComponent.config.right != null;
  }
}
